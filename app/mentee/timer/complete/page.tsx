'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import type { PomoResponse } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainderMinutes = minutes % 60;
    const remainderSeconds = seconds % 60;
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(remainderMinutes)}:${pad(remainderSeconds)}`;
}

export default function TimerCompletePage() {
    const isAuthed = useAuthGuard();
    const router = useRouter();
    const [time, setTime] = useState(0);
    const [pomoId, setPomoId] = useState<string | null>(null);
    const [pomo, setPomo] = useState<PomoResponse | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setTime(Number(params.get('time') ?? 0));
        setPomoId(params.get('pomoId'));
    }, []);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            if (!pomoId) return;
            try {
                const fetched = await api.pomos.get(pomoId);
                setPomo(fetched);
            } catch (error) {
                console.error('Failed to load pomo:', error);
            }
        };
        load();
    }, [pomoId, isAuthed]);

    const handleEdit = async () => {
        if (!isAuthed) return;
        if (!pomoId) return;
        try {
            const minutesInput = window.prompt('수정할 집중 시간(분)을 입력해주세요.', `${Math.max(1, Math.round(time / 60))}`);
            if (!minutesInput) return;
            const minutes = Number(minutesInput);
            if (Number.isNaN(minutes)) return;
            const start = pomo?.edit_start_time ?? pomo?.real_start_time ?? new Date().toISOString();
            const end = new Date(new Date(start).getTime() + minutes * 60000).toISOString();
            const updated = await api.pomos.update(pomoId, { edit_start_time: start, edit_end_time: end });
            setPomo(updated);
            alert('집중 시간이 수정되었습니다.');
        } catch (error) {
            console.error('Failed to update pomo:', error);
            alert('수정에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        if (!isAuthed) return;
        if (!pomoId) return;
        if (!confirm('이 기록을 삭제할까요?')) return;
        try {
            await api.pomos.delete(pomoId);
            router.push('/goal');
        } catch (error) {
            console.error('Failed to delete pomo:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center px-6 relative pb-24">
            <div className="absolute top-12 text-center w-full">
                <h1 className="text-xl font-bold text-gray-900">집중 완료</h1>
            </div>

            <div className="text-center space-y-2 mb-10">
                <CheckCircle2 className="text-green-500 mx-auto" size={48} />
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">오늘도 한 걸음 성장했어요</h2>
                <p className="text-gray-500">기록된 시간: {formatDuration(time)}</p>
            </div>

            <div className="w-full bg-white rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={16} />
                    <span>집중 기록</span>
                </div>
                <div className="text-gray-800 text-sm">
                    {pomo?.real_start_time ? `시작: ${pomo.real_start_time}` : '시작 시간 기록 대기'}
                </div>
                <div className="text-gray-800 text-sm">
                    {pomo?.real_end_time ? `종료: ${pomo.real_end_time}` : '종료 시간 기록 대기'}
                </div>
                <div className="text-gray-800 text-sm">
                    방해 횟수: {pomo?.distraction_count ?? 0}
                </div>
            </div>

            <div className="w-full space-y-3 mt-6">
                <button
                    onClick={handleEdit}
                    className="w-full bg-white text-gray-700 py-3 rounded-xl font-bold text-sm border"
                >
                    기록 수정하기
                </button>
                <button
                    onClick={handleDelete}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm"
                >
                    기록 삭제하기
                </button>
                <Link href="/goal" className="w-full">
                    <button className="w-full bg-[#22C55E] text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg">
                        오늘로 돌아가기
                    </button>
                </Link>
            </div>
        </div>
    );
}
