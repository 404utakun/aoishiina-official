'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ChevronRight, Compass, Shell } from 'lucide-react';
import oceanBackdrop from '@/src/assets/images/ocean_stage_backdrop_1795106886066.jpg';
import { DEBUT_MILESTONES, PROFILE_TABS } from '@/lib/shiina-data';

export default function ProfileAndSchedule() {
  const [activeTabId, setActiveTabId] = useState<string>(PROFILE_TABS[0].id);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    DEBUT_MILESTONES[0].id,
  );

  const activeTab =
    PROFILE_TABS.find((t) => t.id === activeTabId) ?? PROFILE_TABS[0];
  const activeMilestone =
    DEBUT_MILESTONES.find((m) => m.id === selectedMilestoneId) ??
    DEBUT_MILESTONES[0];

  return (
    <section
      id="profile"
      className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16"
    >
      {/* Ocean Story Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#c2d6ff] bg-[#00287a] shadow-sm">
        <div className="relative aspect-[21/9] min-h-[270px] sm:min-h-[240px] w-full">
          <Image
            src={oceanBackdrop}
            alt="陽光が差し込む蒼い海の景色"
            fill
            priority
            referrerPolicy="no-referrer"
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover saturate-125 hue-rotate-[12deg]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#041645]/92 via-[#00287a]/60 to-[#0038a8]/30"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold tracking-wider text-[#dbe7ff]">
              シイナの物語 · 海底の小さなアトリエより
            </p>
            <h2
              className="font-display mt-2 max-w-2xl text-xl font-bold leading-snug text-white sm:text-2xl lg:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              「波の音がやさしい夜に、みんなで笑い合える場所を作りたい。」
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#eef4ff]">
              まだお姿はシルエットの秘密のまま。大晦日の夜、いちばん最初の歌声と一緒にお会いできる日を、海の底から心待ちにしています。
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Editorial Section: Profile + Schedule */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* 01. Interactive Profile */}
        <div className="rounded-3xl border border-[#c2d6ff] bg-white/90 p-6 shadow-sm backdrop-blur-md lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shell className="h-5 w-5 text-[#0038a8]" />
              <h3 className="font-display text-xl font-bold text-[#061b4d]">
                01. シイナのプロフィール
              </h3>
            </div>

            <div
              role="tablist"
              aria-label="プロフィール項目の切り替え"
              className="inline-flex items-center gap-1 rounded-xl bg-[#e6eeff] p-1"
            >
              {PROFILE_TABS.map((tab) => {
                const isSelected = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#0038a8] text-white shadow-sm'
                        : 'text-[#1a3570] hover:text-[#0038a8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.dl
            key={activeTab.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 divide-y divide-[#e6eeff]"
          >
            {activeTab.items.map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <dt className="text-xs font-semibold text-[#0038a8]">
                  {item.key}
                </dt>
                <dd className="text-sm font-medium text-[#061b4d] sm:text-right">
                  {item.value}
                </dd>
              </div>
            ))}
          </motion.dl>

          <p className="mt-5 rounded-2xl bg-[#f5f8ff] p-4 text-xs leading-relaxed text-[#1a3570]">
            海と星がすきな、ちょっぴりマイペースな女の子。お歌の練習をしながら、みんなと交わす最初の挨拶を毎日考えています。
          </p>
        </div>

        {/* 02. Interactive Debut Schedule */}
        <div
          id="schedule"
          className="rounded-3xl border border-[#c2d6ff] bg-white/90 p-6 shadow-sm backdrop-blur-md lg:col-span-6"
        >
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#0038a8]" />
            <h3 className="font-display text-xl font-bold text-[#061b4d]">
              02. 初配信までの航海ノート
            </h3>
          </div>

          <div className="mt-5 space-y-2.5">
            {DEBUT_MILESTONES.map((milestone) => {
              const isSelected = milestone.id === selectedMilestoneId;
              return (
                <button
                  key={milestone.id}
                  type="button"
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  aria-expanded={isSelected}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] ${
                    isSelected
                      ? 'border-[#0038a8] bg-[#e6eeff]/85'
                      : 'border-[#e6eeff] bg-[#f8faff] hover:border-[#85a8f2] hover:bg-[#f0f5ff]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#0038a8] font-medium">
                      <span className="font-num font-bold">
                        {milestone.step}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{milestone.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{milestone.statusLabel}</span>
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-[#061b4d]">
                      {milestone.title}
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-[#0038a8] transition-transform duration-150 ${
                      isSelected ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeMilestone.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 rounded-2xl bg-[#f5f8ff] p-4"
          >
            <p className="text-xs font-semibold text-[#0038a8]">
              {activeMilestone.summary}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#1a3570]">
              {activeMilestone.detail}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
