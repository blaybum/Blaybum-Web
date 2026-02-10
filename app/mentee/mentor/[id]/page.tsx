'use client';

import { use } from 'react';
import { ArrowLeft, Bell, Star, List, ThumbsUp, AlertTriangle, Lightbulb, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col pt-6 pb-24">

            {/* Header */}
            <div className="flex items-center justify-between px-6 mb-8">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full -ml-2">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">멘토 피드백</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Bell size={24} className="text-gray-400" />
                </button>
            </div>

            {/* Mentor Profile (Minimal Header in Body-13) */}
            <div className="px-6 flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative border-2 border-white shadow-sm">
                    <Image src="https://placehold.co/100x100?text=J" alt="Mentor" layout="fill" objectFit="cover" />
                </div>
                <div>
                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        김지연 멘토 <span className="text-yellow-500 text-sm font-normal">★ 4.9</span>
                    </h2>
                    <p className="text-sm text-gray-500">UX/UI 디자이너 · 5년차</p>
                </div>
            </div>

            {/* Received Task Card */}
            <div className="px-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-3">받은 과제</h3>
                <div className="border border-[#10B981] rounded-2xl p-5 relative overflow-hidden bg-white shadow-sm">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                            <List size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">모바일 앱 와이어프레임 설계</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                전자상거래 앱의 주요 화면 5개에 대한 와이어프레임을 작성해주세요.
                            </p>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-gray-400">마감일: 2024.02.10</span>
                                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">진행중</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-700 mb-2">세부 요구사항</p>
                        <ul className="text-xs text-gray-500 space-y-1 ml-1">
                            <li>• 홈, 상품목록, 상품상세, 장바구니, 결제 화면</li>
                            <li>• 사용자 플로우 고려한 화면 연결</li>
                            <li>• 모바일 최적화 고려</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="px-6 space-y-4">
                <h3 className="font-bold text-gray-900">피드백</h3>

                {/* Overall Rating */}
                <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 font-bold text-gray-800">
                            <span className="text-green-600">💬</span> 전체 평가
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} className="text-gray-300" />
                            <span className="text-black text-sm ml-1">4.0</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        전체적으로 사용자 플로우를 잘 이해하고 구성하셨습니다. 특히 상품 검색과 필터링 부분의 UX가 직관적이에요. 다만 결제 프로세스에서 몇 가지 개선점이 있어 보입니다.
                    </p>
                </div>

                {/* Good Points */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                            <ThumbsUp size={16} />
                        </div>
                        <h4 className="font-bold text-gray-900">잘한 점</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 ml-10 list-disc">
                        <li>일관성 있는 네비게이션 구조</li>
                        <li>명확한 정보 계층 구조</li>
                        <li>사용자 중심의 인터페이스 설계</li>
                    </ul>
                </div>

                {/* To Improve */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                            <AlertTriangle size={16} />
                        </div>
                        <h4 className="font-bold text-gray-900">개선점</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 ml-10 list-disc">
                        <li>결제 단계를 더 단순화할 필요</li>
                        <li>오류 상황에 대한 처리 방안 추가</li>
                        <li>접근성 가이드라인 적용</li>
                    </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Lightbulb size={16} />
                        </div>
                        <h4 className="font-bold text-gray-900">추천 자료</h4>
                    </div>
                    <div className="space-y-2 ml-10">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>🔗</span> 모바일 결제 UX 베스트 프랙티스
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📖</span> 접근성 디자인 가이드라인
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Task Banner */}
            <div className="mx-6 mt-8 bg-[#22C55E] rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="flex items-start gap-3 relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Rocket size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold opacity-80 mb-1">다음 과제</div>
                        <h3 className="font-bold text-lg mb-1">프로토타입 제작</h3>
                        <p className="text-xs opacity-90 leading-relaxed mb-4">
                            와이어프레임을 바탕으로 인터랙티브 프로토타입을 만들어보세요.
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="text-xs opacity-80">시작일: 2024.02.11</div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">예정</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
