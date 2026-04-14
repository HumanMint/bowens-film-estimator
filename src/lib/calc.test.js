import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  round,
  getBaseFtSec,
  computeFtSecAtFps,
  computeRollDurationSec,
  computeBudgetSec,
  computeShotDurSec,
  computeFilmSec,
  computeFilmFt,
  computeTotalFilmFtLegacy,
  computeScheduleTotals,
  computeShotDerived,
} from './calc.js'
import { parseTimeRange, parseTimeToken, formatDurationMins, formatMMSS } from './timeRange.js'
import { BASE_FT_SEC } from '../constants.js'

test('round: basic positive integers and decimals', () => {
  assert.equal(round(1.234567, 2), 1.23)
  assert.equal(round(1.235, 2), 1.24)
  assert.equal(round(0.6006006006006006 * (24 / 24), 6), 0.600601)
  assert.equal(round(533.0, 0), 533)
})

test('BASE_FT_SEC table matches Bowen exactly', () => {
  assert.equal(BASE_FT_SEC['16mm'], 0.6006006006006006)
  assert.equal(BASE_FT_SEC['35mm-4perf'], 1.503759398496241)
  assert.equal(BASE_FT_SEC['35mm-3perf'], 1.126760563380282)
  assert.equal(BASE_FT_SEC['35mm-2perf'], 0.7504690431519699)
})

test('getBaseFtSec: 16mm ignores perf', () => {
  assert.equal(getBaseFtSec('16mm', '2-perf'), BASE_FT_SEC['16mm'])
  assert.equal(getBaseFtSec('16mm', '4-perf'), BASE_FT_SEC['16mm'])
})

test('getBaseFtSec: 35mm picks by perf', () => {
  assert.equal(getBaseFtSec('35mm', '2-perf'), BASE_FT_SEC['35mm-2perf'])
  assert.equal(getBaseFtSec('35mm', '3-perf'), BASE_FT_SEC['35mm-3perf'])
  assert.equal(getBaseFtSec('35mm', '4-perf'), BASE_FT_SEC['35mm-4perf'])
})

test('computeFtSecAtFps: 24fps is identity (to 6 decimals)', () => {
  const base = BASE_FT_SEC['16mm']
  assert.equal(computeFtSecAtFps(base, 24), round(base, 6))
})

test('computeFtSecAtFps: 48fps doubles the rate', () => {
  const base = BASE_FT_SEC['35mm-4perf']
  const got = computeFtSecAtFps(base, 48)
  assert.equal(got, round(base * 2, 6))
})

test('computeRollDurationSec: 400ft 35mm 2-perf at 24fps = 533s (matches sheet)', () => {
  const base = getBaseFtSec('35mm', '2-perf')
  const ftSec = computeFtSecAtFps(base, 24)
  const rollSec = computeRollDurationSec(400, ftSec)
  assert.equal(rollSec, 533)
})

test('computeRollDurationSec: 400ft 35mm 4-perf at 24fps = 266s (matches sheet)', () => {
  const base = getBaseFtSec('35mm', '4-perf')
  const ftSec = computeFtSecAtFps(base, 24)
  const rollSec = computeRollDurationSec(400, ftSec)
  assert.equal(rollSec, 266)
})

test('computeRollDurationSec: 400ft 16mm at 24fps = 666s', () => {
  const base = getBaseFtSec('16mm')
  const ftSec = computeFtSecAtFps(base, 24)
  const rollSec = computeRollDurationSec(400, ftSec)
  assert.equal(rollSec, 666)
})

test('computeBudgetSec: 800ft 35mm 2-perf at 24fps = 1066s (matches sheet)', () => {
  const base = getBaseFtSec('35mm', '2-perf')
  const ftSec = computeFtSecAtFps(base, 24)
  const budget = computeBudgetSec(800, ftSec)
  assert.equal(budget, 1066)
})

test('parseTimeToken: integer seconds', () => {
  assert.equal(parseTimeToken('5'), 5)
  assert.equal(parseTimeToken('10'), 10)
  assert.equal(parseTimeToken(' 30 '), 30)
})

test('parseTimeToken: m:ss', () => {
  assert.equal(parseTimeToken('0:01'), 1)
  assert.equal(parseTimeToken('0:05'), 5)
  assert.equal(parseTimeToken('1:30'), 90)
  assert.equal(parseTimeToken('2:00'), 120)
})

test('parseTimeToken: empty or garbage → null', () => {
  assert.equal(parseTimeToken(''), null)
  assert.equal(parseTimeToken('   '), null)
  assert.equal(parseTimeToken('hello'), null)
  assert.equal(parseTimeToken(':bad'), null)
})

test('parseTimeRange: canonical "0:01-0:05"', () => {
  const r = parseTimeRange('0:01-0:05')
  assert.deepEqual(r, { start: 1, end: 5 })
})

test('parseTimeRange: plain seconds "5-10"', () => {
  const r = parseTimeRange('5-10')
  assert.deepEqual(r, { start: 5, end: 10 })
})

test('parseTimeRange: mixed "1:30-2:00"', () => {
  const r = parseTimeRange('1:30-2:00')
  assert.deepEqual(r, { start: 90, end: 120 })
})

