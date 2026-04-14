import { useMemo } from 'react'
import { Section } from './ui/Section.jsx'
import { Field, Select } from './ui/Field.jsx'
import { useAssumptions } from '../state/store.jsx'
import {
  getBaseFtSec,
  computeFtSecAtFps,
  computeRollDurationSec,
  computeBudgetSec,
} from '../lib/calc.js'
import { formatDurationMins } from '../lib/timeRange.js'
import { STOCK_OPTIONS, PERF_OPTIONS } from '../constants.js'

export function Assumptions() {
  const { assumptions, update } = useAssumptions()

  const calc = useMemo(() => {
    const baseFtSec = getBaseFtSec(assumptions.stock, assumptions.perf)
    const ftSecAtFps = computeFtSecAtFps(baseFtSec, assumptions.fps)
    const rollSec = computeRollDurationSec(assumptions.magazineFt, ftSecAtFps)
    const budgetSec = computeBudgetSec(assumptions.budgetFt, ftSecAtFps)
    return { baseFtSec, ftSecAtFps, rollSec, budgetSec }
  }, [assumptions])

  const is35 = assumptions.stock === '35mm'

  return (
    <div className="space-y-10">
      <Section label="01 · Project">
        <div className="grid grid-cols-1 gap-4">
          <Field
            label="Project Title"
            value={assumptions.projectTitle}
            onChange={(v) => update('projectTitle', v)}
            placeholder="Untitled Project"
          />
          <Field
            label="Director"
            value={assumptions.director}
            onChange={(v) => update('director', v)}
          />
          <Field
            label="Director of Photography"
            value={assumptions.dp}
            onChange={(v) => update('dp', v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Shoot Date"
              value={assumptions.shootDate}
              onChange={(v) => update('shootDate', v)}
              placeholder="e.g. Apr 20, 2026"
            />
            <Field
              label="Production Co."
              value={assumptions.productionCo}
              onChange={(v) => update('productionCo', v)}
            />
          </div>
        </div>
      </Section>

      <Section label="02 · Film Format">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stock">
            <Select
              value={assumptions.stock}
              onChange={(v) => update('stock', v)}
              options={STOCK_OPTIONS}
            />
          </Field>
          <Field label={is35 ? 'Perf Count' : 'Perf · (35mm only)'}>
            <Select
              value={assumptions.perf}
              onChange={(v) => update('perf', v)}
              options={PERF_OPTIONS}
            />
          </Field>
          <Field
            label="Magazine Size (ft)"
            type="number"
            value={assumptions.magazineFt}
            onChange={(v) => update('magazineFt', v)}
            min={1}
            step={1}
            helper="Your roll size — 100, 400, 1000…"
          />
          <Field
            label="Frame Rate (fps)"
            type="number"
            value={assumptions.fps}
            onChange={(v) => update('fps', v)}
            min={1}
            step={1}
            helper="24, 48, 60…"
          />
        </div>

        <div className="mt-6 border-t border-ink-2 pt-5">
          <p className="label-tiny text-grass mb-3">Calculated · live</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              kind="calc"
              label="Base ft/sec @ 24fps"
              value={calc.baseFtSec.toFixed(6)}
            />
            <Field
              kind="calc"
              label={`ft/sec @ ${assumptions.fps || '—'}fps`}
              value={calc.ftSecAtFps.toFixed(6)}
            />
            <Field
              kind="calc"
              label="Roll Duration"
              value={`${calc.rollSec}s  ·  ${formatDurationMins(calc.rollSec)}`}
            />
            <Field
              kind="calc"
              label="Budget Duration"
              value={`${calc.budgetSec}s  ·  ${formatDurationMins(calc.budgetSec)}`}
            />
          </div>
        </div>
      </Section>

      <Section label="03 · Shot Defaults">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Roll Buffer (s / shot)"
            type="number"
            value={assumptions.bufferSec}
            onChange={(v) => update('bufferSec', v)}
            min={0}
            step={0.5}
            helper="Extra seconds per shot for pre-roll / post-cut"
          />
          <Field
            label="Default Takes"
            type="number"
            value={assumptions.defaultTakes}
            onChange={(v) => update('defaultTakes', v)}
            min={1}
            step={1}
            helper="Per-shot override available on each row"
          />
        </div>
      </Section>

      <Section label="04 · Film Budget">
        <Field
          label="Film Budget (ft)"
          type="number"
          value={assumptions.budgetFt}
          onChange={(v) => update('budgetFt', v)}
          min={0}
          step={1}
          helper="How many feet you have budgeted — drives the BUDGET row on the schedule"
        />
      </Section>
    </div>
  )
}
