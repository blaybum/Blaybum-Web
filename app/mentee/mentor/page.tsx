'use client';

import Link from 'next/link';
import { Search, Code, Palette, TrendingUp, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function MentorListPage() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [requested, setRequested] = useState<number[]>([]);

    const handleRequest = (id: number, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation if button inside link
        e.stopPropagation();
        if (requested.includes(id)) return;
        setRequested((prev) => [...prev, id]);
        alert('멘토링 요청을 보냈습니다! 멘토가 수락하면 알림을 보내드릴게요.');
    };

    const handleAlert = (msg: string) => {
        alert(msg);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col pt-6 px-6 pb-24">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 h-10">
                <Link href="/mentee">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        ⬅
                    </button>
                </Link>
                <h1 className="text-lg font-bold">멘토링</h1>
                {searchOpen ? (
                    <input
                        autoFocus
                        type="text"
                        placeholder="이름, 분야 검색..."
                        className="border-b border-gray-300 focus:border-green-500 outline-none text-sm px-2 py-1 w-32 transition-all"
                        onBlur={() => setSearchOpen(false)}
                    />
                ) : (
                    <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full">
                        <Search className="text-gray-600" size={24} />
                    </button>
                )}
            </div>

            {/* AI Matching Banner */}
            <div className="bg-[#10B981] rounded-[24px] p-6 text-white mb-8 relative overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02] cursor-pointer" onClick={() => handleAlert('AI가 당신의 성향을 분석하여 멘토를 찾고 있습니다...')}>
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
                <h2 className="text-2xl font-bold mb-2">AI 멘토 매칭</h2>
                <p className="text-sm opacity-90 mb-6">당신에게 맞는 최적의 멘토를 찾아드려요</p>
                <button className="bg-white text-[#10B981] px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                    ✏️ 멘토 매칭 시작
                </button>
            </div>

            {/* Categories */}
            <h2 className="font-bold text-lg mb-4">분야별 멘토</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-[#EFF6FF] p-4 rounded-2xl hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => handleAlert('개발 멘토 목록을 불러옵니다.')}>
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                        <Code size={20} />
                    </div>
                    <div className="font-bold text-gray-800">개발</div>
                    <div className="text-xs text-gray-500">프로그래밍 & IT</div>
                </div>
                <div className="bg-[#F3E8FF] p-4 rounded-2xl hover:bg-purple-100 transition-colors cursor-pointer" onClick={() => handleAlert('디자인 멘토 목록을 불러옵니다.')}>
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-2">
                        <Palette size={20} />
                    </div>
                    <div className="font-bold text-gray-800">디자인</div>
                    <div className="text-xs text-gray-500">UI/UX & 그래픽</div>
                </div>
                <div className="bg-[#FFF7ED] p-4 rounded-2xl hover:bg-orange-100 transition-colors cursor-pointer" onClick={() => handleAlert('마케팅 멘토 목록을 불러옵니다.')}>
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2">
                        <TrendingUp size={20} />
                    </div>
                    <div className="font-bold text-gray-800">마케팅</div>
                    <div className="text-xs text-gray-500">디지털 & 브랜딩</div>
                </div>
                <div className="bg-[#F0FDF4] p-4 rounded-2xl hover:bg-green-100 transition-colors cursor-pointer" onClick={() => handleAlert('비즈니스 멘토 목록을 불러옵니다.')}>
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-2">
                        <Briefcase size={20} />
                    </div>
                    <div className="font-bold text-gray-800">비즈니스</div>
                    <div className="text-xs text-gray-500">창업 & 경영</div>
                </div>
            </div>

            {/* Recommended Mentors */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">추천 멘토</h2>
                <span className="text-sm text-[#10B981] font-bold cursor-pointer hover:underline">전체보기</span>
            </div>

            <div className="space-y-4 mb-8">
                {/* Mentor Card 1 */}
                <Link href="/mentee/mentor/1" className="block">
                    <div className="border border-gray-100 rounded-2xl p-4 flex gap-4 items-start hover:shadow-md transition-shadow cursor-pointer bg-white relative">
                        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                            <Image src="https://placehold.co/100x100?text=K" alt="Mentor" layout="fill" objectFit="cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="font-bold text-gray-900">김개발 <span className="text-yellow-500 text-sm">★ 4.9</span></h3>
                                    <p className="text-xs text-gray-500 mt-1">시니어 프론트엔드 개발자 · 5년 경력</p>
                                </div>
                                <button
                                    onClick={(e) => handleRequest(1, e)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors z-10 relative ${requested.includes(1)
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-[#10B981] text-white hover:bg-green-600'
                                        }`}
                                >
                                    {requested.includes(1) ? '요청됨' : '선택'}
                                </button>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold">React</span>
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold">Next.js</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 line-clamp-1">실무 중심의 프론트엔드 개발 노하우를 전수해드립니다.</p>
                        </div>
                    </div>
                </Link>

                {/* Mentor Card 2 - Interactive Mock */}
                <div className="border border-gray-100 rounded-2xl p-4 flex gap-4 items-start hover:shadow-md transition-shadow bg-white relative cursor-pointer" onClick={() => handleAlert('박디자인 멘토 상세 페이지로 이동합니다.')}>
                    <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                        <Image src="https://placehold.co/100x100?text=P" alt="Mentor" layout="fill" objectFit="cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h3 className="font-bold text-gray-900">박디자인 <span className="text-yellow-500 text-sm">★ 4.8</span></h3>
                                <p className="text-xs text-gray-500 mt-1">UX/UI 디자이너 · 7년 경력</p>
                            </div>
                            <button
                                onClick={(e) => handleRequest(2, e)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors z-10 relative ${requested.includes(2)
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-[#10B981] text-white hover:bg-green-600'
                                    }`}
                            >
                                {requested.includes(2) ? '요청됨' : '선택'}
                            </button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-[10px] font-bold">Figma</span>
                            <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-[10px] font-bold">사용자 경험</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-1">사용자 중심의 디자인 씽킹을 함께 배워보세요.</p>
                    </div>
                </div>
            </div>

            {/* My Mentor */}
            <h2 className="font-bold text-lg mb-4">나의 멘토</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative">
                        <Image src="https://placehold.co/100x100?text=C" alt="Mentor" layout="fill" objectFit="cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-lg">최코딩</h3>
                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">진행중</span>
                        </div>
                        <p className="text-xs text-gray-500">백엔드 개발자 · 8년 경력</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-3 text-center">다음 멘토링: 2024.02.05 (월) 오후 2시</p>
                    <div className="flex gap-2">
                        <button onClick={() => handleAlert('화상 멘토링 입장을 준비합니다...')} className="flex-1 bg-[#10B981] text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                            📹 참여하기
                        </button>
                        <button onClick={() => handleAlert('채팅방으로 이동합니다.')} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors">
                            💬 채팅
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
