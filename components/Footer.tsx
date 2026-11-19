'use client';

import { Sparkles, Waves } from 'lucide-react';
import { WaveIntensity } from './OceanCanvas';

interface FooterProps {
  waveIntensity: WaveIntensity;
  onChangeWaveIntensity: (next: WaveIntensity) => void;
  onTriggerBubbleBurst: () => void;
}

export default function Footer({
  waveIntensity,
  onChangeWaveIntensity,
  onTriggerBubbleBurst,
}: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-[#c2d6ff]/80 bg-[#e6eeff]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center">
        <div>
          <span className="font-display text-lg font-bold text-[#0038a8]">
            シイナ
          </span>
          <p className="mt-1 text-xs text-[#1a3570]">
            2026年12月31日 初配信デビュー予定 · 海の底のティザーページ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="海のアニメーションの速さ"
            className="inline-flex items-center gap-1 rounded-xl border border-[#c2d6ff] bg-white/90 p-1"
          >
            <span className="inline-flex items-center gap-1 px-2 text-xs font-medium text-[#1a3570]">
              <Waves className="h-3.5 w-3.5 text-[#0038a8]" />
              <span>波の動き</span>
            </span>
            <button
              type="button"
              onClick={() => onChangeWaveIntensity('calm')}
              aria-pressed={waveIntensity === 'calm'}
              className={`min-h-[34px] rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                waveIntensity === 'calm'
                  ? 'bg-[#0038a8] text-white'
                  : 'text-[#1a3570] hover:bg-[#e6eeff]'
              }`}
            >
              おだやか
            </button>
            <button
              type="button"
              onClick={() => onChangeWaveIntensity('lively')}
              aria-pressed={waveIntensity === 'lively'}
              className={`min-h-[34px] rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                waveIntensity === 'lively'
                  ? 'bg-[#0038a8] text-white'
                  : 'text-[#1a3570] hover:bg-[#e6eeff]'
              }`}
            >
              にぎやか
            </button>
          </div>

          <button
            type="button"
            onClick={onTriggerBubbleBurst}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#c2d6ff] bg-white px-3.5 py-2 text-xs font-semibold text-[#0038a8] transition-colors hover:bg-[#f5f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0038a8]" />
            <span>海の泡を飛ばす</span>
          </button>
        </div>

        <p className="text-xs text-[#1a3570]/85">
          © 2026 シイナ デビュー準備委員会
        </p>
      </div>
    </footer>
  );
}
