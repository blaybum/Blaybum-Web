'use client';

import { Sprout, Lightbulb } from 'lucide-react';

interface TaskCardProps {
    subject: string;
    subjectColor: string; // e.g., 'bg-blue-500'
    title: string;
    description: string;
    seedPrompt?: string;
}

export default function TaskCard({
    subject,
    subjectColor,
    title,
    description,
    seedPrompt,
}: TaskCardProps) {
    return (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sprout size={60} className="text-green-500" />
            </div>
            <div className="flex items-start justify-between mb-4">
                <span
                    className={`px-4 py-1.5 rounded-full text-white text-sm font-bold ${subjectColor}`}
                >
                    {subject}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-gray-500 text-sm mb-6">{description}</p>

            <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-green-300/50 flex items-center justify-center text-white">
                    <Sprout size={24} fill="currentColor" />
                </div>
                <div>
                    <div className="text-xs text-gray-400 font-medium">공부 시간</div>
                    <div className="text-2xl font-bold text-gray-800 font-mono">00:00</div>
                </div>
            </div>

            {seedPrompt && (
                <div className="bg-[#EAF4EB] rounded-xl p-4 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={16} className="text-amber-500" fill="currentColor" />
                        <span className="text-xs font-bold text-gray-600">오늘의 씨앗</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {seedPrompt}
                    </p>
                </div>
            )}
        </div>
    );
}
