'use client';

import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Calendar, FileText, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { TodoResponse } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';

export default function AssignmentDetailPage() {
    const isAuthed = useAuthGuard();
    const router = useRouter();
    const params = useParams();
    const todoId = params.id as string;
    const [todo, setTodo] = useState<TodoResponse | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            if (!todoId) return;
            const fetched = await api.todos.get(todoId);
            setTodo(fetched);
        };
        load();
    }, [todoId, isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    const fallback = {
        title: '비문학 독해 3지문 분석',
        subject: '국어',
        date: '2024년 3월 15일 까지',
        description: '2024 수능특강 인문/예술 파트 3지문을 읽고 구조도를 작성하세요. 주요 어휘 정리도 포함해야 합니다.',
    };

    return (
        <div className="min-h-screen bg-[#FDFBF4] flex flex-col relative px-6 pt-6 pb-24">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600 mb-1"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {todo?.priority ?? fallback.subject}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                        {todo?.title ?? fallback.title}
                    </h1>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>{todo?.scheduled_time ?? fallback.date}</span>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-[200px]">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                        <FileText size={16} className="text-gray-400" />
                        과제 설명
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {todo?.description ?? fallback.description}
                    </p>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto">
                <Link
                    href={`/goal/timer?todoId=${todo?.todo_id ?? todoId}`}
                    className="w-full py-4 rounded-[20px] bg-gray-800 text-white font-bold text-center hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                >
                    <Play size={18} fill="currentColor" />
                    공부 시작하기
                </Link>
            </div>
        </div>
    );
}
