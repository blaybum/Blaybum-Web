'use client';

import { Sprout, Wheat, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import WeatherBackground from '@/components/farm/WeatherBackground';
import { api } from '@/lib/api';
import type { DailyBreakdown } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';

type DayState = 'empty' | 'seeded' | 'sprout' | 'harvested';

function getStartOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

export default function FarmHistoryPage() {
    const isAuthed = useAuthGuard();
    const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy' | 'snowy'>('sunny');
    const [daysInMonth, setDaysInMonth] = useState<{ day: number; state: DayState }[]>([]);
    const [summary, setSummary] = useState({ studyDays: 0, harvested: 0, totalHours: 0 });

    const today = useMemo(() => new Date(), []);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            const todayStr = today.toISOString().slice(0, 10);
            const weekStart = getStartOfWeek(new Date(today));
            const weekStartStr = weekStart.toISOString().slice(0, 10);

            const year = today.getFullYear();
            const month = today.getMonth();
            const lastDate = new Date(year, month + 1, 0).getDate();
            setDaysInMonth(
                Array.from({ length: lastDate }, (_, i) => ({ day: i + 1, state: 'empty' as DayState }))
            );

            // Fetch data with error handling for each request
            let weeklyData = null;
            let pomoData = null;

            try {
                // Try to fetch weekly stats, but don't fail properly if backend errors (500)
                try {
                    weeklyData = await api.statistics.plannerWeekly(weekStartStr);
                } catch (e) {
                    console.warn('Failed to load weekly stats, using empty default:', e);
                    // Mock empty data structure to prevent page crash
                    weeklyData = {
                        week_start: weekStartStr,
                        week_end: weekStartStr,
                        total_todos: 0,
                        completed_todos: 0,
                        completion_rate: 0,
                        daily_breakdown: []
                    };
                }

                try {
                    pomoData = await api.statistics.pomoDaily(todayStr);
                } catch (e) {
                    console.warn('Failed to load pomo stats:', e);
                    pomoData = {
                        date: todayStr,
                        total_study_time_minutes: 0,
                        pomo_count: 0,
                        completed_todos: 0,
                        total_distraction_count: 0
                    };
                }

                if (weeklyData && pomoData) {
                    const breakdownMap = new Map<string, DailyBreakdown>();
                    // Handle case where daily_breakdown might be undefined or map (due to backend bug)
                    if (Array.isArray(weeklyData.daily_breakdown)) {
                        weeklyData.daily_breakdown.forEach((item) => breakdownMap.set(item.date, item));
                    }

                    const generated = Array.from({ length: lastDate }, (_, i) => {
                        const day = i + 1;
                        const date = new Date(year, month, day);
                        const dateKey = date.toISOString().slice(0, 10);
                        const breakdown = breakdownMap.get(dateKey);
                        let state: DayState = 'empty';
                        if (breakdown && breakdown.total > 0) {
                            if (breakdown.completed >= breakdown.total) {
                                state = 'harvested';
                            } else if (breakdown.completed > 0) {
                                state = 'sprout';
                            } else {
                                state = 'seeded';
                            }
                        }
                        return { day, state };
                    });

                    setDaysInMonth(generated);
                    setSummary({
                        studyDays: Array.isArray(weeklyData.daily_breakdown) ? weeklyData.daily_breakdown.filter((item) => item.total > 0).length : 0,
                        harvested: Array.isArray(weeklyData.daily_breakdown) ? weeklyData.daily_breakdown.filter((item) => item.total > 0 && item.completed >= item.total).length : 0,
                        totalHours: Math.round(pomoData.total_study_time_minutes / 60),
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        load();
    }, [today, isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#E6F4F1] relative overflow-hidden">
            <WeatherBackground weather={weather} />

            {/* Header */}
            <div className="pt-8 pb-4 px-6 text-center relative z-10">
                <h1 className="text-2xl font-bold text-gray-800">{today.getMonth() + 1}월의 공부 농장</h1>
                <p className="text-gray-500 text-sm mt-1">탭해서 날짜별 기록을 확인하세요</p>

                {/* Weather Toggles (Hidden but kept for demo if needed, or remove) */}
                <div className="flex justify-center gap-2 mt-2 opacity-50 hover:opacity-100 transition-opacity">
                    <button onClick={() => setWeather('sunny')} className="text-sm">☀️</button>
                    <button onClick={() => setWeather('cloudy')} className="text-sm">☁️</button>
                    <button onClick={() => setWeather('rainy')} className="text-sm">☔️</button>
                    <button onClick={() => setWeather('snowy')} className="text-sm">❄️</button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 px-4 relative z-10 overflow-y-auto pb-40">
                <div className="grid grid-cols-7 gap-2">
                    {daysInMonth.map((item) => (
                        <Link
                            key={item.day}
                            href={`/goal/farm/${item.day}`}
                            className={`
                                aspect-square rounded-lg flex items-center justify-center relative
                                ${item.state === 'empty' ? 'bg-[#D6C4A0] opacity-60' : ''}
                                ${item.state === 'seeded' ? 'bg-[#A8D5BA]' : ''}
                                ${item.state === 'sprout' ? 'bg-[#4CAF50]' : ''}
                                ${item.state === 'harvested' ? 'bg-[#2E7D32]' : ''}
                                shadow-sm hover:scale-105 transition-transform
                            `}
                        >
                            <span className={`text-[10px] absolute top-1 left-1 ${item.state === 'empty' ? 'text-gray-600' : 'text-white/80'}`}>
                                {item.day}
                            </span>

                            {/* Visuals based on state */}
                            {item.state === 'seeded' && (
                                <div className="w-2 h-2 rounded-full bg-[#5D4037]" />
                            )}
                            {item.state === 'sprout' && (
                                <Sprout size={16} className="text-[#C8E6C9]" />
                            )}
                            {item.state === 'harvested' && (
                                <span className="text-lg">🌽</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom Sheet Summary */}
            <div className="absolute bottom-[80px] left-4 right-4 bg-white rounded-3xl p-6 shadow-xl z-20">
                <h3 className="text-center font-bold text-gray-800 mb-6">이번 달 성장 요약</h3>

                <div className="flex justify-between px-4 mb-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Sprout className="text-green-600" size={24} />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">{summary.studyDays}일</div>
                            <div className="text-xs text-gray-500">공부한 날</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Wheat className="text-yellow-600" size={24} />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">{summary.harvested}개</div>
                            <div className="text-xs text-gray-500">수확 완료</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">{summary.totalHours}시간</div>
                            <div className="text-xs text-gray-500">총 공부</div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 text-xs text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#D6C4A0] rounded-sm" /> 빈 논
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#A8D5BA] rounded-sm" /> 씨앗
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#4CAF50] rounded-sm" /> 새싹
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#2E7D32] rounded-sm" /> 수확
                    </div>
                </div>

                <Link href="/goal">
                    <button className="w-full bg-[#22C55E] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors">
                        🏠 오늘로 돌아가기
                    </button>
                </Link>
            </div>
        </div>
    );
}
