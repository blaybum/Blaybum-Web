'use client';

import FarmGrid from '@/components/goal/FarmGrid';
import Link from 'next/link';

export default function GoalPage() {
    return (
        <div className="flex flex-col items-center pt-16 px-6 space-y-8">
            <div className="text-center space-y-2">
                <span className="text-gray-400 text-sm font-medium">오늘</span>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    오늘 심을 공부가 있어요 <span className="text-green-500">🌱</span>
                </h1>
            </div>

            <div className="w-full max-w-xs">
                <FarmGrid />
            </div>

            <div className="w-full max-w-xs space-y-4 pt-4">
                <Link
                    href="/goal/planner"
                    className="block w-full text-center py-4 rounded-2xl bg-green-400/80 text-white font-bold text-lg shadow-[0_4px_0_0_#86D8B1] active:translate-y-[2px] active:shadow-none transition-all hover:bg-green-400"
                >
                    오늘 공부 시작하기
                </Link>
                <button className="block w-full text-center text-gray-400 text-sm py-2">
                    어제 보기
                </button>
            </div>

            <div className="absolute left-10 bottom-32 opacity-50">
                <span className="text-2xl">🦋</span>
            </div>
        </div>
    );
}
