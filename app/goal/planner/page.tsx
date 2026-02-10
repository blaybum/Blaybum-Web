'use client';

export const dynamic = 'force-dynamic';

import TaskCard from '@/components/goal/TaskCard';
import { ChevronLeft, Sprout } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import useAuthGuard from '@/lib/useAuthGuard';
import type { PlannerResponse, TodoResponse } from '@/lib/api/types';

const priorityColor: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-green-500',
    low: 'bg-blue-500',
};

const priorityLabel: Record<string, string> = {
    high: '높음',
    medium: '보통',
    low: '낮음',
};

function formatKoreanDate(dateStr: string) {
    const date = new Date(`${dateStr}T00:00:00`);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`;
}

export default function PlannerPage() {
    const isAuthed = useAuthGuard();
    const router = useRouter();
    const [dateParam, setDateParam] = useState<string | null>(null);
    const today = useMemo(() => dateParam ?? new Date().toISOString().slice(0, 10), [dateParam]);

    const [planner, setPlanner] = useState<PlannerResponse | null>(null);
    const [todos, setTodos] = useState<TodoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [goalDraft, setGoalDraft] = useState('');
    const [savingGoal, setSavingGoal] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthed) return;
        const params = new URLSearchParams(window.location.search);
        setDateParam(params.get('date'));
    }, [isAuthed]);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            setLoading(true);
            try {
                let planners = await api.planners.list({ start_date: today, end_date: today });
                let current = planners[0];
                if (!current) {
                    // Auto-create planner for today if it doesn't exist
                    try {
                        current = await api.planners.create({ plan_date: today });
                    } catch (createError) {
                        console.error('Failed to create planner:', createError);
                        setLoading(false);
                        return;
                    }
                }

                const fetchedPlanner = await api.planners.get(current.planner_id);
                setPlanner(fetchedPlanner);
                setGoalDraft(fetchedPlanner.daily_goal?.toString() ?? '');

                let list = await api.todos.list({ planner_id: current.planner_id, sort_by: 'order_index' });
                if (list.length === 0) {
                    // Add default todos for new planners
                    try {
                        await api.todos.create({
                            planner_id: current.planner_id,
                            title: '문학 작품 분석하기',
                            description: '현대시 3편 감상문 작성',
                            priority: 'high',
                            estimated_duration_minutes: 50,
                        });
                        await api.todos.create({
                            planner_id: current.planner_id,
                            title: '독해 지문 풀이 5개',
                            description: '어휘 정리 포함',
                            priority: 'medium',
                            estimated_duration_minutes: 40,
                        });
                        list = await api.todos.list({ planner_id: current.planner_id, sort_by: 'order_index' });
                    } catch (todoError) {
                        console.error('Failed to create default todos:', todoError);
                    }
                }
                setTodos(list);
            } catch (error) {
                console.error('Failed to load planner:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [today, isAuthed]);

    const handleToggle = async (todo: TodoResponse) => {
        const nextStatus = todo.status === 'done' ? 'todo' : 'done';
        const updated = await api.todos.patch(todo.todo_id, { status: nextStatus });
        setTodos((prev) => prev.map((item) => (item.todo_id === todo.todo_id ? updated : item)));
    };

    const handleDelete = async (todo: TodoResponse) => {
        if (!confirm('이 할 일을 삭제할까요?')) return;
        await api.todos.delete(todo.todo_id);
        setTodos((prev) => prev.filter((item) => item.todo_id !== todo.todo_id));
    };

    const handleUpdate = async (todo: TodoResponse) => {
        const title = window.prompt('새 제목을 입력해주세요.', todo.title);
        if (!title) return;
        const description = window.prompt('설명을 입력해주세요.', todo.description ?? '') ?? '';
        const updated = await api.todos.update(todo.todo_id, { title, description });
        setTodos((prev) => prev.map((item) => (item.todo_id === todo.todo_id ? updated : item)));
    };

    const handleReorder = async () => {
        if (!planner || todos.length === 0) return;
        const reordered = [...todos].reverse();
        const orders = reordered.map((item, index) => ({ todo_id: item.todo_id, order_index: index }));
        await api.todos.reorder(reordered[0].todo_id, { planner_id: planner.planner_id, orders });
        setTodos(reordered.map((item, index) => ({ ...item, order_index: index })));
    };

    const handleSaveGoal = async () => {
        if (!planner) return;
        setSavingGoal(true);
        setSaveMessage(null);
        try {
            const goalNum = parseInt(goalDraft, 10);
            const updated = await api.planners.update(planner.planner_id, { daily_goal: Number.isNaN(goalNum) ? null : goalNum });
            setPlanner(updated);
            setGoalDraft(updated.daily_goal?.toString() ?? '');
            setSaveMessage('목표가 저장되었습니다.');
        } catch (error) {
            console.error('Failed to save goal:', error);
            setSaveMessage('목표 저장에 실패했습니다.');
        } finally {
            setSavingGoal(false);
        }
    };

    const handleDeletePlanner = async () => {
        if (!planner) return;
        if (!confirm('오늘 플래너를 삭제할까요?')) return;
        await api.planners.delete(planner.planner_id);
        router.push('/goal');
    };

    const firstTodo = todos[0];

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="pt-8 px-5 pb-24 space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/goal" className="p-1">
                    <ChevronLeft className="text-gray-400" />
                </Link>
                <div>
                    <h2 className="text-green-600/80 font-medium text-sm">{planner ? formatKoreanDate(planner.plan_date) : '오늘'}</h2>
                    <h1 className="text-xl font-bold text-gray-800">오늘의 할 일</h1>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="text-xs text-gray-400">오늘의 목표</div>
                <input
                    value={goalDraft}
                    onChange={(event) => setGoalDraft(event.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="오늘 이루고 싶은 목표를 적어보세요"
                />
                <button
                    onClick={handleSaveGoal}
                    disabled={savingGoal}
                    className="w-full py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold disabled:opacity-60"
                >
                    {savingGoal ? '저장 중...' : '목표 저장하기'}
                </button>
                {saveMessage && (
                    <div className="text-xs text-gray-500">{saveMessage}</div>
                )}
            </div>

            {loading && <div className="text-sm text-gray-400">플래너를 불러오는 중...</div>}

            <div className="space-y-6">
                {todos.map((todo) => (
                    <div key={todo.todo_id} className="space-y-3">
                        <TaskCard
                            subject={priorityLabel[todo.priority ?? 'medium'] ?? '보통'}
                            subjectColor={priorityColor[todo.priority ?? 'medium'] ?? 'bg-green-500'}
                            title={todo.title}
                            description={todo.description ?? '설명이 없습니다.'}
                            seedPrompt={todo.status === 'done' ? '오늘의 공부를 완료했어요! 🎉' : '집중해서 완료해볼까요?'}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleToggle(todo)}
                                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold"
                            >
                                {todo.status === 'done' ? '다시 하기' : '완료 표시'}
                            </button>
                            <Link
                                href={`/goal/timer?todoId=${todo.todo_id}`}
                                className="flex-1 py-2 rounded-xl bg-green-400 text-white text-sm font-semibold text-center"
                            >
                                타이머 시작
                            </Link>
                            <button
                                onClick={() => handleUpdate(todo)}
                                className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 text-sm font-semibold"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDelete(todo)}
                                className="px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-semibold"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleReorder}
                    className="w-full py-3 rounded-xl bg-white border border-dashed border-gray-200 text-gray-500 text-sm"
                >
                    순서 바꾸기 (리버스)
                </button>
                <button
                    onClick={handleDeletePlanner}
                    className="w-full py-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold"
                >
                    오늘 플래너 삭제
                </button>

                <Link
                    href={firstTodo ? `/goal/timer?todoId=${firstTodo.todo_id}` : '/goal/timer'}
                    className="block w-full text-center py-4 rounded-2xl bg-green-400/80 text-white font-bold text-lg shadow-[0_4px_0_0_#86D8B1] active:translate-y-[2px] active:shadow-none transition-all hover:bg-green-400"
                >
                    공부 시작하기
                </Link>
            </div>

            <div className="pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-400">남은 할 일</h3>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    </div>
                </div>

                <div className="bg-[#FAF9F4] rounded-2xl p-4 flex items-center gap-4 border border-gray-100/50">
                    <div className="w-12 h-12 rounded-xl bg-green-300/50 flex items-center justify-center text-white">
                        <Sprout size={20} fill="currentColor" />
                    </div>
                    <div>
                        <span className="bg-red-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">자동 추천</span>
                        <div className="text-gray-600 font-medium">{planner?.memo ?? '다음 할 일을 준비해보세요'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
