import { useShots, useAssumptions } from '../state/store.jsx'
import { computeScheduleTotals } from '../lib/calc.js'

export function TotalsBar() {
  const { shots } = useShots()
  const { assumptions } = useAssumptions()
  const totals = computeScheduleTotals(shots, assumptions)

  const pct = assumptions.budgetFt
    ? Math.min(100, (totals.totalFilmFt / assumptions.budgetFt) * 100)
    : 0
  const overColor = totals.overFt > 0 ? 'bg-safety' : 'bg-grass'
  const barColor = totals.overFt > 0 ? 'bg-safety' : 'bg-kodak'
  const overTextColor = totals.overFt > 0 ? 'text-safety' : 'text-grass'

  return (
    <div className="border-t border-ink-2 bg-ink-0/95 backdrop-blur-sm no-print md:hidden sticky bottom-0 z-30">
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="label-tiny text-paper-mute">Total · ft</p>
            <p className="tabular text-[20px] text-kodak leading-none mt-1">
              {totals.totalFilmFt.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="label-tiny text-paper-mute">Budget</p>
            <p className="tabular text-[14px] text-paper-dim mt-1">
              {assumptions.budgetFt.toFixed(0)}ft
            </p>
          </div>
          <div className="text-right">
            <p className="label-tiny text-paper-mute">
              {totals.overFt > 0 ? 'Over' : 'Under'}
            </p>
            <p className={`tabular text-[14px] mt-1 ${overTextColor}`}>
              {totals.overFt > 0 ? '+' : '−'}
              {Math.abs(totals.overFt).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-3 h-[3px] w-full bg-ink-2 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
          {totals.overFt > 0 && (
            <div className={`h-full ${overColor} transition-all duration-300`} style={{ width: '100%' }} />
          )}
        </div>
      </div>
    </div>
  )
}
