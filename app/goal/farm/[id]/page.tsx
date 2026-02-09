'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FarmDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const day = id;

    // Mock Data based on design
    const isHarvested = true; // "수확 완료"
    const completedTasks = 3;
    const studyHours = "2시간";
    const quote = "오늘은 집중이 정말 잘 됐어요. 특히 백학 문제를 풀 때 막히지 않고 술술 풀렸어요!";

    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center pt-6 px-5 pb-24">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-black/5 rounded-full">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-800">3월 {day}일 공부 기록</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Visual Card */}
            <div className="w-full bg-[#6EE7B7] rounded-[30px] p-8 relative mb-4 h-[320px] shadow-sm flex flex-col items-center justify-center overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-300 rounded-full opacity-60" />
                <div className="absolute bottom-10 left-6 w-3 h-3 bg-yellow-300 rounded-full opacity-60" />

                {/* Crops Illustration (Simple CSS representation) */}
                <div className="flex items-end gap-2 mb-8 relative z-10">
                    <div className="w-6 h-32 bg-green-700 rounded-t-full relative">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full absolute -top-4 -left-1" />
                    </div>
                    <div className="w-6 h-40 bg-green-700 rounded-t-full relative -mx-1">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full absolute -top-5 -left-2" />
                    </div>
                    <div className="w-6 h-28 bg-green-700 rounded-t-full relative">
                        <div className="w-7 h-7 bg-yellow-400 rounded-full absolute -top-3 -left-0.5" />
                    </div>
                </div>

                {/* Ground */}
                <div className="absolute w-[80%] h-8 bg-[#5D5D5D] opacity-20 rounded-[50%] bottom-20 blur-md" />

                <div className="bg-white rounded-full px-5 py-2 text-green-700 font-bold text-sm shadow-sm relative z-20">
                    성장 단계: 수확 완료
                </div>
            </div>

            {/* Stats Card */}
            <div className="w-full bg-white rounded-2xl p-6 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800 text-lg">이날의 성과</h2>
                    <CheckCircle2 className="text-green-500" size={24} />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-[#F0FDF4] rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-green-600">{completedTasks}개</div>
                        <div className="text-sm text-gray-500">완료한 할 일</div>
                    </div>
                    <div className="flex-1 bg-[#EFF6FF] rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-blue-600">{studyHours}</div>
                        <div className="text-sm text-gray-500">총 공부 시간</div>
                    </div>
                </div>
            </div>

            {/* Completed Subjects List (Mock) */}
            <div className="w-full bg-white rounded-2xl p-6 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        📚
                    </div>
                    <h2 className="font-bold text-gray-800">완료한 과목</h2>
                </div>

                <Link href={`/goal/planner/1`}>
                    <button className="w-full bg-[#22C55E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                        <Calendar size={20} />
                        이날 플래너 보기
                    </button>
                </Link>
            </div>

            {/* Quote of the Day */}
            <div className="w-full bg-[#DCFCE7] rounded-2xl p-6 shadow-sm">
                <h3 className="text-green-800 font-bold mb-2 flex items-center gap-2">
                    ❝ 이날의 한마디
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    "{quote}"
                </p>
            </div>
        </div>
    );
}
