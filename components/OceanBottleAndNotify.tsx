'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BellRing,
  Check,
  Copy,
  Heart,
  Mail,
  Send,
  Waves,
} from 'lucide-react';
import {
  validateBottleMessage,
  validateNotifyEmail,
} from '@/lib/countdown';
import {
  BottleMessage,
  INITIAL_BOTTLE_MESSAGES,
} from '@/lib/shiina-data';

interface OceanBottleAndNotifyProps {
  emailInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerBubbleBurst: () => void;
}

const STORAGE_CHEERS_KEY = 'shiina_cheer_count_v1';
const STORAGE_BOTTLES_KEY = 'shiina_bottles_v1';
const STORAGE_NOTIFY_KEY = 'shiina_notify_email_v1';
const STORAGE_EVENT = 'shiina-storage-update';

const DEFAULT_BOTTLES_JSON = JSON.stringify(INITIAL_BOTTLE_MESSAGES);

function subscribeStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function readStorage(key: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Ignore storage write errors in restricted contexts
  }
}

export default function OceanBottleAndNotify({
  emailInputRef,
  onTriggerBubbleBurst,
}: OceanBottleAndNotifyProps) {
  const cheerRaw = useSyncExternalStore(
    subscribeStorage,
    () => readStorage(STORAGE_CHEERS_KEY, '128'),
    () => '128',
  );
  const bottlesRaw = useSyncExternalStore(
    subscribeStorage,
    () => readStorage(STORAGE_BOTTLES_KEY, DEFAULT_BOTTLES_JSON),
    () => DEFAULT_BOTTLES_JSON,
  );
  const registeredEmailRaw = useSyncExternalStore(
    subscribeStorage,
    () => readStorage(STORAGE_NOTIFY_KEY, ''),
    () => '',
  );

  const cheerCount = useMemo(() => {
    const parsed = Number(cheerRaw);
    return !Number.isNaN(parsed) && parsed > 0 ? parsed : 128;
  }, [cheerRaw]);

  const bottles = useMemo<BottleMessage[]>(() => {
    try {
      const parsed = JSON.parse(bottlesRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback to seed messages
    }
    return INITIAL_BOTTLE_MESSAGES;
  }, [bottlesRaw]);

  const registeredEmail = registeredEmailRaw || null;

  const [hasCheered, setHasCheered] = useState(false);
  const [nickname, setNickname] = useState('');
  const [messageText, setMessageText] = useState('');
  const [bottleError, setBottleError] = useState<string | null>(null);
  const [bottleSuccess, setBottleSuccess] = useState(false);

  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  const handleCheerClick = () => {
    const next = cheerCount + 1;
    setHasCheered(true);
    writeStorage(STORAGE_CHEERS_KEY, String(next));
    onTriggerBubbleBurst();
  };

  const handleBottleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateBottleMessage(nickname, messageText);
    if (!check.valid) {
      setBottleError(check.error ?? '入力内容をご確認ください。');
      setBottleSuccess(false);
      return;
    }

    const newBottle: BottleMessage = {
      id: `user-${Date.now()}`,
      nickname: nickname.trim(),
      message: messageText.trim(),
      sentAtLabel: 'たった今',
    };

    const updated = [newBottle, ...bottles].slice(0, 6);
    setNickname('');
    setMessageText('');
    setBottleError(null);
    setBottleSuccess(true);
    writeStorage(STORAGE_BOTTLES_KEY, JSON.stringify(updated));
    onTriggerBubbleBurst();
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateNotifyEmail(notifyEmail);
    if (!check.valid) {
      setNotifyError(check.error ?? 'メールアドレスをご確認ください。');
      return;
    }

    const trimmed = notifyEmail.trim();
    setNotifyError(null);
    setNotifyEmail('');
    writeStorage(STORAGE_NOTIFY_KEY, trimmed);
    onTriggerBubbleBurst();
  };

  const handleCopySchedule = async () => {
    const text =
      '【VTuber シイナ 初配信デビュー】2026年12月31日（木）20:00（日本時間）';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedSchedule(true);
      window.setTimeout(() => setCopiedSchedule(false), 2400);
    } catch {
      setCopiedSchedule(true);
      window.setTimeout(() => setCopiedSchedule(false), 2400);
    }
  };

  return (
    <section
      id="bottle"
      className="relative z-10 mx-auto max-w-6xl px-4 py-10 pb-20 sm:px-6"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* 03. Ocean Message Bottle & Cheer Counter */}
        <div className="rounded-3xl border border-[#c2d6ff] bg-white/90 p-6 shadow-sm backdrop-blur-md lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-[#0038a8]" />
              <h3 className="font-display text-xl font-bold text-[#061b4d]">
                03. 海の応援ボトル
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCheerClick}
              data-testid="cheer-button"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#85a8f2] bg-[#f5f8ff] px-4 py-2 text-xs font-semibold text-[#0038a8] transition-all duration-150 hover:bg-[#e6eeff] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] whitespace-nowrap shrink-0"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  hasCheered
                    ? 'fill-[#0038a8] text-[#0038a8]'
                    : 'text-[#0038a8]'
                }`}
              />
              <span>シイナを応援する</span>
              <span
                data-testid="cheer-count"
                className="font-num font-bold text-[#0038a8]"
              >
                {cheerCount}
              </span>
            </button>
          </div>

          <p className="mt-2 text-sm text-[#1a3570]">
            初配信を楽しみにしている気持ちを、蒼い海へメッセージボトルとして届けてみませんか？
          </p>

          <form onSubmit={handleBottleSubmit} className="mt-5 space-y-3" noValidate>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label
                  htmlFor="bottle-nickname"
                  className="block text-xs font-semibold text-[#0038a8]"
                >
                  おなまえ
                </label>
                <input
                  id="bottle-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (bottleError) setBottleError(null);
                  }}
                  placeholder="例：みなと"
                  maxLength={20}
                  className="mt-1 w-full rounded-xl border border-[#c2d6ff] bg-white px-3.5 py-2.5 text-sm text-[#061b4d] placeholder:text-[#7a97d6] focus:border-[#0038a8] focus:outline-none focus:ring-2 focus:ring-[#dbe7ff]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="bottle-message"
                  className="block text-xs font-semibold text-[#0038a8]"
                >
                  応援メッセージ
                </label>
                <input
                  id="bottle-message"
                  type="text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (bottleError) setBottleError(null);
                  }}
                  placeholder="例：大晦日の初配信、楽しみにしています！"
                  maxLength={140}
                  className="mt-1 w-full rounded-xl border border-[#c2d6ff] bg-white px-3.5 py-2.5 text-sm text-[#061b4d] placeholder:text-[#7a97d6] focus:border-[#0038a8] focus:outline-none focus:ring-2 focus:ring-[#dbe7ff]"
                />
              </div>
            </div>

            {bottleError && (
              <p
                role="alert"
                className="text-xs font-semibold text-[#be123c]"
              >
                {bottleError}
              </p>
            )}

            {bottleSuccess && !bottleError && (
              <p className="text-xs font-semibold text-[#0038a8]">
                応援ボトルを蒼い海へ浮かべました！ありがとうございます。
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#0038a8] px-5 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#002a80] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8] whitespace-nowrap shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>応援ボトルを流す</span>
              </button>
            </div>
          </form>

          {/* Bottle List */}
          <div
            data-testid="bottle-list"
            className="mt-6 divide-y divide-[#e6eeff] border-t border-[#e6eeff]"
          >
            <AnimatePresence initial={false}>
              {bottles.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="py-3.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#0038a8]">
                    <span className="font-bold">{item.nickname}</span>
                    <span className="text-[#1a3570]/75">
                      {item.sentAtLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[#061b4d]">
                    {item.message}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 04. Debut Notification Reservation */}
        <div
          id="notify-section"
          className="flex flex-col justify-between rounded-3xl border border-[#c2d6ff] bg-gradient-to-b from-[#e6eeff]/85 to-white/95 p-6 shadow-sm backdrop-blur-md lg:col-span-5"
        >
          <div>
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-[#0038a8]" />
              <h3 className="font-display text-xl font-bold text-[#061b4d]">
                04. デビュー通知を受け取る
              </h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#1a3570]">
              配信ページの公開や、2026年12月31日の初配信スタート時刻に合わせてお知らせをお送りします。
            </p>

            {registeredEmail ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                data-testid="notify-confirmed"
                className="mt-6 rounded-2xl border border-[#85a8f2] bg-white p-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#0038a8]">
                  <Check className="h-4 w-4 text-[#0038a8]" />
                  <span>通知予約を受け付けました</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#1a3570]">
                  ご登録アドレス（{registeredEmail}）へ、初配信のご案内をお送りする準備が整いました。大晦日の夜にお会いしましょう！
                </p>
                <button
                  type="button"
                  onClick={() => writeStorage(STORAGE_NOTIFY_KEY, null)}
                  className="mt-4 inline-flex min-h-[38px] items-center rounded-xl border border-[#c2d6ff] bg-[#f5f8ff] px-3.5 py-1.5 text-xs font-semibold text-[#0038a8] transition-colors hover:bg-[#e6eeff]"
                >
                  別のアドレスで登録し直す
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleNotifySubmit}
                className="mt-6 space-y-3"
                noValidate
              >
                <div>
                  <label
                    htmlFor="notify-email"
                    className="block text-xs font-semibold text-[#0038a8]"
                  >
                    メールアドレス
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#4b7bec]" />
                    <input
                      ref={emailInputRef}
                      id="notify-email"
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => {
                        setNotifyEmail(e.target.value);
                        if (notifyError) setNotifyError(null);
                      }}
                      placeholder="例：ocean@example.jp"
                      className="w-full rounded-xl border border-[#c2d6ff] bg-white py-3 pr-4 pl-10 text-sm text-[#061b4d] placeholder:text-[#7a97d6] focus:border-[#0038a8] focus:outline-none focus:ring-2 focus:ring-[#dbe7ff]"
                    />
                  </div>
                </div>

                {notifyError && (
                  <p
                    role="alert"
                    data-testid="notify-error"
                    className="text-xs font-semibold text-[#be123c]"
                  >
                    {notifyError}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0038a8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#002a80] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8]"
                >
                  <BellRing className="h-4 w-4" />
                  <span>通知を予約する</span>
                </button>
              </form>
            )}
          </div>

          {/* Schedule Copy Helper */}
          <div className="mt-8 border-t border-[#c2d6ff]/80 pt-5">
            <p className="text-xs font-semibold text-[#0038a8]">
              初配信の予定をメモしておく
            </p>
            <p className="mt-1 text-xs text-[#1a3570]">
              2026年12月31日（木）20:00 日本時間
            </p>
            <button
              type="button"
              onClick={handleCopySchedule}
              className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#c2d6ff] bg-white px-4 py-2 text-xs font-semibold text-[#0038a8] transition-colors hover:bg-[#f5f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038a8]"
            >
              {copiedSchedule ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#0038a8]" />
                  <span>予定をコピーしました</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[#0038a8]" />
                  <span>予定テキストをコピーする</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
