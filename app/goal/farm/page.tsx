'use client';

import { Sprout, Wheat, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import WeatherBackground from '@/components/farm/WeatherBackground';

export default function FarmHistoryPage() {
    const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy' | 'snowy'>('sunny');

    // 31 days mock data
    // states: 'empty' | 'seeded' | 'sprout' | 'harvested'
    const daysInMonth = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        let state: 'empty' | 'seeded' | 'sprout' | 'harvested' = 'empty';
        if ([2, 3, 4, 5, 6, 7].includes(day)) state = 'seeded';
        if ([8, 9, 10, 11, 12].includes(day)) state = 'sprout';
        if ([13, 16, 20].includes(day)) state = 'harvested';

        return { day, state };
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#E6F4F1] relative overflow-hidden">
            <WeatherBackground weather={weather} />

            {/* Header */}
            <div className="pt-8 pb-4 px-6 text-center relative z-10">
                <h1 className="text-2xl font-bold text-gray-800">3월의 공부 농장</h1>
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
                            <div className="font-bold text-xl">12일</div>
                            <div className="text-xs text-gray-500">공부한 날</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Wheat className="text-yellow-600" size={24} />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">5개</div>
                            <div className="text-xs text-gray-500">수확 완료</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">24시간</div>
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
