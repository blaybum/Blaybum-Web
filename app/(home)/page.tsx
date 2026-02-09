'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, User } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleMentee = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth');
      return;
    }
    router.push('/goal');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF4] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-10">

        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-[#8B7355] text-2xl font-bold tracking-tight">
            역할을 선택하세요
          </h1>
          <div className="text-[#9CA38F] text-base leading-relaxed">
            <p>어떻게 여정을 시작하고</p>
            <p>싶으신가요?</p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="space-y-4">

          {/* Mentee Card */}
          <button onClick={handleMentee} className="block group w-full text-left">
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent transition-all duration-200 group-hover:border-[#98E6C7] group-active:scale-[0.98]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Sprout size={48} className="text-[#9CA38F]" strokeWidth={2.5} fill="currentColor" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-[#8B7355] text-xl font-bold">
                    멘티입니다
                  </h2>
                  <p className="text-[#9CA38F] text-sm leading-relaxed whitespace-pre-line">
                    실무 경험을 통해{'\n'}배우고 성장하고 싶어요
                  </p>
                </div>
              </div>
            </div>
          </button>

          {/* Mentor Card */}
          <Link href="/auth" className="block group">
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent transition-all duration-200 group-hover:border-[#A69076] group-active:scale-[0.98]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <User size={48} className="text-[#A69076]" strokeWidth={2.5} fill="currentColor" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-[#8B7355] text-xl font-bold">
                    멘토입니다
                  </h2>
                  <p className="text-[#9CA38F] text-sm leading-relaxed whitespace-pre-line">
                    지식을 공유하고 다른 사람들이{'\n'}성장할 수 있도록 돕고 싶어요
                  </p>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
