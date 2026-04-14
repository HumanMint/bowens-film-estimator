import { useState } from 'react'
import { Header } from './components/Header.jsx'
import { Assumptions } from './components/Assumptions.jsx'
import { Schedule } from './components/Schedule.jsx'
import { TotalsBar } from './components/TotalsBar.jsx'
import { BOWEN_SHEET_URL } from './constants.js'

export default function App() {
  const [assumptionsOpen, setAssumptionsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 md:px-10 pt-10 pb-24 md:pb-16">
        <div className="md:grid md:grid-cols-[minmax(320px,380px)_1fr] md:gap-10 lg:gap-12">
          {/* Desktop / tablet: sticky Assumptions column */}
          <aside className="hidden md:block">
            <div className="sticky top-6">
              <Assumptions />
            </div>
          </aside>

          {/* Mobile: collapsible Assumptions drawer */}
          <div className="md:hidden mb-8">
            <button
              onClick={() => setAssumptionsOpen((v) => !v)}
              className="w-full flex items-center justify-between border border-ink-2 bg-ink-1 px-4 py-3"
            >
              <span className="label-tiny text-kodak">
                {assumptionsOpen ? 'Hide Assumptions' : 'Edit Assumptions'}
              </span>
              <span className="text-paper-mute text-[11px]">{assumptionsOpen ? '▲' : '▼'}</span>
            </button>
            {assumptionsOpen && (
              <div className="mt-6">
                <Assumptions />
              </div>
            )}
          </div>

          <section className="min-w-0">
            <Schedule />
          </section>
        </div>
      </main>

      <TotalsBar />

      <footer className="border-t border-ink-2 py-6 px-6 md:px-10 no-print">
        <div className="mx-auto max-w-[1440px] flex flex-wrap items-center justify-between gap-3">
          <p className="label-tiny text-paper-mute">
            Dailies. · Film Estimator · phase 1 · 1:1 port of{' '}
            <a
              href={BOWEN_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper-dim hover:text-kodak transition-colors underline decoration-dotted underline-offset-[3px]"
            >
              Bowen Moreno's BETA 1.0 ↗
            </a>
          </p>
          <p className="text-[10px] text-paper-mute italic">
            Math preserved exactly, including the total-ft quirk. See PHASE2.md for fixes.
          </p>
        </div>
      </footer>
    </div>
  )
}
