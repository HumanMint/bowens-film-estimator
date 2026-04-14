import { ShotRow } from './ShotRow.jsx'
import { ShotCard } from './ShotCard.jsx'
import { useShots, useAssumptions } from '../state/store.jsx'
import { computeScheduleTotals } from '../lib/calc.js'
import { formatDurationMins } from '../lib/timeRange.js'

const TH =
  'border-r border-ink-2 last:border-r-0 px-2 py-3 label-tiny text-paper-mute text-left font-normal'
const TH_NUM = TH + ' text-right'

export function Schedule() {
  const { shots, addShot, clearShots } = useShots()
  const { assumptions } = useAssumptions()
  const totals = computeScheduleTotals(shots, assumptions)

  const overFtAbs = Math.abs(totals.overFt)
  const overColor = totals.overFt > 0 ? 'text-safety' : 'text-grass'

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <p className="label-tiny text-kodak">Shooting Schedule</p>
          <p className="text-[11px] text-paper-mute mt-1">
            Shot-by-shot estimate · FPS column is per-row override only
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearShots}
            className="label-tiny text-paper-mute hover:text-safety transition-colors"
          >
            Clear
          </button>
          <span className="text-ink-2">|</span>
          <button
            onClick={addShot}
            className="label-tiny text-kodak hover:text-tape transition-colors"
          >
            + Add shot
          </button>
        </div>
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden md:block border border-ink-2 bg-ink-1/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-ink-0/70 border-b border-ink-2">
                <th className={TH + ' w-10 text-center'}>#</th>
                <th className={TH}>Rig</th>
                <th className={TH}>Description</th>
                <th className={TH}>Shot Type</th>
                <th className={TH}>Location</th>
                <th className={TH_NUM}>Est&nbsp;Time</th>
                <th className={TH_NUM}>Dur&nbsp;(s)</th>
                <th className={TH_NUM}>Takes</th>
                <th className={TH_NUM}>FPS</th>
                <th className={TH_NUM}>Film&nbsp;(s)</th>
                <th className={TH_NUM + ' text-kodak'}>Film&nbsp;(ft)</th>
                <th className={TH_NUM}>Actual&nbsp;(s)</th>
                <th className={TH_NUM}>Actual&nbsp;(ft)</th>
                <th className={TH}>Status</th>
                <th className={TH}>Notes</th>
                <th className="w-10 no-print"></th>
              </tr>
            </thead>
            <tbody>
              {shots.map((shot, i) => (
                <ShotRow key={shot.id} shot={shot} index={i} />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink-3 bg-ink-0/80">
                <td colSpan={9} className="px-3 py-3 label-tiny text-paper">
                  Total Film
                </td>
                <td className="tabular text-right px-2 py-3 text-[13px] text-paper-dim">{totals.totalFilmSec}s</td>
                <td className="tabular text-right px-2 py-3 text-[14px] text-kodak font-medium">
                  {totals.totalFilmFt.toFixed(2)}
                </td>
                <td className="tabular text-right px-2 py-3 text-[13px] text-paper-dim">{totals.totalActualSec}s</td>
                <td className="tabular text-right px-2 py-3 text-[14px] text-paper">
                  {totals.totalActualFt.toFixed(2)}
                </td>
                <td colSpan={3}></td>
              </tr>
              <tr className="border-t border-ink-2 bg-ink-0/60">
                <td colSpan={9} className="px-3 py-2.5 label-tiny text-paper-mute">
                  Budget
                </td>
                <td className="tabular text-right px-2 py-2.5 text-[13px] text-paper-mute">{totals.budgetSec}s</td>
                <td className="tabular text-right px-2 py-2.5 text-[13px] text-paper-mute">
                  {totals.budgetFt.toFixed(2)}
                </td>
                <td colSpan={5}></td>
              </tr>
              <tr className="border-t border-ink-2 bg-ink-0/60">
                <td colSpan={9} className="px-3 py-2.5 label-tiny text-paper-mute">
                  {totals.overFt > 0 ? 'Over budget' : 'Under budget'}
                </td>
                <td className={`tabular text-right px-2 py-2.5 text-[13px] ${overColor}`}>
                  {totals.overSec > 0 ? '+' : ''}
                  {totals.overSec}s
                </td>
                <td className={`tabular text-right px-2 py-2.5 text-[14px] font-medium ${overColor}`}>
                  {totals.overFt > 0 ? '+' : '−'}
                  {overFtAbs.toFixed(2)}
                </td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {shots.map((shot, i) => (
          <ShotCard key={shot.id} shot={shot} index={i} />
        ))}
        <div className="pt-2 flex items-center justify-between border-t border-ink-2 mt-4">
          <button
            onClick={clearShots}
            className="label-tiny text-paper-mute hover:text-safety"
          >
            Clear
          </button>
          <button onClick={addShot} className="label-tiny text-kodak hover:text-tape">
            + Add shot
          </button>
        </div>
      </div>

      <p className="mt-4 text-[10.5px] text-paper-mute italic max-w-xl">
        Legend · <span className="text-tape">yellow</span> editable input ·{' '}
        <span className="text-grass">green</span> auto-calculated. Change stock, perf, magazine
        size, or fps in the Assumptions panel — everything updates instantly.
        Totals above reproduce Bowen's formula — flag any per-row FPS mismatch for phase 2.
        Roll duration: {formatDurationMins(totals.rollDurationSec)}.
      </p>
    </div>
  )
}
