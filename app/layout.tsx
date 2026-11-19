import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-num',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'シイナ｜2026年12月31日 デビュー予告サイト',
  description:
    '青い海の底からやってきたVTuber「シイナ」の公式デビューカウントダウン＆ティザーサイト。2026年12月31日、大晦日の夜に初配信予定。',
  openGraph: {
    title: 'シイナ｜2026年12月31日 デビュー予告サイト',
    description:
      '青い海の底からやってきたVTuber「シイナ」の公式デビューカウントダウン＆ティザーサイト。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'シイナ｜2026年12月31日 デビュー予告サイト',
    description:
      '青い海の底からやってきたVTuber「シイナ」の公式デビューカウントダウン＆ティザーサイト。',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Zen+Maru+Gothic:wght@500;700&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f6f9ff] text-[#061b4d] antialiased overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
