'use client';
import '../globals.css';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="kr">
            <body className="antialiased">
                <main>{children}</main>
            </body>
        </html>
    );
}
