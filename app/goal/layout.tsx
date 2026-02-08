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
                <div className="min-h-screen bg-[#FDFBF4] text-slate-800 font-sans flex justify-center">
                    <div className="w-full max-w-md bg-[#FDFBF4] min-h-screen relative shadow-lg">
                        <main className="pb-20">
                            {children}
                        </main>
                        <BottomNav />
                    </div>
                </div>
            </body>
        </html>
    );
}
