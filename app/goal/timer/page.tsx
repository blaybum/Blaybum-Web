'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Timer from '@/components/timer/Timer';
import QuitModal from '@/components/common/QuitModal';

export default function TimerPage() {
    const router = useRouter();
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const handleStop = (time: number) => {
        setElapsedTime(time);
        setShowQuitModal(true);
    };

    const handleConfirmQuit = () => {
        // In a real app, you'd save the time here
        const minutes = Math.floor(elapsedTime / 60);
        router.push(`/goal/timer/complete?time=${elapsedTime}`);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF4] flex flex-col relative">
            {/* Header */}
            <div className="flex items-center px-4 h-14">
                <button
                    onClick={() => setShowQuitModal(true)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 text-center pr-10">
                    <span className="font-bold text-gray-800">국어 - 비문학 독해</span>
                </div>
            </div>

            {/* Timer Content */}
            <div className="flex-1 flex flex-col justify-center pb-20">
                <Timer onStop={handleStop} />
            </div>

            {/* Quit Modal */}
            <QuitModal
                isOpen={showQuitModal}
                onClose={() => setShowQuitModal(false)}
                onConfirm={handleConfirmQuit}
            />
        </div>
    );
}
