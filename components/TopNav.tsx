'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface TopNavProps {
  onFocusNotify: () => void;
}

const NAV_ITEMS = [
  { href: '#countdown', label: 'カウントダウン' },
  { href: '#profile', label: 'プロフィール' },
  { href: '#schedule', label: '初配信の予定' },
  { href: '#bottle', label: '応援ボトル' },
];

export default function TopNav({ onFocusNotify }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePrimaryClick = () => {
    setMobileOpen(false);
    onFocusNotify();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#c2d6ff]/80 bg-[#f6f9ff]/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-[#0038a8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] rounded-md px-1"
        >
          シイナ
        </a>

        <nav
          aria-label="メインナビゲーション"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1a3570]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#0038a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-[#0038a8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#002a80] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] focus-visible:ring-offset-2"
          >
            通知を予約する
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'メニューを閉じる' : 'メニューを開く'}
            className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-xl border border-[#c2d6ff] bg-white/90 text-[#0038a8] transition-colors hover:bg-[#e6eeff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#c2d6ff]/80 bg-[#f6f9ff] px-4 py-4 md:hidden">
          <nav
            aria-label="モバイルナビゲーション"
            className="flex flex-col gap-2"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-[#1a3570] transition-colors hover:bg-[#e6eeff]"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handlePrimaryClick}
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#0038a8] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002a80]"
            >
              通知を予約する
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
