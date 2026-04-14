import { BASE_FT_SEC } from '../constants.js'
import { parseTimeRange } from './timeRange.js'

// Match Excel's ROUND: half-away-from-zero to N decimals.
// JS Math.round breaks ties toward +Infinity which is close enough for our
// positive-only values, but we implement it explicitly so there's no surprise.
export function round(n, decimals = 0) {
  if (!Number.isFinite(n)) return n
  const f = 10 ** decimals
  return Math.sign(n) * Math.round(Math.abs(n) * f) / f
}

// Assumptions!B16 — "Base ft/sec (at 24fps)".
// Picks from the hidden lookup table. If stock is 16mm, perf is ignored.
// Unknown keys fall back to 16mm to match the sheet's IF-chain default.
export function getBaseFtSec(stock, perf) {
  if (stock === '16mm') return BASE_FT_SEC['16mm']
  if (stock === '35mm') {
    if (perf === '4-perf') return BASE_FT_SEC['35mm-4perf']
    if (perf === '3-perf') return BASE_FT_SEC['35mm-3perf']
    if (perf === '2-perf') return BASE_FT_SEC['35mm-2perf']
  }
  return BASE_FT_SEC['16mm']
}

// Assumptions!B17 — ft/sec at chosen fps. ROUND(base * fps/24, 6).
export function computeFtSecAtFps(baseFtSec, fps) {
  if (!Number.isFinite(baseFtSec) || !Number.isFinite(fps)) return 0
  return round(baseFtSec * (fps / 24), 6)
}

// Assumptions!B18 — ROUND(magazine / ftSecAtFps, 0). Seconds.
export function computeRollDurationSec(magazineFt, ftSecAtFps) {
  if (!Number.isFinite(magazineFt) || !ftSecAtFps) return 0
  return round(magazineFt / ftSecAtFps, 0)
}

// Assumptions!B26 — ROUND(budget / ftSecAtFps, 0). Seconds.
export function computeBudgetSec(budgetFt, ftSecAtFps) {
  if (!Number.isFinite(budgetFt) || !ftSecAtFps) return 0
  return round(budgetFt / ftSecAtFps, 0)
}

// Schedule!Gn — parses EST TIME and returns (end - start) + buffer seconds.
// Returns null when estTime is empty or unparseable (sheet returns "" in that case).
export function computeShotDurSec(estTime, bufferSec) {
  const range = parseTimeRange(estTime)
  if (!range) return null
  const buf = Number.isFinite(bufferSec) ? bufferSec : 0
  return Math.max(0, range.end - range.start) + buf
}

// Schedule!Jn — FILM (s) = shotDur * takes.
export function computeFilmSec(shotDurSec, takes) {
  if (shotDurSec == null || !Number.isFinite(takes)) return null
  return shotDurSec * takes
}

// Schedule!Kn or Mn — ROUND(filmSec * baseFtSec * fps/24, 2).
// Uses per-row fps. If filmSec is null, returns null.
export function computeFilmFt(filmSec, baseFtSec, fps) {
  if (filmSec == null || !Number.isFinite(baseFtSec) || !Number.isFinite(fps)) return null
  return round(filmSec * baseFtSec * (fps / 24), 2)
}

// Schedule!K24 — Bowen's total formula:
//   ROUND(SUM(filmSec) * (magazine / rollDurationSec), 2)
// Note: algebraically this uses the DEFAULT fps (rollDurationSec is derived
// from the default fps), not per-row fps overrides. Phase 2 should replace
// this with SUM(filmFt). See PHASE2.md.
export function computeTotalFilmFtLegacy(sumFilmSec, magazineFt, rollDurationSec) {
  if (!Number.isFinite(sumFilmSec) || !rollDurationSec) return 0
  return round(sumFilmSec * (magazineFt / rollDurationSec), 2)
}

// Aggregated totals for a schedule. Mirrors Schedule rows 24-26.
// - shots: array of normalized shot objects with resolved fps/takes
// - assumptions: the full assumptions object
export function computeScheduleTotals(shots, assumptions) {
  const baseFtSec = getBaseFtSec(assumptions.stock, assumptions.perf)
  const ftSecAtFps = computeFtSecAtFps(baseFtSec, assumptions.fps)
  const rollDurationSec = computeRollDurationSec(assumptions.magazineFt, ftSecAtFps)
  const budgetSec = computeBudgetSec(assumptions.budgetFt, ftSecAtFps)

  let sumFilmSec = 0
  let sumActualSec = 0

  for (const shot of shots) {
    const takes = Number.isFinite(shot.takes) ? shot.takes : assumptions.defaultTakes
    const shotDurSec = computeShotDurSec(shot.estTime, assumptions.bufferSec)
    const filmSec = computeFilmSec(shotDurSec, takes)
    if (filmSec != null) sumFilmSec += filmSec
    if (Number.isFinite(shot.actualSec)) sumActualSec += shot.actualSec
  }

  const totalFilmFt = computeTotalFilmFtLegacy(sumFilmSec, assumptions.magazineFt, rollDurationSec)
  const totalActualFt = computeTotalFilmFtLegacy(sumActualSec, assumptions.magazineFt, rollDurationSec)

  return {
    baseFtSec,
    ftSecAtFps,
    rollDurationSec,
    budgetSec,
    totalFilmSec: sumFilmSec,
    totalFilmFt,
    totalActualSec: sumActualSec,
    totalActualFt,
    budgetFt: assumptions.budgetFt,
    overFt: round(totalFilmFt - assumptions.budgetFt, 2),
    overSec: sumFilmSec - budgetSec,
  }
}

// Compute a single shot's derived fields (for rendering).
export function computeShotDerived(shot, assumptions) {
  const takes = Number.isFinite(shot.takes) ? shot.takes : assumptions.defaultTakes
  const fps = Number.isFinite(shot.fps) ? shot.fps : assumptions.fps
  const baseFtSec = getBaseFtSec(assumptions.stock, assumptions.perf)

  const shotDurSec = computeShotDurSec(shot.estTime, assumptions.bufferSec)
  const filmSec = computeFilmSec(shotDurSec, takes)
  const filmFt = computeFilmFt(filmSec, baseFtSec, fps)

  const actualFt = Number.isFinite(shot.actualSec)
    ? computeFilmFt(shot.actualSec, baseFtSec, fps)
    : null

  return { takes, fps, shotDurSec, filmSec, filmFt, actualFt }
}
