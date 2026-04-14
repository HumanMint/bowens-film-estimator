import { useStore } from '../state/store.jsx'
import { downloadCsv, printSchedule } from '../lib/export.js'

export function ExportMenu() {
  const { state } = useStore()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => downloadCsv(state)}
        className="group inline-flex items-center gap-2 border border-ink-2 bg-ink-1 px-3 py-2 text-[11px] tracking-[0.12em] uppercase text-paper hover:border-kodak hover:text-kodak transition-colors"
      >
        <span className="block h-1.5 w-1.5 bg-kodak group-hover:bg-tape" />
        Export CSV
      </button>
      <button
        onClick={printSchedule}
        className="group inline-flex items-center gap-2 border border-ink-2 bg-ink-1 px-3 py-2 text-[11px] tracking-[0.12em] uppercase text-paper hover:border-kodak hover:text-kodak transition-colors"
      >
        <span className="block h-1.5 w-1.5 bg-paper-dim group-hover:bg-tape" />
        Print / PDF
      </button>
    </div>
  )
}
