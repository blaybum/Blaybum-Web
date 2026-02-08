'use client';

import Link from 'next/link';
import { User, MessageCircle, Trophy, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function MyPage() {
    // Mock state: User has no mentor initially
    const [hasMentor, setHasMentor] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#F0FDF4] flex flex-col pb-24">

            {/* Header */}
            <div className="text-center pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
                <p className="text-gray-500 text-sm mt-1">지금까지 이렇게 자랐어요</p>
            </div>

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
                <div className="absolute z-20 top-1/2 right-[28%] translate-x-2 translate-y-2 bg-green-100 p-2 rounded-full cursor-pointer shadow-md hover:bg-green-200 transition-colors">
                    <div className="text-green-600 font-bold">🌱</div>
                </div>
            </div>

            {/* Growth Status */}
            <div className="px-6 space-y-4">
                <h2 className="font-bold text-xl text-gray-800 flex items-center justify-between">
                    성장 현황
                    <span className="text-xs font-normal text-gray-500 cursor-pointer">전체보기</span>
                </h2>

                {/* Subject Cards */}
                <Link href="/goal/my/stats/국어">
                    <div className="bg-[#FFF1F2] rounded-2xl p-5 mb-4 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border border-red-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center text-white font-bold shadow-sm">국</div>
                                <span className="font-bold text-gray-800 text-lg">국어</span>
                            </div>
                            <span className="text-[#EF4444] font-bold text-lg">78%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden">
                            <div className="w-[78%] h-full bg-[#EF4444] rounded-full" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span className="text-red-500">▲ 12%</span> 문학 분석 능력 집중 향상
                        </p>
                    </div>
                </Link>

                <Link href="/goal/my/stats/영어">
                    <div className="bg-[#EFF6FF] rounded-2xl p-5 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold shadow-sm">영</div>
                                <span className="font-bold text-gray-800 text-lg">영어</span>
                            </div>
                            <span className="text-[#3B82F6] font-bold text-lg">65%</span>
                        </div>
                        <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                            <div className="w-[65%] h-full bg-[#3B82F6] rounded-full" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span className="text-blue-500">▲ 5%</span> 독해 속도 향상 중
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
                        <div className="text-2xl font-bold text-green-600">24</div>
                        <div className="text-xs text-gray-500">완료한 과제</div>
                    </div>
                    <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl py-4 flex flex-col items-center justify-center border border-white">
                        <div className="text-2xl font-bold text-blue-600">48h</div>
                        <div className="text-xs text-gray-500">총 공부 시간</div>
                    </div>
                </div>
            </div>

            {/* Hidden debug toggle for demo */}
            <div className="text-center opacity-0 hover:opacity-100 transition-opacity mb-8">
                <button onClick={() => setHasMentor(!hasMentor)} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    Toggle Mentor State (Debug)
                </button>
            </div>
        </div>
    );
}
