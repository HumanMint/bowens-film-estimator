import { useShots, useAssumptions } from '../state/store.jsx'
import { computeShotDerived } from '../lib/calc.js'

const IN =
  'tabular w-full bg-ink-0/60 border border-ink-2 text-paper text-[13px] px-2 py-[6px] focus:outline-none'
const LABEL = 'label-tiny text-paper-mute'

export function ShotCard({ shot, index }) {
  const { updateShot, removeShot } = useShots()
  const { assumptions } = useAssumptions()
  const derived = computeShotDerived(shot, assumptions)

  const set = (key) => (e) => {
    const el = e.target
    const raw = el.type === 'number' ? (el.value === '' ? null : el.valueAsNumber) : el.value
    updateShot(shot.id, key, raw)
  }

  return (
    <div className="border border-ink-2 bg-ink-1/80 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="tabular text-paper-mute text-[11px]">#{String(index + 1).padStart(2, '0')}</span>
          <input
            className="bg-transparent text-paper text-[14px] focus:outline-none placeholder:text-paper-mute/60 w-[160px]"
            value={shot.description ?? ''}
            onChange={set('description')}
            placeholder="Description"
          />
        </div>
        <button
          onClick={() => removeShot(shot.id)}
          className="text-paper-mute hover:text-safety text-[16px] leading-none no-print"
          aria-label="Remove shot"
        >
          ×
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className={LABEL}>Est Time</span>
          <input className={IN + ' mt-1'} value={shot.estTime ?? ''} onChange={set('estTime')} placeholder="0:01-0:05" />
        </label>
        <label className="block">
          <span className={LABEL}>Location</span>
          <input className={IN + ' mt-1'} value={shot.location ?? ''} onChange={set('location')} placeholder="—" />
        </label>
        <label className="block">
          <span className={LABEL}>Shot Type</span>
          <input className={IN + ' mt-1'} value={shot.shotType ?? ''} onChange={set('shotType')} placeholder="Steadicam" />
        </label>
        <label className="block">
          <span className={LABEL}>Rig Group</span>
          <input className={IN + ' mt-1'} value={shot.rigGroup ?? ''} onChange={set('rigGroup')} placeholder="—" />
        </label>
        <label className="block">
          <span className={LABEL}>Takes</span>
          <input
            className={IN + ' mt-1 text-right'}
            type="number"
            min={1}
            value={shot.takes ?? ''}
            onChange={set('takes')}
            placeholder={String(assumptions.defaultTakes)}
          />
        </label>
        <label className="block">
          <span className={LABEL}>FPS override</span>
          <input
            className={IN + ' mt-1 text-right'}
            type="number"
            min={1}
            value={shot.fps ?? ''}
            onChange={set('fps')}
            placeholder={String(assumptions.fps)}
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-3 border-t border-ink-2 pt-3 text-center">
        <div>
          <p className="label-tiny text-paper-mute">Dur</p>
          <p className="tabular text-[14px] text-paper mt-1">
            {derived.shotDurSec != null ? `${derived.shotDurSec}s` : '—'}
          </p>
        </div>
        <div className="border-x border-ink-2">
          <p className="label-tiny text-paper-mute">Film · s</p>
          <p className="tabular text-[14px] text-paper mt-1">
            {derived.filmSec != null ? `${derived.filmSec}s` : '—'}
          </p>
        </div>
        <div>
          <p className="label-tiny text-paper-mute">Film · ft</p>
          <p className="tabular text-[14px] text-kodak mt-1">
            {derived.filmFt != null ? derived.filmFt.toFixed(2) : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
