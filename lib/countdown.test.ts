import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEBUT_TARGET_ISO,
  calculateTimeRemaining,
  formatDebutTimestamp,
  padTwo,
  validateBottleMessage,
  validateNotifyEmail,
} from './countdown';

test('calculateTimeRemaining computes exact days, hours, minutes, seconds before debut', () => {
  // 2026-12-30T18:58:55+09:00 is 1 day, 1 hour, 1 minute, 5 seconds before 2026-12-31T20:00:00+09:00
  const nowMs = new Date('2026-12-30T18:58:55+09:00').getTime();
  const result = calculateTimeRemaining(DEBUT_TARGET_ISO, nowMs);

  assert.equal(result.days, 1);
  assert.equal(result.hours, 1);
  assert.equal(result.minutes, 1);
  assert.equal(result.seconds, 5);
  assert.equal(result.isDebuted, false);
  assert.ok(result.progressPercent > 0 && result.progressPercent <= 100);
});

test('calculateTimeRemaining clamps to zero and marks debuted at or past target', () => {
  const afterMs = new Date('2027-01-01T00:00:00+09:00').getTime();
  const result = calculateTimeRemaining(DEBUT_TARGET_ISO, afterMs);

  assert.equal(result.days, 0);
  assert.equal(result.hours, 0);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
  assert.equal(result.totalSeconds, 0);
  assert.equal(result.progressPercent, 100);
  assert.equal(result.isDebuted, true);
});

test('padTwo pads single digits cleanly', () => {
  assert.equal(padTwo(0), '00');
  assert.equal(padTwo(7), '07');
  assert.equal(padTwo(42), '42');
});

test('formatDebutTimestamp outputs Japanese formatted date for JST and local', () => {
  const jstStr = formatDebutTimestamp(DEBUT_TARGET_ISO, 'jst');
  const localStr = formatDebutTimestamp(DEBUT_TARGET_ISO, 'local');

  assert.match(jstStr, /2026年12月31日/);
  assert.match(jstStr, /日本時間/);
  assert.match(localStr, /現地時間/);
});

test('validateNotifyEmail rejects empty and invalid emails with Japanese messages', () => {
  const emptyRes = validateNotifyEmail('   ');
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.error?.includes('入力'));

  const badRes = validateNotifyEmail('invalid-email');
  assert.equal(badRes.valid, false);
  assert.ok(badRes.error?.includes('形式'));

  const okRes = validateNotifyEmail('shiina.fan@example.jp');
  assert.equal(okRes.valid, true);
});

test('validateBottleMessage enforces nickname and message rules', () => {
  assert.equal(validateBottleMessage('', '応援しています').valid, false);
  assert.equal(validateBottleMessage('しずく', '   ').valid, false);
  assert.equal(
    validateBottleMessage('あ'.repeat(21), '応援しています').valid,
    false,
  );
  assert.equal(
    validateBottleMessage('みなと', '大晦日の初配信とても楽しみにしています！')
      .valid,
    true,
  );
});
