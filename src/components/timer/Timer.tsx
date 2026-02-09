'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface TimerProps {
    onComplete?: (time: number) => void; // time in seconds
    onStop?: (time: number) => void;
    onStart?: (time: number) => void;
    onPause?: (time: number) => void;
    onResume?: (time: number) => void;
}

export default function Timer({ onComplete, onStop, onStart, onPause, onResume }: TimerProps) {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const toggleTimer = () => {
        setIsActive((prev) => {
            const next = !prev;
            if (!prev && next) {
                if (!hasStarted) {
                    setHasStarted(true);
                    onStart?.(seconds);
                } else {
                    onResume?.(seconds);
                }
            } else if (prev && !next) {
                onPause?.(seconds);
            }
            return next;
        });
    };

    const stopTimer = () => {
        setIsActive(false);
        if (onStop) {
            onStop(seconds);
        }
    };

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, seconds]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Circular Progress Placeholder - can be enhanced with SVG */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                <div className="text-5xl font-bold text-gray-800 tracking-wider font-mono">
                    {formatTime(seconds)}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isActive
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                        }`}
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <button
                    onClick={stopTimer}
                    className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                    <Square size={28} fill="currentColor" />
                </button>
            </div>

            <p className="text-gray-400 text-sm">
                {isActive ? '집중하고 있어요! 🔥' : '잠시 휴식 중... ☕️'}
            </p>
        </div>
    );
}
