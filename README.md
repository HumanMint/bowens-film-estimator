# Film Estimator

A web tool port of **Bowen Moreno's Film Estimator BETA 1.0** spreadsheet. Estimates how much film stock a cinematography shoot will consume, given stock / perf / magazine / fps and a shot-by-shot schedule.

An original idea and math by Bowen Moreno — this is a standalone web version, built with his permission.

> 🎬 **Try it live →** [humanmint.github.io/bowens-film-estimator](https://humanmint.github.io/bowens-film-estimator/)
>
> Works on desktop and mobile · no sign-in · no backend · your data stays in your browser

## Status — Phase 1

This is a **1:1 port** of Bowen's math. The layout is reimagined for desktop + mobile, but every formula (including the quirky hidden constants and the total-row FPS shortcut) is preserved exactly. Phase 2 will reimagine features — see [`PHASE2.md`](./PHASE2.md).

## Stack

- Vite + React 18
- Tailwind CSS 3
- No backend — pure client-side, localStorage for persistence

## Design

Working name **"Dailies."** — film-can label + contact-sheet aesthetic. `Instrument Serif` display + `JetBrains Mono` body, Kodak amber `#ffb700` accent, grain overlay, gaffer-tape section labels.

## Dev

```bash
cd film-estimator
npm install
npm run dev      # http://localhost:5173
npm test         # node:test runner, calc module only
npm run build
```

## Math correctness

The `src/lib/calc.js` module mirrors every formula from the xlsx. Tests in `src/lib/calc.test.js` assert against hand-computed values from the spreadsheet:

```bash
npm test
```

Spot-checks:
- `35mm 2-perf / 400ft / 24fps` → roll 533s · budget 1066s ✓
- `35mm 4-perf / 400ft / 24fps` → roll 266s ✓
- `16mm / 400ft / 24fps` → roll 666s ✓
- `"0:01-0:05"` at 35mm 2-perf 24fps with 3s buffer → 7s shot dur, 5.25 ft ✓

## Files

```
src/
├── lib/calc.js            # pure formulas, mirrors the xlsx
├── lib/timeRange.js       # parses "0:01-0:05" / "5-10" / "1:30-2:00"
├── lib/export.js          # CSV builder + print handler
├── state/store.jsx        # React context + reducer + localStorage
├── components/
│   ├── Header.jsx
│   ├── Assumptions.jsx    # 4-section panel with live-calc block
│   ├── Schedule.jsx       # desktop table + mobile card list
│   ├── ShotRow.jsx
│   ├── ShotCard.jsx
│   ├── TotalsBar.jsx      # sticky bottom on mobile
│   ├── ExportMenu.jsx
│   └── ui/                # Section, Sprocket, Field primitives
└── constants.js           # BASE_FT_SEC lookup + defaults
```

## Credit

Math + original tool by **Bowen Moreno** — go say hi:

- 🎞️ Original spreadsheet: [Film Estimator BETA 1.0 (Google Sheet)](https://docs.google.com/spreadsheets/d/1Vsca3YlbtujCdsI6l5SyD8Cg0LLcW8Lj/htmlview#gid=806328926)
- 📷 Instagram: [@bowen_m](https://www.instagram.com/bowen_m/)

Every formula in `src/lib/calc.js` mirrors a cell in Bowen's sheet — if the math is right, the credit is his.

Web port: **Ha Joon Park**.
