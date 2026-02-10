'use client';

import { Home, ListTodo, Sprout, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: '홈', icon: Home, href: '/mentee' },
        { name: '플래너', icon: ListTodo, href: '/mentee/planner' },
        { name: '농장', icon: Sprout, href: '/mentee/farm' },
        { name: '피드백', icon: MessageCircle, href: '/mentee/feedback' },
        { name: '마이', icon: User, href: '/mentee/my' },
    ];

    return (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 dark:bg-zinc-900 dark:border-zinc-800 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-green-600' : 'text-gray-400'
                                }`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
