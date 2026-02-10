import type { Metadata } from 'next';
import BottomNav from '@/components/goal/BottomNav';
import '../globals.css';

export const metadata: Metadata = {
    title: 'Goal - Blaybum',
    description: 'Study goal tracking',
};

export default function GoalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="kr">
            <body className="antialiased">
                <div className="min-h-screen bg-neutral-100 flex justify-center items-center">
                    <div className="w-full max-w-[430px] h-[100dvh] bg-[#FDFBF4] relative shadow-2xl flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
                            {children}
                        </main>
                        <div className="absolute bottom-0 left-0 right-0 z-50">
                            <BottomNav />
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
