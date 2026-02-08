'use client';

import { use } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Link as LinkIcon, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FeedbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col px-5 pt-6 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="hover:bg-gray-100 p-2 rounded-full -ml-2">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">국어</span>
                <span className="text-gray-500 text-sm">3월 15일</span>
            </div>

            {/* Summary Feedback Card (Yellow) */}
            <div className="bg-[#FEF9C3] rounded-2xl p-6 mb-8 shadow-sm border border-yellow-100">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                        <Lightbulb size={20} />
                    </div>
                    <h2 className="font-bold text-yellow-800 text-lg">요약 피드백</h2>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-gray-700 leading-relaxed text-sm">
                    오늘 학습한 현대문학 작품 분석이 정말 훌륭했어요! 특히 화자의 정서를 파악하는 부분에서 깊이 있는 사고가 돋보였습니다. 다음에는 표현기법과 주제의식을 연결해서 분석해보면 더욱 완성도 높은 답안이 될 것 같아요.
                </div>
            </div>

            <h2 className="font-bold text-xl text-gray-800 mb-4">상세 피드백</h2>

            {/* Good Points */}
            <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-green-600">
                    <CheckCircle2 size={24} />
                    <h3 className="font-bold text-lg">잘한 점</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    문학 작품의 갈등 구조를 정확하게 파악했습니다. 인물들 간의 심리적 대립과 사회적 배경을 연결지어 분석한 부분이 특히 인상적이었어요. 또한 시어의 함축적 의미를 찾아내는 감각도 많이 늘었습니다.
                </p>
            </div>

            {/* Improvement Points (Green Check Section - "확인했어요") */}
            <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-green-100">
                <div className="bg-[#22C55E] py-3 text-center text-white font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} />
                    확인했어요
                </div>
                <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        문학사적 배경에 대한 이해가 조금 부족해 보입니다. 1930년대 모더니즘 시의 특징을 다시 한 번 정리해보시면 도움이 될 거예요.
                    </p>
                </div>
            </div>

            {/* Next Goal (Purple) */}
            <div className="bg-[#d5d7e2] rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-purple-700">
                    <div className="w-6 h-6 rounded-full border-2 border-purple-700 flex items-center justify-center text-xs font-bold">?</div>
                    <h3 className="font-bold text-lg">다음 목표</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                    다음 학습에서는 현대소설의 서술 기법에 집중해보겠습니다. 특히 시점과 거리, 서술자의 성격 등을 분석하는 연습을 통해 작품 이해 능력을 한 단계 더 끌어올려보세요. 화이팅!
                </p>
            </div>

            {/* Mentor Profile Bottom Card */}
            <div className="bg-[#F0FDF4] rounded-2xl p-6 border border-green-100 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-xs">👨‍🏫</div>
                    <h3 className="font-bold text-green-800">멘토 김선생님</h3>
                </div>
                <p className="text-green-700 text-sm">
                    꾸준히 노력하는 모습이 정말 보기 좋아요. 이런 식으로 계속 성장해 나가면 분명 목표를 달성할 수 있을 거예요!
                </p>
            </div>

        </div>
    );
}
