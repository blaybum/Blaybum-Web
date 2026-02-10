'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Star } from 'lucide-react';
import { api } from '@/lib/api';
import type { PomoResponse, TodoResponse } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';

export default function FeedbackDetailPage() {
    const isAuthed = useAuthGuard();
    const params = useParams();
    const feedbackId = Number(params.id);
    const [pomo, setPomo] = useState<PomoResponse | null>(null);
    const [todo, setTodo] = useState<TodoResponse | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            const list = await api.pomos.list({ page: 1, limit: 10 });
            const index = Number.isFinite(feedbackId) ? Math.max(0, feedbackId - 1) : 0;
            const selected = list[index] ?? list[0];
            setPomo(selected ?? null);
            if (selected?.todo_id) {
                const todoItem = await api.todos.get(selected.todo_id);
                setTodo(todoItem);
            }
        };
        load();
    }, [feedbackId, isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-6 py-8 space-y-6">
            <Link href="/goal/feedback" className="text-sm text-gray-500">← 피드백 목록</Link>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MessageCircle size={16} />
                    <span>멘토 피드백</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">오늘의 성장 메시지</h1>
            </div>

            <div className="bg-[#F0FDF4] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Star className="text-green-500" size={18} />
                    <span className="text-sm font-semibold text-green-700">멘토 코멘트</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {todo ? `"${todo.title}" 과제를 잘 진행했어요. 특히 집중한 시간과 꾸준함이 인상적이에요.` : '오늘도 꾸준히 성장했어요!'}
                </p>
            </div>

            <div className="bg-white border rounded-2xl p-5 space-y-2">
                <div className="text-xs text-gray-400">집중 기록</div>
                <div className="text-sm text-gray-700">시작: {pomo?.real_start_time ?? '기록 없음'}</div>
                <div className="text-sm text-gray-700">종료: {pomo?.real_end_time ?? '기록 없음'}</div>
                <div className="text-sm text-gray-700">방해 횟수: {pomo?.distraction_count ?? 0}</div>
            </div>
        </div>
    );
}
