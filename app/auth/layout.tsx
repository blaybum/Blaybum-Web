import '../globals.css';
import Footer from '@/components/layout/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kr">
      <body>
        <main>{children}</main>
        <Footer />        
      </body>
    </html>
  );
}