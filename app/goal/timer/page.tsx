'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Timer from '@/components/timer/Timer';
import QuitModal from '@/components/common/QuitModal';
import { api } from '@/lib/api';
import type { TodoResponse } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';

export default function TimerPage() {
    const isAuthed = useAuthGuard();
    const router = useRouter();
    const [todoId, setTodoId] = useState<string | null>(null);

    const [showQuitModal, setShowQuitModal] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [todo, setTodo] = useState<TodoResponse | null>(null);
    const [pomoId, setPomoId] = useState<string | null>(null);
    const [startIso, setStartIso] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('todoId');
        setTodoId(id);
        const load = async () => {
            if (!isAuthed) return;
            if (!id) return;
            const fetched = await api.todos.get(id);
            setTodo(fetched);
        };
        load();
    }, [isAuthed]);

    const handleStop = (time: number) => {
        setElapsedTime(time);
        setShowQuitModal(true);
    };

    const handleStart = async () => {
        if (!isAuthed) return;
        const now = new Date().toISOString();
        setStartIso((prev) => prev ?? now);
        if (pomoId || !todo) return;
        const created = await api.pomos.create({
            planner_id: todo.planner_id,
            todo_id: todo.todo_id,
            real_start_time: now,
            real_end_time: now,
            category: '기타',
        });
        setPomoId(created.id);
        await api.pomos.addConcentration(created.id, { event_type: 'PICK_UP', timestamp: now });
    };

    const handlePause = async () => {
        if (!isAuthed) return;
        if (!pomoId) return;
        await api.pomos.addConcentration(pomoId, { event_type: 'PUT_DOWN', timestamp: new Date().toISOString() });
    };

    const handleResume = async () => {
        if (!isAuthed) return;
        if (!pomoId) return;
        await api.pomos.addConcentration(pomoId, { event_type: 'PICK_UP', timestamp: new Date().toISOString() });
    };

    const handleConfirmQuit = async () => {
        if (!isAuthed) return;
        const endIso = new Date().toISOString();
        const start = startIso ?? new Date(Date.now() - elapsedTime * 1000).toISOString();

        let finalPomoId = pomoId;
        if (!finalPomoId && todo) {
            const created = await api.pomos.create({
                planner_id: todo.planner_id,
                todo_id: todo.todo_id,
                real_start_time: start,
                real_end_time: endIso,
                category: '기타',
            });
            finalPomoId = created.id;
        }

        if (finalPomoId) {
            await api.pomos.update(finalPomoId, { edit_start_time: start, edit_end_time: endIso });
            await api.pomos.addConcentration(finalPomoId, { event_type: 'PUT_DOWN', timestamp: endIso });
        }

        router.push(`/goal/timer/complete?time=${elapsedTime}&pomoId=${finalPomoId ?? ''}`);
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF4] flex flex-col relative">
            {/* Header */}
            <div className="flex items-center px-4 h-14">
                <button
                    onClick={() => setShowQuitModal(true)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 text-center pr-10">
                    <span className="font-bold text-gray-800">{todo?.title ?? '집중 타이머'}</span>
                </div>
            </div>

            {/* Timer Content */}
            <div className="flex-1 flex flex-col justify-center pb-20">
                <Timer onStop={handleStop} onStart={handleStart} onPause={handlePause} onResume={handleResume} />
            </div>

            {/* Quit Modal */}
            <QuitModal
                isOpen={showQuitModal}
                onClose={() => setShowQuitModal(false)}
                onConfirm={handleConfirmQuit}
            />
        </div>
    );
}
