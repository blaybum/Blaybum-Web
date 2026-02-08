'use client';

import TaskCard from '@/components/goal/TaskCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlannerPage() {
    return (
        <div className="pt-8 px-5 pb-24 space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/goal" className="p-1">
                    <ChevronLeft className="text-gray-400" />
                </Link>
                <div>
                    <h2 className="text-green-600/80 font-medium text-sm">3월 12일 수요일</h2>
                    <h1 className="text-xl font-bold text-gray-800">오늘의 할 일</h1>
                </div>
            </div>

            <div className="space-y-4">
                <TaskCard
                    subject="국어"
                    subjectColor="bg-blue-500"
                    title="문학 작품 분석하기"
                    description="현대시 3편 감상문 작성"
                    seedPrompt="시를 읽으며 느낀 감정을 솔직하게 적어보세요"
                />

                <button className="w-full py-4 rounded-xl bg-green-400 text-white font-bold text-lg shadow-[0_4px_0_0_#86D8B1] active:translate-y-[2px] active:shadow-none transition-all hover:bg-green-500">
                    공부 시작하기
                </button>
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
                        <span className="bg-red-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">영어</span>
                        <div className="text-gray-600 font-medium">독해 지문 풀이 5개</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Sprout } from 'lucide-react';
