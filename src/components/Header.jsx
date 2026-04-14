import { useAssumptions } from '../state/store.jsx'
import { Sprocket } from './ui/Sprocket.jsx'
import { ExportMenu } from './ExportMenu.jsx'
import { BOWEN_SHEET_URL } from '../constants.js'

export function Header() {
  const { assumptions } = useAssumptions()

  const subtitle = [
    assumptions.stock === '35mm' ? `35mm · ${assumptions.perf}` : '16mm',
    `${assumptions.magazineFt}ft mag`,
    `${assumptions.fps}fps`,
    `+${assumptions.bufferSec}s buffer/shot`,
    `${assumptions.defaultTakes} take${assumptions.defaultTakes === 1 ? '' : 's'}`,
  ].join('  ·  ')

  return (
    <header className="relative border-b border-ink-2 bg-ink-0">
      <div className="mx-auto max-w-[1440px] px-6 pt-6 pb-5 md:px-10 md:pt-9 md:pb-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <span className="label-tiny text-kodak">Dailies.</span>
              <span className="label-tiny text-paper-mute">/</span>
              <span className="label-tiny text-paper-mute">Film Estimator · v0.1 β</span>
            </div>
            <h1 className="mt-2 font-display text-[44px] md:text-[64px] leading-[0.95] tracking-tightest text-paper">
              <span className="italic text-paper-dim">a shoot for</span>{' '}
              <span className="text-paper">{assumptions.projectTitle || 'Untitled Project'}</span>
            </h1>
            <p className="mt-3 text-[12px] text-paper-mute tracking-wide max-w-xl">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 no-print">
            <ExportMenu />
            <a
              href={BOWEN_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-right group"
            >
              <p className="label-tiny text-paper-mute group-hover:text-kodak transition-colors">
                Based on the Google Sheet ↗
              </p>
              <p className="text-[11px] text-paper-dim mt-1 group-hover:text-paper transition-colors">
                Film Estimator BETA 1.0 — by Bowen Moreno
              </p>
            </a>
          </div>
        </div>

        <Sprocket count={42} className="mt-6" />
      </div>
    </header>
  )
}
