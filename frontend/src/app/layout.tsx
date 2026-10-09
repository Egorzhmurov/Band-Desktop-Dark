import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Band Desktop Dark',
  description: 'AI orchestration dashboard for dark interface planning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
