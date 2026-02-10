'use client';

import Link from 'next/link';
import { Mail, Star } from 'lucide-react';

export default function FeedbackPage() {
    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center px-6 relative pb-24">

            {/* Header Title */}
            <div className="absolute top-12 text-center w-full">
                <h1 className="text-xl font-bold text-gray-900">피드백 도착</h1>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-2 mb-10">
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                    멘토의 피드백이<br />도착했어요
                </h2>
                <p className="text-gray-500">새로운 성장의 비료가 준비되었습니다</p>
            </div>

            {/* Visual (Mailbox) */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {/* Simplified CSS Art for Mailbox */}
                <div className="w-48 h-60 bg-yellow-400 rounded-3xl border-b-8 border-yellow-600 relative overflow-hidden shadow-lg flex items-center justify-center">
                    {/* Dark Slot */}
                    <div className="absolute top-8 w-32 h-6 bg-yellow-700 rounded-full" />

                    {/* Letter */}
                    <div className="w-32 h-40 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transform translate-y-4 animate-bounce">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <div className="w-12 h-12 border-2 border-green-400 border-dashed rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                                !
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-green-700 font-bold block">성장</span>
                            <span className="text-green-700 font-bold block">비료</span>
                            <span className="text-green-700 font-bold block">도착</span>
                        </div>
                    </div>
                </div>

                {/* Decor Particles */}
                <div className="absolute top-0 right-10 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
                <div className="absolute bottom-10 left-0 w-2 h-2 bg-yellow-300 rounded-full" />
            </div>

            {/* Action Button */}
            <Link href="/mentee/feedback/1" className="w-full">
                <button className="w-full bg-[#22C55E] text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                    <Mail size={20} />
                    피드백 확인하기
                </button>
            </Link>

        </div>
    );
}
