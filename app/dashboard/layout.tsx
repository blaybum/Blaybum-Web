'use client';
import '../globals.css';
import styled from '@emotion/styled';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar select={'today'} />
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,
            width: 0,
            height: '100vh'
          }}>
            <Header />
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}