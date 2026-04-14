// Link to Bowen Moreno's original "Film Estimator BETA 1.0" Google Sheet —
// referenced throughout the UI so credit is always one click away.
export const BOWEN_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1Vsca3YlbtujCdsI6l5SyD8Cg0LLcW8Lj/htmlview#gid=806328926'

// Hidden lookup table from Bowen's spreadsheet (Assumptions!C16:C19).
// Values are preserved EXACTLY — they're slightly off from canonical
// 0.6 / 1.5 / 1.125 / 0.75 but we don't "correct" them without Bowen's sign-off.
export const BASE_FT_SEC = {
  '16mm': 0.6006006006006006,
  '35mm-4perf': 1.503759398496241,
  '35mm-3perf': 1.126760563380282,
  '35mm-2perf': 0.7504690431519699,
}

export const STOCK_OPTIONS = [
  { value: '16mm', label: '16mm' },
  { value: '35mm', label: '35mm' },
]

export const PERF_OPTIONS = [
  { value: '2-perf', label: '2-perf' },
  { value: '3-perf', label: '3-perf' },
  { value: '4-perf', label: '4-perf' },
]

export const DEFAULT_ASSUMPTIONS = {
  projectTitle: 'Untitled Project',
  director: '',
  dp: '',
  shootDate: '',
  productionCo: '',
  stock: '16mm',
  perf: '2-perf',
  magazineFt: 400,
  fps: 24,
  bufferSec: 3,
  defaultTakes: 1,
  budgetFt: 800,
}

export const DEFAULT_SHOT = {
  rigGroup: '',
  description: '',
  shotType: '',
  location: '',
  estTime: '',
  takes: null, // null → inherit from assumptions.defaultTakes
  fps: null, // null → inherit from assumptions.fps
  actualSec: null,
  status: 'planned',
  notes: '',
}

export const INITIAL_SHOT_COUNT = 20
