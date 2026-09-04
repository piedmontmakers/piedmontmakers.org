import assert from 'node:assert/strict';
import test from 'node:test';
import { eventAnchor, eventIsCurrent, eventIsUpcoming, pacificDate, upcomingHorizon } from '../src/lib/events.ts';

test('ongoing events stay current through their final day', () => {
  assert.equal(eventIsCurrent('2026-10-16', '2026-10-18', '2026-10-17'), true);
  assert.equal(eventIsCurrent('2026-10-16', '2026-10-18', '2026-10-18'), true);
  assert.equal(eventIsCurrent('2026-10-16', '2026-10-18', '2026-10-19'), false);
  assert.equal(eventIsCurrent('2026-10-16', undefined, '2026-10-17'), false);
});
test('homepage includes ongoing events and excludes dates beyond its window', () => {
  assert.equal(eventIsUpcoming('2026-10-16', '2026-10-18', '2026-10-17', '2026-11-16'), true);
  assert.equal(eventIsUpcoming('2026-11-17', undefined, '2026-10-17', '2026-11-16'), false);
});
test('distinct events on one date have stable distinct links', () => {
  assert.equal(eventAnchor('2026-12-06-festival'), 'event-2026-12-06-festival');
  assert.notEqual(eventAnchor('2026-12-06-festival'), eventAnchor('2026-12-06-meet'));
});
test('uses venue date across UTC midnight and daylight-saving changes', () => {
  assert.equal(pacificDate(new Date('2026-10-17T01:00:00Z')), '2026-10-16');
  assert.equal(pacificDate(new Date('2026-11-01T08:30:00Z')), '2026-11-01');
  assert.equal(upcomingHorizon('2026-12-15'), '2027-01-14');
});
