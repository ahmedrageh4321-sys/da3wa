import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  DEFAULT_WEDDING_DETAILS,
  exportCommentsToCsv,
  generateGoogleCalendarUrl,
  generateIcsContent,
  generateWhatsAppShareUrl,
  INITIAL_COMMENTS,
} from './weddingData.ts';

test('calculateCountdown computes remaining time correctly', () => {
  const future = new Date('2026-11-20T19:00:00Z');
  const current = new Date('2026-11-19T18:00:00Z'); // 1 day and 1 hour before
  const countdown = calculateCountdown(future.toISOString(), current);

  assert.equal(countdown.isPast, false);
  assert.equal(countdown.days, 1);
  assert.equal(countdown.hours, 1);
  assert.equal(countdown.minutes, 0);
});

test('calculateCountdown marks past events properly', () => {
  const past = new Date('2026-01-01T00:00:00Z');
  const current = new Date('2026-02-01T00:00:00Z');
  const countdown = calculateCountdown(past.toISOString(), current);

  assert.equal(countdown.isPast, true);
  assert.equal(countdown.days, 0);
  assert.equal(countdown.hours, 0);
});

test('generateWhatsAppShareUrl includes bride and groom names and link', () => {
  const url = generateWhatsAppShareUrl(DEFAULT_WEDDING_DETAILS, 'https://my-wedding.app');
  assert.ok(url.startsWith('https://api.whatsapp.com/send?text='));
  assert.ok(url.includes(encodeURIComponent('محمد صالح')));
  assert.ok(url.includes(encodeURIComponent('زينب إمام')));
  assert.ok(url.includes(encodeURIComponent('https://my-wedding.app')));
});

test('generateGoogleCalendarUrl produces valid Google Calendar link', () => {
  const url = generateGoogleCalendarUrl(DEFAULT_WEDDING_DETAILS);
  assert.ok(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
  assert.ok(url.includes(encodeURIComponent('محمد صالح')));
});

test('generateIcsContent formats VCALENDAR structure', () => {
  const ics = generateIcsContent(DEFAULT_WEDDING_DETAILS);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('END:VCALENDAR'));
  assert.ok(ics.includes('SUMMARY:حفل زفاف محمد صالح و زينب إمام'));
});

test('exportCommentsToCsv produces formatted CSV with headers and rows', () => {
  const sample = [
    {
      id: 't1',
      authorName: 'أحمد محمود',
      relation: 'صديق',
      message: 'ألف مبروك',
      reaction: '❤️',
      createdAt: 'الآن',
      likes: 1,
    },
  ];
  const csv = exportCommentsToCsv(sample, DEFAULT_WEDDING_DETAILS);
  assert.ok(csv.includes('\uFEFFاسم المهنئ'));
  assert.ok(csv.includes('أحمد محمود'));
  assert.ok(csv.includes('ألف مبروك'));
});
