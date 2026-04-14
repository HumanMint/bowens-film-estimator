import { useShots, useAssumptions } from '../state/store.jsx'
import { computeShotDerived } from '../lib/calc.js'

const CELL = 'border-r border-ink-2 last:border-r-0'
const INPUT =
  'w-full bg-transparent text-paper placeholder:text-paper-mute/60 text-[12.5px] py-2 px-2 focus:bg-ink-0/80 focus:outline-none'
const INPUT_NUM = INPUT + ' tabular text-right'

export function ShotRow({ shot, index }) {
  const { updateShot, removeShot } = useShots()
  const { assumptions } = useAssumptions()

  const derived = computeShotDerived(shot, assumptions)

  const set = (key) => (e) => {
    const el = e.target
    const raw = el.type === 'number' ? (el.value === '' ? null : el.valueAsNumber) : el.value
    updateShot(shot.id, key, raw)
  }

  // Render calculated cells with a subtle tint so Bowen can spot auto values at a glance.
  const CALC = 'tabular text-right px-2 py-2 text-[12.5px] text-paper-dim'

  return (
    <tr className="group border-b border-ink-2 hover:bg-ink-0/50">
      <td className={`${CELL} tabular text-center text-paper-mute text-[11px] w-10 px-0 py-2`}>
        {index + 1}
      </td>
      <td className={`${CELL} w-[104px]`}>
        <input className={INPUT} value={shot.rigGroup ?? ''} onChange={set('rigGroup')} placeholder="—" />
      </td>
      <td className={`${CELL} min-w-[200px]`}>
        <input className={INPUT} value={shot.description ?? ''} onChange={set('description')} placeholder="Description" />
      </td>
      <td className={`${CELL} w-[120px]`}>
        <input className={INPUT} value={shot.shotType ?? ''} onChange={set('shotType')} placeholder="Shot type" />
      </td>
      <td className={`${CELL} w-[140px]`}>
        <input className={INPUT} value={shot.location ?? ''} onChange={set('location')} placeholder="Location" />
      </td>
      <td className={`${CELL} w-[104px]`}>
        <input
          className={INPUT_NUM}
          value={shot.estTime ?? ''}
          onChange={set('estTime')}
          placeholder="0:01-0:05"
        />
      </td>
      <td className={`${CELL} w-[72px]`}>
        <div className={CALC}>
          {derived.shotDurSec != null ? `${derived.shotDurSec}s` : <span className="text-paper-mute">—</span>}
        </div>
      </td>
      <td className={`${CELL} w-[60px]`}>
        <input
          className={INPUT_NUM}
          type="number"
          min={1}
          value={shot.takes ?? ''}
          onChange={set('takes')}
          placeholder={String(assumptions.defaultTakes)}
        />
      </td>
      <td className={`${CELL} w-[68px]`}>
        <input
          className={INPUT_NUM}
          type="number"
          min={1}
          value={shot.fps ?? ''}
          onChange={set('fps')}
          placeholder={String(assumptions.fps)}
        />
      </td>
      <td className={`${CELL} w-[72px]`}>
        <div className={CALC}>
          {derived.filmSec != null ? `${derived.filmSec}s` : <span className="text-paper-mute">—</span>}
        </div>
      </td>
      <td className={`${CELL} w-[82px]`}>
        <div className={`${CALC} text-kodak`}>
          {derived.filmFt != null ? derived.filmFt.toFixed(2) : <span className="text-paper-mute">—</span>}
        </div>
      </td>
      <td className={`${CELL} w-[72px]`}>
        <input
          className={INPUT_NUM}
          type="number"
          min={0}
          value={shot.actualSec ?? ''}
          onChange={set('actualSec')}
          placeholder="—"
        />
      </td>
      <td className={`${CELL} w-[82px]`}>
        <div className={`${CALC} text-paper-dim`}>
          {derived.actualFt != null ? derived.actualFt.toFixed(2) : <span className="text-paper-mute">—</span>}
        </div>
      </td>
      <td className={`${CELL} w-[120px]`}>
        <input className={INPUT} value={shot.status ?? ''} onChange={set('status')} placeholder="planned" />
      </td>
      <td className={`${CELL} min-w-[160px]`}>
        <input className={INPUT} value={shot.notes ?? ''} onChange={set('notes')} placeholder="Notes" />
      </td>
      <td className="w-10 text-center no-print">
        <button
          onClick={() => removeShot(shot.id)}
          className="h-full w-full text-paper-mute hover:text-safety transition-colors text-[14px] opacity-0 group-hover:opacity-100"
          aria-label="Remove shot"
          title="Remove shot"
        >
          ×
        </button>
      </td>
    </tr>
  )
}
