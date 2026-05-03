import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'General Admin Panel',
  description: 'Reusable mock-based admin panel',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="rtl" suppressHydrationWarning>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
