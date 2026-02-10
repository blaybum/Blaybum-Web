'use client';

import Link from 'next/link';
import { MessageCircle, Trophy, UserPlus, LogOut, Edit3 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import useAuthGuard from '@/lib/useAuthGuard';
import type { PomoMeStatisticsResponse, PlannerDailyStatisticsResponse, PlannerWeeklyStatisticsResponse, UserRead } from '@/lib/api/types';

export default function MyPage() {
    const isAuthed = useAuthGuard();
    const hasMentor = false;
    const [user, setUser] = useState<UserRead | null>(null);
    const [stats, setStats] = useState<PomoMeStatisticsResponse | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<PlannerWeeklyStatisticsResponse | null>(null);
    const [dailyStats, setDailyStats] = useState<PlannerDailyStatisticsResponse | null>(null);

    const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const weekStartStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay());
        return d.toISOString().slice(0, 10);
    }, []);

    useEffect(() => {
        const load = async () => {
            if (!isAuthed) return;
            try {
                const me = await api.auth.getMe();
                setUser(me);

                const [statsResult, weeklyResult, dailyResult] = await Promise.allSettled([
                    api.statistics.pomoMe(),
                    api.statistics.plannerWeekly(weekStartStr),
                    api.statistics.daily(todayStr),
                ]);

                if (statsResult.status === 'fulfilled') setStats(statsResult.value);
                if (weeklyResult.status === 'fulfilled') setWeeklyStats(weeklyResult.value);
                if (dailyResult.status === 'fulfilled') setDailyStats(dailyResult.value);

                // User data already fetched from getMe, no need for additional getUser call
            } catch (error) {
                console.error('Failed to load my page data:', error);
            }
        };
        load();
    }, [isAuthed, todayStr, weekStartStr]);

    const handleLogout = async () => {
        await api.auth.logout();
        alert('로그아웃되었습니다.');
    };

    const handleProfileUpdate = async () => {
        if (!user) return;
        const name = window.prompt('새 이름을 입력해주세요.', user.full_name ?? user.username ?? '') ?? '';
        if (!name) return;
        const updated = await api.auth.patchMe({ full_name: name });
        setUser(updated);
        await api.auth.patchUser(updated.id, { full_name: name });
        alert('프로필이 업데이트되었습니다.');
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        const confirmText = window.prompt('정말 삭제하려면 DELETE를 입력해주세요.');
        if (confirmText !== 'DELETE') return;
        await api.auth.deleteUser(user.id);
        alert('계정 삭제 요청이 완료되었습니다.');
    };

    const handleRefreshToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            alert('리프레시 토큰이 없습니다.');
            return;
        }
        const res = await api.auth.refresh(refreshToken);
        if (res?.access_token) localStorage.setItem('access_token', res.access_token);
        if (res?.refresh_token) localStorage.setItem('refresh_token', res.refresh_token);
        alert('토큰을 갱신했습니다.');
    };

    const weeklyRate = weeklyStats ? Math.round(weeklyStats.completion_rate * 100) : 0;
    const avgDailyMinutes = stats?.average_daily_minutes ?? 0;
    const todayRate = dailyStats ? Math.round(dailyStats.completion_rate * 100) : 0;

    if (!isAuthed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                로그인 확인 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#F0FDF4] flex flex-col pb-24">

            {/* Header */}
            <div className="text-center pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
                <p className="text-gray-500 text-sm mt-1">지금까지 이렇게 자랐어요</p>
            </div>

            {user && (
                <div className="mx-6 mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="text-sm font-bold text-gray-900">{user.full_name ?? user.username ?? user.email}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                        계정 상태: {user.is_verified ? '인증됨' : '미인증'}
                    </div>
                </div>
            )}

            {/* Character Section (Mock Image) */}
            <div className="relative w-full h-[280px] flex items-center justify-center mb-6">
                {/* Background Landscape (Placeholder for Farm Image) */}
                <div className="absolute inset-x-4 bottom-0 h-40 bg-gradient-to-r from-green-200 to-green-300 rounded-3xl overflow-hidden shadow-inner">
                    {/* Simple geometric farm fields */}
                    <div className="absolute inset-0 bg-[url('https://placehold.co/600x200/png?text=Farm')] opacity-50 mix-blend-overlay" />
                    <div className="absolute bottom-0 right-10 w-16 h-16 bg-orange-200 transform rotate-45 translate-y-8" />
                    <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-200 rounded-full opacity-80 animate-pulse" />
                </div>

                {/* Character Avatar */}
                <div className="relative z-10 w-40 h-40 bg-amber-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                    {/* Placeholder for Character */}
                    <span className="text-6xl">🧑‍🌾</span>
                </div>

                {/* Edit Badge */}
                <div className="absolute z-20 top-1/2 right-[28%] translate-x-2 translate-y-2 bg-green-100 p-2 rounded-full cursor-pointer shadow-md hover:bg-green-200 transition-colors" onClick={handleProfileUpdate}>
                    <div className="text-green-600 font-bold">🌱</div>
                </div>
            </div>

            {/* Growth Status */}
            <div className="px-6 space-y-4">
                <h2 className="font-bold text-xl text-gray-800 flex items-center justify-between">
                    성장 현황
                    <span className="text-xs font-normal text-gray-500 cursor-pointer">전체보기</span>
                </h2>

                {/* Summary Cards */}
                <Link href="/goal/my/stats/국어">
                    <div className="bg-[#FFF1F2] rounded-2xl p-5 mb-4 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border border-red-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center text-white font-bold shadow-sm">주</div>
                                <span className="font-bold text-gray-800 text-lg">주간 달성률</span>
                            </div>
                            <span className="text-[#EF4444] font-bold text-lg">{weeklyRate}%</span>
                        </div>
                        <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${weeklyRate}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            이번 주 완료한 목표 비율이에요
                        </p>
                    </div>
                </Link>

                <Link href="/goal/my/stats/영어">
                    <div className="bg-[#EFF6FF] rounded-2xl p-5 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold shadow-sm">평</div>
                                <span className="font-bold text-gray-800 text-lg">평균 집중 시간</span>
                            </div>
                            <span className="text-[#3B82F6] font-bold text-lg">{avgDailyMinutes}분</span>
                        </div>
                        <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${Math.min(100, avgDailyMinutes)}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            하루 평균 집중 시간이에요
                        </p>
                    </div>
                </Link>
            </div>

            {/* Mentor Section */}
            <div className="px-6 mt-8">
                <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    나의 멘토
                    {!hasMentor && <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full">미등록</span>}
                </h2>

                {hasMentor ? (
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">👨‍🏫</div>
                            <div>
                                <h3 className="font-bold text-gray-900">김멘토 선생님</h3>
                                <p className="text-xs text-gray-500">서울대 국어교육과 · 경력 5년</p>
                            </div>
                            <button className="ml-auto bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600">
                                관리
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => alert('채팅 기능은 준비 중입니다.')} className="flex-1 bg-[#F0FDF4] text-green-700 py-3 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                                <MessageCircle size={18} /> 채팅하기
                            </button>
                            <Link href="/goal/feedback" className="flex-1 w-full">
                                <button className="w-full bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                    피드백 모아보기
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Link href="/goal/mentor">
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                <UserPlus className="text-gray-400 group-hover:text-green-500 transition-colors" size={32} />
                            </div>
                            <div className="text-center">
                                <span className="text-gray-600 font-bold block group-hover:text-green-700">멘토 연결하기</span>
                                <span className="text-xs text-gray-400 group-hover:text-green-600">나에게 딱 맞는 멘토를 찾아보세요</span>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            {/* This Month Results */}
            <div className="mx-6 mt-8 mb-4 bg-[#FEF9C3] rounded-2xl p-6 shadow-sm border border-yellow-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-700" size={20} />
                        <h3 className="font-bold text-yellow-800">이번 달 성과</h3>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl py-4 flex flex-col items-center justify-center border border-white">
                        <div className="text-2xl font-bold text-green-600">{stats?.total_pomo_count ?? 0}</div>
                        <div className="text-xs text-gray-500">완료한 과제</div>
                    </div>
                    <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl py-4 flex flex-col items-center justify-center border border-white">
                        <div className="text-2xl font-bold text-blue-600">{stats ? `${Math.round(stats.total_study_time_minutes / 60)}h` : '0h'}</div>
                        <div className="text-xs text-gray-500">총 공부 시간</div>
                    </div>
                </div>
            </div>

            <div className="mx-6 mb-6 text-xs text-gray-500">
                오늘 완료율 {todayRate}% · 방해 {stats?.total_distraction_count ?? 0}회
            </div>

            <div className="mx-6 mb-6 flex gap-2">
                <button onClick={handleProfileUpdate} className="flex-1 bg-white border rounded-xl py-3 text-sm font-semibold text-gray-700 flex items-center justify-center gap-2">
                    <Edit3 size={16} /> 프로필 수정
                </button>
                <button onClick={handleLogout} className="flex-1 bg-red-50 border rounded-xl py-3 text-sm font-semibold text-red-600 flex items-center justify-center gap-2">
                    <LogOut size={16} /> 로그아웃
                </button>
            </div>

            <div className="mx-6 mb-8 flex gap-2">
                <button onClick={handleDeleteAccount} className="flex-1 text-xs bg-red-100 px-2 py-2 rounded">
                    계정 삭제
                </button>
                <button onClick={handleRefreshToken} className="flex-1 text-xs bg-blue-100 px-2 py-2 rounded">
                    토큰 갱신
                </button>
            </div>
        </div>
    );
}
