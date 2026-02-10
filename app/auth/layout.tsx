import '../globals.css';
import Footer from '@/components/layout/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kr">
      <body className="antialiased bg-neutral-100 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-[430px] h-[100dvh] bg-white relative shadow-2xl flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto scrollbar-hide">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}