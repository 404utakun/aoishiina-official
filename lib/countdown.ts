export const DEBUT_TARGET_ISO = '2026-12-31T20:00:00+09:00';
export const CAMPAIGN_START_ISO = '2026-11-01T00:00:00+09:00';

export type TimezoneMode = 'jst' | 'local';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  progressPercent: number;
  isDebuted: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function calculateTimeRemaining(
  targetIso: string,
  nowMs: number,
  startIso: string = CAMPAIGN_START_ISO,
): CountdownState {
  const targetMs = new Date(targetIso).getTime();
  const startMs = new Date(startIso).getTime();
  const diffMs = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const spanMs = Math.max(1, targetMs - startMs);
  const elapsedMs = Math.min(spanMs, Math.max(0, nowMs - startMs));
  const progressPercent = Number(((elapsedMs / spanMs) * 100).toFixed(1));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    progressPercent,
    isDebuted: diffMs === 0,
  };
}

export function padTwo(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, '0');
}

export function formatDebutTimestamp(
  targetIso: string,
  mode: TimezoneMode,
): string {
  const date = new Date(targetIso);
  const timeZone = mode === 'jst' ? 'Asia/Tokyo' : undefined;

  const formatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  });

  const formatted = formatter.format(date);
  return mode === 'jst' ? `${formatted}（日本時間）` : `${formatted}（現地時間）`;
}

export function validateNotifyEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'メールアドレスを入力してください。',
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return {
      valid: false,
      error: '正しいメールアドレスの形式で入力してください。',
    };
  }

  return { valid: true };
}

export function validateBottleMessage(
  nickname: string,
  message: string,
): ValidationResult {
  const cleanName = nickname.trim();
  const cleanMsg = message.trim();

  if (!cleanName) {
    return {
      valid: false,
      error: 'おなまえを入力してください。',
    };
  }
  if (cleanName.length > 20) {
    return {
      valid: false,
      error: 'おなまえは20文字以内で入力してください。',
    };
  }
  if (!cleanMsg) {
    return {
      valid: false,
      error: '応援メッセージを入力してください。',
    };
  }
  if (cleanMsg.length > 140) {
    return {
      valid: false,
      error: 'メッセージは140文字以内で入力してください。',
    };
  }

  return { valid: true };
}
