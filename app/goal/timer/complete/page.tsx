'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function TimerCompleteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const time = parseInt(searchParams.get('time') || '0', 10);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) return `${hours}시간 ${minutes}분 ${secs}초`;
        return `${minutes}분 ${secs}초`;
    };

    return (
        <div className="min-h-screen bg-[#FDFBF4] flex flex-col items-center justify-center p-6 space-y-10">
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-50 duration-500">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 shadow-sm">
                    <CheckCircle2 size={48} strokeWidth={3} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">공부 완료!</h1>
                <p className="text-gray-500">오늘도 수고 많으셨어요 👏</p>
            </div>

            <div className="bg-white rounded-[24px] p-8 w-full max-w-xs shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center space-y-2">
                <span className="text-sm font-medium text-gray-400">총 공부 시간</span>
                <span className="text-4xl font-bold text-gray-800 font-mono tracking-tight">
                    {formatTime(time)}
                </span>
            </div>

            <Link
                href="/goal"
                className="w-full max-w-xs py-4 rounded-[20px] bg-gray-800 text-white font-bold text-center hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
            >
                <Home size={18} />
                홈으로 돌아가기
            </Link>
        </div>
    );
}

export default function TimerCompletePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TimerCompleteContent />
        </Suspense>
    );
}