test('parseTimeRange: empty or missing dash → null', () => {
  assert.equal(parseTimeRange(''), null)
  assert.equal(parseTimeRange('5'), null)
  assert.equal(parseTimeRange(null), null)
  assert.equal(parseTimeRange(undefined), null)
})

test('computeShotDurSec: "0:01-0:05" + 3s buffer = 7s (matches sheet)', () => {
  assert.equal(computeShotDurSec('0:01-0:05', 3), 7)
})

test('computeShotDurSec: empty → null', () => {
  assert.equal(computeShotDurSec('', 3), null)
})

test('computeShotDurSec: negative range clamped to 0, then buffer added', () => {
  assert.equal(computeShotDurSec('10-5', 3), 3)
})

test('computeFilmSec: multiplies by takes', () => {
  assert.equal(computeFilmSec(7, 2), 14)
  assert.equal(computeFilmSec(null, 2), null)
})

test('computeFilmFt: 7s × 16mm base × 24fps = 4.20', () => {
  const ft = computeFilmFt(7, BASE_FT_SEC['16mm'], 24)
  assert.equal(ft, 4.2)
})

test('computeFilmFt: 14s × 35mm-2perf × 24fps = 10.51', () => {
  const ft = computeFilmFt(14, BASE_FT_SEC['35mm-2perf'], 24)
  // 14 * 0.7504690431519699 * 1 = 10.5066... → round(_, 2) = 10.51
  assert.equal(ft, 10.51)
})

test('computeFilmFt: per-row fps override scales linearly', () => {
  const ft48 = computeFilmFt(10, BASE_FT_SEC['35mm-4perf'], 48)
  const ft24 = computeFilmFt(10, BASE_FT_SEC['35mm-4perf'], 24)
  assert.ok(Math.abs(ft48 - ft24 * 2) < 0.01)
})

test('computeTotalFilmFtLegacy: preserves quirky total formula', () => {
  // Sheet formula: SUM(filmSec) × (magazine / rollDurationSec)
  // With 35mm 2-perf / 400ft / 24fps → rollDurationSec = 533
  // If sumFilmSec = 100, total = 100 × (400/533) = 75.05
  const magazine = 400
  const rollSec = 533
  const totalFt = computeTotalFilmFtLegacy(100, magazine, rollSec)
  assert.equal(totalFt, round(100 * (400 / 533), 2))
})

test('formatDurationMins: matches sheet display', () => {
  assert.equal(formatDurationMins(533), '8m 53s')
  assert.equal(formatDurationMins(1066), '17m 46s')
  assert.equal(formatDurationMins(7), '0m 7s')
})

test('formatMMSS: zero-pads seconds', () => {
  assert.equal(formatMMSS(533), '8:53')
  assert.equal(formatMMSS(65), '1:05')
})

test('computeScheduleTotals: sheet defaults scenario', () => {
  // Recreate the sheet's defaults: 35mm 2-perf, 400ft, 24fps, buffer 3, takes 1,
  // budget 800, with one shot at "0:01-0:05".
  const assumptions = {
    stock: '35mm',
    perf: '2-perf',
    magazineFt: 400,
    fps: 24,
    bufferSec: 3,
    defaultTakes: 1,
    budgetFt: 800,
  }
  const shots = [{ estTime: '0:01-0:05', takes: null, fps: null, actualSec: null }]
  const t = computeScheduleTotals(shots, assumptions)

  assert.equal(t.baseFtSec, BASE_FT_SEC['35mm-2perf'])
  assert.equal(t.ftSecAtFps, round(BASE_FT_SEC['35mm-2perf'], 6))
  assert.equal(t.rollDurationSec, 533)
  assert.equal(t.budgetSec, 1066)
  assert.equal(t.totalFilmSec, 7) // one shot, 7s
  // Total ft via the quirky formula: 7 × (400/533) = 5.2533... → 5.25
  assert.equal(t.totalFilmFt, round(7 * (400 / 533), 2))
  // Under budget
  assert.ok(t.overFt < 0)
})

test('computeShotDerived: inherits fps/takes from assumptions when null', () => {
  const assumptions = {
    stock: '16mm',
    perf: '2-perf',
    fps: 48,
    bufferSec: 2,
    defaultTakes: 3,
  }
  const shot = { estTime: '0-10', takes: null, fps: null }
  const d = computeShotDerived(shot, assumptions)
  assert.equal(d.fps, 48)
  assert.equal(d.takes, 3)
  assert.equal(d.shotDurSec, 12) // 10 - 0 + 2
  assert.equal(d.filmSec, 36) // 12 × 3
})

test('computeShotDerived: per-row overrides beat defaults', () => {
  const assumptions = { stock: '16mm', perf: '2-perf', fps: 24, bufferSec: 0, defaultTakes: 1 }
  const shot = { estTime: '0-10', takes: 5, fps: 48 }
  const d = computeShotDerived(shot, assumptions)
  assert.equal(d.fps, 48)
  assert.equal(d.takes, 5)
  assert.equal(d.filmSec, 50)
})
