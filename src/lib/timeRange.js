// Parses Bowen's EST TIME strings: "0:01-0:05", "5-10", "1:30-2:00".
// Each side is either "ss" (seconds) or "mm:ss" (minutes:seconds).
// Returns { start, end } in seconds, or null if unparseable.

export function parseTimeRange(text) {
  if (typeof text !== 'string') return null
  const trimmed = text.trim()
  if (!trimmed) return null

  const dashIdx = trimmed.indexOf('-')
  if (dashIdx < 0) return null

  const leftRaw = trimmed.slice(0, dashIdx)
  const rightRaw = trimmed.slice(dashIdx + 1)

  const start = parseTimeToken(leftRaw)
  const end = parseTimeToken(rightRaw)
  if (start === null || end === null) return null

  return { start, end }
}

export function parseTimeToken(tok) {
  if (typeof tok !== 'string') return null
  const t = tok.trim()
  if (!t) return null

  if (t.includes(':')) {
    const [mStr, sStr] = t.split(':')
    const m = Number(mStr)
    const s = Number(sStr)
    if (!Number.isFinite(m) || !Number.isFinite(s)) return null
    return m * 60 + s
  }

  const v = Number(t)
  return Number.isFinite(v) ? v : null
}

// Format seconds as "Xm Ys" — matches Bowen's display (e.g. "8m 53s").
export function formatDurationMins(sec) {
  if (!Number.isFinite(sec)) return ''
  const whole = Math.trunc(sec)
  const m = Math.floor(whole / 60)
  const s = whole % 60
  return `${m}m ${s}s`
}

// Format seconds as "m:ss" for compact cells.
export function formatMMSS(sec) {
  if (!Number.isFinite(sec)) return ''
  const whole = Math.max(0, Math.trunc(sec))
  const m = Math.floor(whole / 60)
  const s = whole % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
