'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { PlannerDailyStatisticsResponse, PomoDailyStatisticsResponse, PlannerResponse } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';

export default function FarmDayPage({ params }: { params: Promise<{ day: string }> }) {
    const isAuthed = useAuthGuard();
    const { day: dayParam } = use(params);
    const router = useRouter();
    const dayNumber = Number(dayParam);

    // Calculate date string (assuming current year/month for simplicity as in original code)
    // IMPORTANT: Ideally, we should pass full date or handle month/year selection. 
    // The farm page logic used today's month.
    const dateStr = useMemo(() => {
        const today = new Date();
        const d = new Date(today.getFullYear(), today.getMonth(), dayNumber);
        // Handle timezone offset for local date string usually, but strict ISO slice(0,10) matches backend expectation if same timezone
        // Adjust for local timezone to ensure YYYY-MM-DD is correct
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 10);
    }, [dayNumber]);

    const [dailyStats, setDailyStats] = useState<PlannerDailyStatisticsResponse | null>(null);
    const [pomoStats, setPomoStats] = useState<PomoDailyStatisticsResponse | null>(null);
    const [planner, setPlanner] = useState<PlannerResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dayNumber || !isAuthed) return;
        const load = async () => {
            setLoading(true);
            try {
                const [daily, pomo, planners] = await Promise.all([
                    api.statistics.daily(dateStr),
                    api.statistics.pomoDaily(dateStr),
                    api.planners.list({ start_date: dateStr, end_date: dateStr })
                ]);
                setDailyStats(daily);
                setPomoStats(pomo);
                setPlanner(planners[0] ?? null);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [dateStr, dayNumber, isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    // Data for UI
    const completedTasks = dailyStats?.completed_todos ?? 0;
    const totalTasks = dailyStats?.total_todos ?? 0;
    const studyMinutes = pomoStats?.total_study_time_minutes ?? 0;
    const studyHoursFormatted = studyMinutes > 60
        ? `${Math.floor(studyMinutes / 60)}시간 ${studyMinutes % 60}분`
        : `${studyMinutes}분`;

    const quote = planner?.memo || "오늘은 기록된 한마디가 없어요.";

    // Determine growth stage
    let growthStage = "씨앗 심기";
    let growthColor = "bg-[#D6C4A0]";
    if (totalTasks > 0) {
        if (completedTasks >= totalTasks) {
            growthStage = "수확 완료";
            growthColor = "bg-[#6EE7B7]";
        } else if (completedTasks > 0) {
            growthStage = "새싹 돋음";
            growthColor = "bg-[#86D8B1]"; // Sprout color
        } else {
            growthStage = "씨앗 심기";
            growthColor = "bg-[#D6C4A0]";
        }
    } else {
        growthStage = "빈 땅";
    }

    if (!dayNumber) return <div>Invalid Date</div>;

    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center pt-6 px-5 pb-24">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-6">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-black/5 rounded-full">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-800">{new Date().getMonth() + 1}월 {dayNumber}일 공부 기록</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Visual Card */}
            <div className={`w-full ${growthColor} rounded-[30px] p-8 relative mb-4 h-[320px] shadow-sm flex flex-col items-center justify-center overflow-hidden transition-colors duration-500`}>
                {/* Background Decor */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-300 rounded-full opacity-60" />
                <div className="absolute bottom-10 left-6 w-3 h-3 bg-yellow-300 rounded-full opacity-60" />

                {/* Crops Illustration (Simple CSS representation) */}
                <div className="flex items-end gap-2 mb-8 relative z-10">
                    {growthStage === "수확 완료" ? (
                        <>
                            <div className="w-6 h-32 bg-green-700 rounded-t-full relative">
                                <div className="w-8 h-8 bg-yellow-400 rounded-full absolute -top-4 -left-1" />
                            </div>
                            <div className="w-6 h-40 bg-green-700 rounded-t-full relative -mx-1">
                                <div className="w-10 h-10 bg-yellow-400 rounded-full absolute -top-5 -left-2" />
                            </div>
                            <div className="w-6 h-28 bg-green-700 rounded-t-full relative">
                                <div className="w-7 h-7 bg-yellow-400 rounded-full absolute -top-3 -left-0.5" />
                            </div>
                        </>
                    ) : growthStage === "새싹 돋음" ? (
                        <>
                            <div className="w-4 h-16 bg-green-600 rounded-t-full relative" />
                            <div className="w-4 h-24 bg-green-600 rounded-t-full relative -mx-2" />
                            <div className="w-4 h-12 bg-green-600 rounded-t-full relative" />
                        </>
                    ) : (
                        <div className="w-full h-2 bg-[#8D6E63] rounded-full" />
                    )}
                </div>

                {/* Ground */}
                <div className="absolute w-[80%] h-8 bg-[#5D5D5D] opacity-20 rounded-[50%] bottom-20 blur-md" />

                <div className="bg-white rounded-full px-5 py-2 text-green-700 font-bold text-sm shadow-sm relative z-20">
                    성장 단계: {growthStage}
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
                        <div className="text-2xl font-bold text-green-600">{completedTasks}/{totalTasks}</div>
                        <div className="text-sm text-gray-500">완료한 할 일</div>
                    </div>
                    <div className="flex-1 bg-[#EFF6FF] rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-blue-600">{studyHoursFormatted}</div>
                        <div className="text-sm text-gray-500">총 공부 시간</div>
                    </div>
                </div>
            </div>

            {/* Completed Subjects List (Link to Planner) */}
            <div className="w-full bg-white rounded-2xl p-6 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        📚
                    </div>
                    <h2 className="font-bold text-gray-800">기록 확인</h2>
                </div>

                {/* Note: Planner page currently forces 'today'. Ideally pass date.
                    For now, linking to planner might just show today's planner. 
                    I'll link to planner home. 
                */}
                <Link href={`/goal/planner?date=${dateStr}`}>
                    <button className="w-full bg-[#22C55E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                        <Calendar size={20} />
                        플래너 보기 ({dayNumber}일)
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
