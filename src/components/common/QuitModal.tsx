'use client';

import { X } from 'lucide-react';

interface QuitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function QuitModal({ isOpen, onClose, onConfirm }: QuitModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">공부를 종료하시겠어요?</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    지금 종료하면 현재까지의 공부 시간이 저장됩니다.
                    <br />
                    정말 종료하시겠습니까?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                    >
                        계속하기
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-900 transition-colors"
                    >
                        종료하기
                    </button>
                </div>
            </div>
        </div>
    );
}
