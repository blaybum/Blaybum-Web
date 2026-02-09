'use client';

import { use, useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, Activity, TrendingUp, CheckCircle2, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import { api } from '@/lib/api';
import type { PomoResponse } from '@/lib/api/types';
import useAuthGuard from '@/lib/useAuthGuard';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function SubjectStatsPage({ params }: { params: Promise<{ subject: string }> }) {
    const isAuthed = useAuthGuard();
    const { subject: subjectParam } = use(params);
    const router = useRouter();
    const subject = decodeURIComponent(subjectParam);

    // Chart Data
    const [stats, setStats] = useState<{
        labels: string[];
        data: number[];
        totalTime: number;
        pomoCount: number;
        avgFocus: number;
        bestHour: number | null;
        avgSessionMinutes: number;
        improvementRate: number;
    } | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            const list = await api.pomos.list({ limit: 100 });
            // Filter by subject
            const subjectPomos = list.filter((p: PomoResponse) => p.category === subject);

            // Calculate stats
            let totalMinutes = 0;
            let totalDistractions = 0;
            const dailyMap = new Map<string, number>();
            const hourlyMap = new Map<number, number>();
            const now = new Date();
            const last7Start = new Date(now);
            last7Start.setDate(now.getDate() - 6);
            const prev7Start = new Date(now);
            prev7Start.setDate(now.getDate() - 13);
            const prev7End = new Date(now);
            prev7End.setDate(now.getDate() - 7);
            let lastMinutes = 0;
            let lastCount = 0;
            let prevMinutes = 0;
            let prevCount = 0;

            subjectPomos.forEach((p: PomoResponse) => {
                const start = new Date(p.edit_start_time || p.real_start_time);
                const end = new Date(p.edit_end_time || p.real_end_time);
                const minutes = (end.getTime() - start.getTime()) / 60000;
                if (minutes > 0) {
                    totalMinutes += minutes;
                    const dateKey = start.toISOString().slice(5, 10); // MM-DD
                    dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + minutes);
                    const hour = start.getHours();
                    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + minutes);
                    if (start >= last7Start) {
                        lastMinutes += minutes;
                        lastCount += 1;
                    } else if (start >= prev7Start && start <= prev7End) {
                        prevMinutes += minutes;
                        prevCount += 1;
                    }
                }
                totalDistractions += p.distraction_count;
            });

            // Generate last 7 days labels
            const labels = [];
            const dataPoints = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(5, 10);
                labels.push(key);
                dataPoints.push(Math.round(dailyMap.get(key) || 0));
            }

            let bestHour: number | null = null;
            let bestMinutes = 0;
            hourlyMap.forEach((minutes, hour) => {
                if (minutes > bestMinutes) {
                    bestMinutes = minutes;
                    bestHour = hour;
                }
            });

            const avgSessionMinutes = subjectPomos.length ? Math.round(totalMinutes / subjectPomos.length) : 0;
            const avgFocus = subjectPomos.length
                ? Math.max(0, Math.min(100, Math.round(100 - (totalDistractions / subjectPomos.length) * 10)))
                : 100;
            const lastAvg = lastCount ? lastMinutes / lastCount : 0;
            const prevAvg = prevCount ? prevMinutes / prevCount : 0;
            const improvementRate = prevAvg ? Math.round(((lastAvg - prevAvg) / prevAvg) * 100) : 0;

            setStats({
                labels,
                data: dataPoints,
                totalTime: Math.round(totalMinutes),
                pomoCount: subjectPomos.length,
                avgFocus,
                bestHour,
                avgSessionMinutes,
                improvementRate,
            });
        };
        load();
    }, [subject, isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    const data = {
        labels: stats?.labels ?? [],
        datasets: [
            {
                label: '집중 시간 (분)',
                data: stats?.data ?? [],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#FFFFFF',
                pointBorderWidth: 2,
            },
        ],
    };

    const displayTotalTime = stats ? (stats.totalTime > 60 ? `${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m` : `${stats.totalTime}m`) : '0m';
    const bestHourLabel = stats && stats.bestHour !== null ? `${stats.bestHour}시` : '-';

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                display: false,
                min: 50,
            },
            x: {
                grid: { display: false },
            }
        },
        elements: {
            line: {
                borderWidth: 3,
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F5] flex flex-col px-5 pt-6 pb-24">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="hover:bg-black/5 p-2 rounded-full -ml-2">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <div className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center font-bold text-sm">국</div>
                <h1 className="text-lg font-bold text-gray-900">{subject} 집중력</h1>
            </div>

            {/* Top Stats Card (Gradient) */}
            <div className="bg-gradient-to-br from-[#EF4444] to-[#DB2777] rounded-[30px] p-8 text-white mb-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                    <BookOpen size={60} />
                </div>

                <h2 className="text-4xl font-bold mb-1">{stats?.avgFocus ?? 0}%</h2>
                <p className="opacity-80 text-sm mb-6">평균 집중도</p>

                <div className="flex justify-between gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex-1 text-center">
                        <div className="font-bold text-xl">{stats?.pomoCount ?? 0}</div>
                        <div className="text-[10px] opacity-80">집중 세션</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex-1 text-center">
                        <div className="font-bold text-xl">{displayTotalTime}</div>
                        <div className="text-[10px] opacity-80">공부 시간</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex-1 text-center">
                        <div className="font-bold text-xl">{stats?.avgFocus ?? 0}%</div>
                        <div className="text-[10px] opacity-80">평균 집중도</div>
                    </div>
                </div>
            </div>

            {/* Time Filter */}
            <div className="bg-white rounded-2xl p-2 mb-6 flex gap-2">
                <button className="flex-1 bg-[#EF4444] text-white py-2 rounded-xl text-sm font-bold shadow-sm">오늘</button>
                <button className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl text-sm font-medium hover:bg-gray-200">이번 주</button>
                <button className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl text-sm font-medium hover:bg-gray-200">이번 달</button>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-[30px] p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800 text-lg">집중력 추이</h2>
                    <TrendingUp className="text-[#EF4444]" size={20} />
                </div>
                <div className="h-48 w-full">
                    <Line data={data} options={options} />
                </div>
            </div>

            {/* Detail Analysis */}
            <div className="bg-white rounded-[30px] p-6 mb-6 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-800 text-lg mb-2">세부 분석</h2>

                <div className="bg-[#FFF1F2] rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <div className="text-sm text-gray-600 font-bold mb-1">최고 집중 시간대</div>
                        <div className="text-xs text-gray-400">가장 많이 집중한 시간대예요</div>
                    </div>
                    <span className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {bestHourLabel}
                    </span>
                </div>

                <div className="bg-[#FFF7ED] rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <div className="text-sm text-gray-600 font-bold mb-1">평균 집중 지속시간</div>
                        <div className="text-xs text-gray-400">한 번에 평균 집중한 시간이에요</div>
                    </div>
                    <span className="bg-[#F97316] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {stats?.avgSessionMinutes ?? 0}분
                    </span>
                </div>

                <div className="bg-[#F0FDF4] rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <div className="text-sm text-gray-600 font-bold mb-1">집중력 변화</div>
                        <div className="text-xs text-gray-400">최근 7일 평균 대비 변화율이에요</div>
                    </div>
                    <span className="bg-[#22C55E] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {stats?.improvementRate ?? 0}%
                    </span>
                </div>
            </div>

            {/* Tips Section (Yellow) */}
            <div className="bg-[#FEF9C3] rounded-[30px] p-6 mb-4 shadow-sm border border-yellow-200">
                <h3 className="flex items-center gap-2 font-bold text-yellow-800 mb-4">
                    <Lightbulb size={20} className="fill-yellow-800" />
                    집중력 향상 팁
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-2 items-start text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <span>25분 집중 + 5분 휴식 패턴을 유지해보세요</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <span>오전 시간대에 어려운 내용을 학습하면 효과적이에요</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <span>학습 전 가벼운 스트레칭으로 몸을 깨워보세요</span>
                    </li>
                </ul>
            </div>

        </div>
    );
}
