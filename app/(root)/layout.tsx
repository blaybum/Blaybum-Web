'use client';
import '../globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { Row } from '@/components/common';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>
        <Row>
          <Sidebar select={'today'} />
          {children}
        </Row>
      </body>
    </html>
  );
}
