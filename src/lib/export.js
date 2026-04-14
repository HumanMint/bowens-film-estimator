import { computeScheduleTotals, computeShotDerived } from './calc.js'
import { formatDurationMins } from './timeRange.js'

// Minimal CSV escaper — wraps in quotes if the value contains comma, quote, or newline.
function csvCell(v) {
  if (v == null) return ''
  const s = String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function csvRow(cells) {
  return cells.map(csvCell).join(',')
}

export function buildCsv({ assumptions, shots }) {
  const totals = computeScheduleTotals(shots, assumptions)

  const lines = []
  lines.push(csvRow(['FILM ESTIMATOR — Export']))
  lines.push(csvRow(['Project', assumptions.projectTitle]))
  lines.push(csvRow(['Director', assumptions.director]))
  lines.push(csvRow(['DP', assumptions.dp]))
  lines.push(csvRow(['Shoot Date', assumptions.shootDate]))
  lines.push(csvRow(['Production Co.', assumptions.productionCo]))
  lines.push('')

  lines.push(csvRow(['ASSUMPTIONS']))
  lines.push(csvRow(['Stock', assumptions.stock]))
  if (assumptions.stock === '35mm') lines.push(csvRow(['Perf', assumptions.perf]))
  lines.push(csvRow(['Magazine (ft)', assumptions.magazineFt]))
  lines.push(csvRow(['Frame Rate (fps)', assumptions.fps]))
  lines.push(csvRow(['Roll Buffer (s/shot)', assumptions.bufferSec]))
  lines.push(csvRow(['Default Takes', assumptions.defaultTakes]))
  lines.push(csvRow(['Film Budget (ft)', assumptions.budgetFt]))
  lines.push('')

  lines.push(csvRow(['CALCULATED']))
  lines.push(csvRow(['Base ft/sec', totals.baseFtSec.toFixed(6)]))
  lines.push(csvRow(['ft/sec @ chosen fps', totals.ftSecAtFps.toFixed(6)]))
  lines.push(csvRow(['Roll Duration (s)', totals.rollDurationSec]))
  lines.push(csvRow(['Roll Duration (m:s)', formatDurationMins(totals.rollDurationSec)]))
  lines.push(csvRow(['Budget (s)', totals.budgetSec]))
  lines.push(csvRow(['Budget (m:s)', formatDurationMins(totals.budgetSec)]))
  lines.push('')

  lines.push(csvRow(['SHOOTING SCHEDULE']))
  lines.push(
    csvRow([
      '#',
      'Rig',
      'Description',
      'Shot Type',
      'Location',
      'Est Time',
      'Dur (s)',
      'Takes',
      'FPS',
      'Film (s)',
      'Film (ft)',
      'Actual (s)',
      'Actual (ft)',
      'Status',
      'Notes',
    ])
  )

  shots.forEach((shot, i) => {
    const d = computeShotDerived(shot, assumptions)
    lines.push(
      csvRow([
        i + 1,
        shot.rigGroup,
        shot.description,
        shot.shotType,
        shot.location,
        shot.estTime,
        d.shotDurSec ?? '',
        d.takes,
        d.fps,
        d.filmSec ?? '',
        d.filmFt ?? '',
        shot.actualSec ?? '',
        d.actualFt ?? '',
        shot.status,
        shot.notes,
      ])
    )
  })

  lines.push('')
  lines.push(csvRow(['TOTAL', '', '', '', '', '', '', '', '', totals.totalFilmSec, totals.totalFilmFt.toFixed(2), totals.totalActualSec, totals.totalActualFt.toFixed(2)]))
  lines.push(csvRow(['BUDGET', '', '', '', '', '', '', '', '', totals.budgetSec, totals.budgetFt.toFixed(2)]))
  lines.push(csvRow([totals.overFt > 0 ? 'OVER BUDGET' : 'UNDER BUDGET', '', '', '', '', '', '', '', '', totals.overSec, totals.overFt.toFixed(2)]))

  return lines.join('\n')
}

export function downloadCsv(state) {
  const csv = buildCsv(state)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const safeTitle = (state.assumptions.projectTitle || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-|-$/g, '')
  const a = document.createElement('a')
  a.href = url
  a.download = `film-estimate_${safeTitle}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function printSchedule() {
  window.print()
}
