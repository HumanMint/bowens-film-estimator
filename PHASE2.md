# Phase 2 — Future Features

Phase 1 is a faithful 1:1 port of Bowen Moreno's "Film Estimator BETA 1.0" spreadsheet. This file tracks the ideas we're deliberately NOT shipping yet, so we can prove the math to Bowen first and then expand.

## Known math quirks to flag + fix

### Total-ft formula uses default FPS, not per-row overrides
The schedule total-ft row in the xlsx is:
```
K24 = ROUND(SUM(filmSec) × (magazine / rollDurationSec), 2)
```
Algebraically this uses the DEFAULT fps (rollDurationSec is derived from the default fps), so per-row FPS overrides are NOT reflected in the total.

**Fix:** replace with `SUM(computeFilmFt(filmSec_i, base, fps_i))`. Preserved in phase 1 to match Bowen's spreadsheet byte-for-byte — see `computeTotalFilmFtLegacy` in `src/lib/calc.js`.

### Slightly-off hidden constants
The spreadsheet's base-ft/sec constants are `0.6006006006006006`, `1.503759398496241`, `1.126760563380282`, `0.7504690431519699` — slightly off from the canonical `0.6 / 1.5 / 1.125 / 0.75`. Unclear if intentional. Flag to Bowen. If he confirms they're unintentional rounding artifacts, switch to canonical values in phase 2.

## Feature ideas (rough prioritization)

### Shoot-planning improvements
- **Slate / burn-off footage buffer.** Every roll threads and burns a few feet at the head + tail. Add a per-roll buffer assumption.
- **Multi-day schedules.** Split shots across shoot days, per-day totals.
- **Shot categories / rig groups.** Auto-sum per rig group (Steadicam total, Handheld total, etc.) so DPs know which rigs burn the most stock.
- **Template library.** Common setups — "music video 16mm, 2× 400ft mags", "commercial 35mm 3-perf 400ft × 6", "short film 16mm 100ft daylight rolls".
- **Compare scenarios.** Side-by-side: "what if we shoot this 35mm 3-perf instead of 4-perf?" Live diff of total ft and over/under budget.
- **Actual-vs-estimate deltas.** Real-time variance tracking during a shoot day. Already have the `actualSec` column — surface a "slippage" metric.

### UX polish
- **Drag-reorder shots.** dnd-kit or similar.
- **Bulk operations.** Multi-select rows, apply rig group / location / status in batch.
- **Undo / redo.** Walk backward through reducer history.
- **Keyboard shortcuts.** `j/k` to move between rows, `tab` to next cell.
- **Column show/hide.** Hide Actual columns for pre-production, show them for dailies review.
- **Import/export sharing.** Copy state as JSON blob, paste to restore — or compressed URL param.
- **Read-only shareable links.** "Send this to the producer."

### Export improvements
- **Real PDF generation** via jsPDF with a proper call-sheet-style layout, sprocket-hole watermark, and film-can metadata block. Current `window.print()` stylesheet is a placeholder.
- **Call sheet format.** PDF layout that matches how ADs/1st ACs actually use schedules.
- **ICS calendar export.** Drop the shoot into calendar apps with times.

### Data / persistence
- **Supabase / Firebase backend** (if collaboration is desired) — very optional.
- **Versioned localStorage migrations.** The store already keys under `film-estimator.v1`; bump + migrate on schema changes.

## Confirmed deliberate omissions in phase 1

- No backend. Everything client-side, localStorage only.
- No account system.
- No analytics.
- No dark/light toggle — this tool is dark by design.
- No multi-project switcher (one project per browser, localStorage-keyed).
- No unit tests for components (calc module is the correctness-critical layer; UI is stateless enough to verify by hand).
