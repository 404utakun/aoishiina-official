'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  Clock,
  Droplets,
  MessageCircleHeart,
  Sparkles,
  Sun,
  Moon,
  Waves,
} from 'lucide-react';
import {
  DEBUT_TARGET_ISO,
  TimezoneMode,
  calculateTimeRemaining,
  formatDebutTimestamp,
  padTwo,
} from '@/lib/countdown';
import {
  LIGHTING_PRESETS,
  LightingMode,
  SHIINA_WHISPERS,
} from '@/lib/shiina-data';

interface HeroSilhouetteStageProps {
  onFocusNotify: () => void;
  onTriggerBubbleBurst: () => void;
}

const UNIT_NOTES: Record<string, string> = {
  日: '大晦日の夜まで、一日ずつ海が満ちていきます。',
  時間: '夕凪から星降る夜へ、カウントダウンが進みます。',
  分: 'お気に入りのリボンを結んで、少しずつ準備する時間。',
  秒: 'いまこの瞬間も、出会いの夜へと近づいています。',
};

const INITIAL_SSR_MS = new Date('2026-11-19T16:47:00Z').getTime();

export default function HeroSilhouetteStage({
  onFocusNotify,
  onTriggerBubbleBurst,
}: HeroSilhouetteStageProps) {
  const [nowMs, setNowMs] = useState<number>(INITIAL_SSR_MS);
  const [timezoneMode, setTimezoneMode] = useState<TimezoneMode>('jst');
  const [previewDebut, setPreviewDebut] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const [lighting, setLighting] = useState<LightingMode>('morning');
  const [whisperIndex, setWhisperIndex] = useState(0);
  const [silhouetteBounce, setSilhouetteBounce] = useState(0);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      setNowMs(Date.now());
    }, 0);
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => {
      window.clearTimeout(syncTimer);
      window.clearInterval(id);
    };
  }, []);

  const countdown = useMemo(() => {
    if (previewDebut) {
      return calculateTimeRemaining(
        DEBUT_TARGET_ISO,
        new Date(DEBUT_TARGET_ISO).getTime(),
      );
    }
    return calculateTimeRemaining(DEBUT_TARGET_ISO, nowMs);
  }, [nowMs, previewDebut]);

  const formattedTarget = useMemo(
    () => formatDebutTimestamp(DEBUT_TARGET_ISO, timezoneMode),
    [timezoneMode],
  );

  const activeLighting = useMemo(
    () => LIGHTING_PRESETS.find((p) => p.id === lighting) ?? LIGHTING_PRESETS[0],
    [lighting],
  );

  const countdownUnits = [
    { label: '日', value: String(countdown.days) },
    { label: '時間', value: padTwo(countdown.hours) },
    { label: '分', value: padTwo(countdown.minutes) },
    { label: '秒', value: padTwo(countdown.seconds) },
  ];

  const handleSilhouetteInteract = () => {
    setWhisperIndex((prev) => (prev + 1) % SHIINA_WHISPERS.length);
    setSilhouetteBounce((prev) => prev + 1);
    onTriggerBubbleBurst();
  };

  const handleTogglePreview = () => {
    const next = !previewDebut;
    setPreviewDebut(next);
    if (next) {
      onTriggerBubbleBurst();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({
      x: Math.max(-10, Math.min(10, nx * 16)),
      y: Math.max(-10, Math.min(10, ny * 14)),
    });
  };

  const handlePointerLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="top"
      className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 lg:pt-12 lg:pb-20"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Headline, Copy & Interactive Countdown */}
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <p className="text-sm font-medium text-[#0038a8] tracking-wide">
              <span>初配信ティザー</span>
              <span aria-hidden="true" className="mx-2 text-[#85a8f2]">
                ·
              </span>
              <span>2026年12月31日 20:00 開幕予定</span>
            </p>

            <h1
              className="font-display mt-3 font-bold tracking-tight text-[#061b4d] leading-[1.22]"
              style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3.35rem)',
                textWrap: 'balance',
              }}
            >
              蒼い海の底から、
              <br className="hidden sm:inline" />
              大晦日に会いに行くよ。
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#1a3570]">
              静かな海の底で、お歌とおしゃべりの準備をしている新人バーチャルライバー「シイナ」の公式予告ページです。
              <br className="hidden sm:inline" />
              2026年のいちばん最後の日、蒼い海のきらめきとお気に入りのリボンを揺らして、あなたの画面へ会いに行きます。
            </p>
          </div>

          {/* Interactive Countdown Console */}
          <div
            id="countdown"
            data-testid="countdown-console"
            data-preview={previewDebut ? 'true' : 'false'}
            className="mt-8 rounded-3xl border border-[#c2d6ff] bg-white/90 p-5 shadow-sm backdrop-blur-md sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0038a8]">
                <Clock className="h-4 w-4 text-[#0038a8]" />
                <span>
                  {previewDebut
                    ? 'デビュー瞬間プレビュー中'
                    : '初配信までのカウントダウン'}
                </span>
              </div>

              <div
                role="group"
                aria-label="表示タイムゾーンの切り替え"
                className="inline-flex items-center gap-1 rounded-xl bg-[#e6eeff] p-1"
              >
                <button
                  type="button"
                  onClick={() => setTimezoneMode('jst')}
                  className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    timezoneMode === 'jst'
                      ? 'bg-[#0038a8] text-white shadow-sm'
                      : 'text-[#1a3570] hover:text-[#0038a8]'
                  }`}
                >
                  日本時間
                </button>
                <button
                  type="button"
                  onClick={() => setTimezoneMode('local')}
                  className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    timezoneMode === 'local'
                      ? 'bg-[#0038a8] text-white shadow-sm'
                      : 'text-[#1a3570] hover:text-[#0038a8]'
                  }`}
                >
                  現地時間
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {countdownUnits.map((unit) => {
                const isSelected = selectedUnit === unit.label;
                return (
                  <button
                    key={unit.label}
                    type="button"
                    onClick={() => {
                      setSelectedUnit(isSelected ? null : unit.label);
                      onTriggerBubbleBurst();
                    }}
                    aria-pressed={isSelected}
                    className={`group flex flex-col items-center justify-center rounded-2xl border px-3 py-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] ${
                      isSelected
                        ? 'border-[#0038a8] bg-[#e6eeff] shadow-sm'
                        : 'border-[#d4e2ff] bg-[#f5f8ff] hover:border-[#6e98f2] hover:bg-[#ebf1ff]'
                    }`}
                  >
                    <div className="relative flex h-12 items-center justify-center overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={unit.value}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="font-num text-3xl font-bold tracking-tight text-[#0038a8] sm:text-4xl"
                        >
                          {unit.value}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="mt-1 text-xs font-semibold text-[#1a3570]">
                      {unit.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {previewDebut ? (
                <motion.p
                  key="preview-msg"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-4 rounded-xl bg-[#e6eeff] px-4 py-2.5 text-center text-sm font-semibold text-[#0038a8]"
                >
                  いよいよ初配信のはじまりです！蒼い海から「こんばんは、シイナですっ！」
                </motion.p>
              ) : selectedUnit ? (
                <motion.p
                  key={selectedUnit}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-4 rounded-xl bg-[#f5f8ff] px-4 py-2 text-center text-xs font-medium text-[#0038a8]"
                >
                  {UNIT_NOTES[selectedUnit]}
                </motion.p>
              ) : null}
            </AnimatePresence>

            {/* Ocean Tide Progress */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-[#1a3570]">
                <span>デビューまでの潮位</span>
                <span className="font-num font-semibold text-[#0038a8]">
                  {countdown.progressPercent}%
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#e6eeff]"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#4b7bec] via-[#1d5ce5] to-[#0038a8]"
                  initial={false}
                  animate={{ width: `${countdown.progressPercent}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Schedule stamp + interactive preview button */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6eeff] pt-4">
              <span className="text-xs font-medium text-[#1a3570]">
                予定日時：{formattedTarget}
              </span>

              <button
                type="button"
                onClick={handleTogglePreview}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#c2d6ff] bg-[#f5f8ff] px-3.5 py-2 text-xs font-semibold text-[#0038a8] transition-colors hover:bg-[#e6eeff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#0038a8]" />
                <span>
                  {previewDebut
                    ? 'ライブ時間に戻る'
                    : 'デビュー瞬間をプレビュー'}
                </span>
              </button>
            </div>
          </div>

          {/* Primary CTA row */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onFocusNotify}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#0038a8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#002a80] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
            >
              <Bell className="h-4 w-4" />
              <span>デビュー通知を受け取る</span>
            </button>

            <a
              href="#profile"
              className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-[#c2d6ff] bg-white/90 px-5 py-3 text-sm font-semibold text-[#0038a8] transition-colors hover:bg-[#e6eeff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] whitespace-nowrap shrink-0"
            >
              シイナのプロフィールを見る
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Anime Silhouette Stage */}
        <div className="flex flex-col lg:col-span-5">
          <div
            data-testid="silhouette-stage"
            data-lighting={lighting}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={`relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-[#c2d6ff] bg-gradient-to-b ${activeLighting.backdropClass} p-5 shadow-sm transition-colors duration-300`}
          >
            {/* Soft Caustic Glow */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl transition-colors duration-500 ${activeLighting.glowClass}`}
            />

            {/* Top bar inside stage: lighting switcher */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <span
                className={`text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  lighting === 'deep' ? 'text-white' : 'text-[#061b4d]'
                }`}
              >
                シルエット公開中
              </span>

              <div
                role="group"
                aria-label="海のライティング切り替え"
                className="inline-flex items-center gap-1 rounded-xl bg-[#061b4d]/45 p-1 backdrop-blur-sm"
              >
                {LIGHTING_PRESETS.map((preset) => {
                  const active = preset.id === lighting;
                  const Icon =
                    preset.id === 'morning'
                      ? Sun
                      : preset.id === 'deep'
                        ? Moon
                        : Waves;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLighting(preset.id)}
                      aria-pressed={active}
                      title={preset.description}
                      className={`inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-white text-[#0038a8] shadow-sm'
                          : 'text-white/95 hover:bg-white/15'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Silhouette Visual (1:1 aspect ratio matching user artwork) */}
            <div className="relative z-10 my-4 flex flex-1 items-center justify-center">
              <button
                type="button"
                onClick={handleSilhouetteInteract}
                aria-label="シイナに話しかける"
                className="group relative flex w-full max-w-[360px] flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] rounded-2xl"
              >
                <motion.div
                  key={silhouetteBounce}
                  initial={{ scale: 0.98 }}
                  animate={{
                    scale: 1,
                    x: pointerOffset.x,
                    y: pointerOffset.y,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="animate-gentle-float relative aspect-square w-full overflow-hidden rounded-2xl border border-[#c2d6ff] bg-white p-2 shadow-md"
                  style={{
                    boxShadow: `0 18px 42px -12px ${activeLighting.rimColor}`,
                  }}
                >
                  <Image
                    src="/assets/aistudio/image_fcade4c2.png"
                    alt="蒼いフリルドレスとリボンのVTuberシイナのアニメキャラクターシルエット"
                    fill
                    priority
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 1024px) 90vw, 360px"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-xl bg-[#0038a8]/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm whitespace-nowrap">
                    <Droplets className="h-3.5 w-3.5 text-[#bfd4ff]" />
                    <span>クリックして話しかける</span>
                  </span>
                </motion.div>
              </button>
            </div>

            {/* Whisper Speech Bubble */}
            <div className="relative z-10 rounded-2xl border border-[#d4e2ff] bg-white/95 p-4 text-[#061b4d] shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#0038a8]">
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircleHeart className="h-4 w-4" />
                  <span>シイナのひとこと</span>
                </span>
                <span className="font-num text-[#0038a8]">
                  {whisperIndex + 1} / {SHIINA_WHISPERS.length}
                </span>
              </div>

              <motion.p
                key={whisperIndex}
                data-testid="whisper-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="mt-1.5 text-sm font-medium leading-relaxed text-[#061b4d]"
              >
                {SHIINA_WHISPERS[whisperIndex]}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
