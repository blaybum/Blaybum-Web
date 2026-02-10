'use client';

import FarmGrid from '@/components/mentee/FarmGrid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import useAuthGuard from '@/lib/useAuthGuard';

export default function GoalPage() {
    const isAuthed = useAuthGuard();
    const [gridData, setGridData] = useState<Array<'empty' | 'seed' | 'sprout'>>([]);
    const [status, setStatus] = useState<{ health?: string; db?: string }>({});
    const [todaySummary, setTodaySummary] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 });

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            try {
                const today = new Date().toISOString().slice(0, 10);
                const [healthResult, dbResult, dailyResult] = await Promise.allSettled([
                    api.health.check(),
                    api.health.dbTest(),
                    api.statistics.daily(today),
                ]);

                const health = healthResult.status === 'fulfilled' ? healthResult.value : { status: 'error' };
                const db = dbResult.status === 'fulfilled' ? dbResult.value : { status: 'error' };
                const daily = dailyResult.status === 'fulfilled' ? dailyResult.value : { total_todos: 0, completed_todos: 0 };

                setStatus({ health: health.status, db: db.status });
                setTodaySummary({ total: daily.total_todos ?? 0, completed: daily.completed_todos ?? 0 });

                const totalSlots = 6;
                const seeds = Math.min(totalSlots, Math.max(1, daily.total_todos ?? 0));
                const sprouts = Math.min(seeds, daily.completed_todos ?? 0);
                const data: Array<'empty' | 'seed' | 'sprout'> = Array.from({ length: totalSlots }, (_, i) => {
                    if (i < sprouts) return 'sprout';
                    if (i < seeds) return 'seed';
                    return 'empty';
                });
                setGridData(data);
            } catch (error) {
                console.error('Failed to load goal page data:', error);
                setStatus({ health: 'error', db: 'error' });
                setGridData(Array(6).fill('empty'));
            }
        };
        load();
    }, [isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center pt-16 px-6 space-y-8">
            <div className="text-center space-y-2">
                <span className="text-gray-400 text-sm font-medium">오늘</span>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    오늘 심을 공부가 있어요 <span className="text-green-500">🌱</span>
                </h1>
                <p className="text-xs text-gray-400">
                    완료 {todaySummary.completed}/{todaySummary.total} · API {status.health ?? '...'} / DB {status.db ?? '...'}
                </p>
            </div>

            <div className="w-full max-w-xs">
                <FarmGrid gridData={gridData} />
            </div>

            <div className="w-full max-w-xs space-y-4 pt-4">
                <Link
                    href="/mentee/planner"
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
