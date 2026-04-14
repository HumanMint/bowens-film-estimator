import { createContext, useContext, useEffect, useReducer } from 'react'
import { DEFAULT_ASSUMPTIONS, DEFAULT_SHOT, INITIAL_SHOT_COUNT } from '../constants.js'

const STORAGE_KEY = 'film-estimator.v1'

let nextId = 1
const makeId = () => `s${nextId++}`

function seedShots() {
  return Array.from({ length: INITIAL_SHOT_COUNT }, () => ({
    id: makeId(),
    ...DEFAULT_SHOT,
  }))
}

const initialState = {
  assumptions: { ...DEFAULT_ASSUMPTIONS },
  shots: seedShots(),
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const next = action.payload
      // Bump the id counter past anything we're restoring
      for (const s of next.shots ?? []) {
        const n = Number(String(s.id ?? '').replace(/\D/g, ''))
        if (Number.isFinite(n) && n >= nextId) nextId = n + 1
      }
      return next
    }
    case 'UPDATE_ASSUMPTION': {
      const { key, value } = action.payload
      return {
        ...state,
        assumptions: { ...state.assumptions, [key]: value },
      }
    }
    case 'UPDATE_SHOT': {
      const { id, key, value } = action.payload
      return {
        ...state,
        shots: state.shots.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
      }
    }
    case 'ADD_SHOT': {
      return {
        ...state,
        shots: [...state.shots, { id: makeId(), ...DEFAULT_SHOT }],
      }
    }
    case 'REMOVE_SHOT': {
      return {
        ...state,
        shots: state.shots.filter((s) => s.id !== action.payload.id),
      }
    }
    case 'CLEAR_SHOTS': {
      return { ...state, shots: seedShots() }
    }
    case 'RESET': {
      return {
        assumptions: { ...DEFAULT_ASSUMPTIONS },
        shots: seedShots(),
      }
    }
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window === 'undefined') return init
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return init
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return init
      // Bump id counter
      for (const s of parsed.shots ?? []) {
        const n = Number(String(s.id ?? '').replace(/\D/g, ''))
        if (Number.isFinite(n) && n >= nextId) nextId = n + 1
      }
      return {
        assumptions: { ...DEFAULT_ASSUMPTIONS, ...(parsed.assumptions ?? {}) },
        shots: Array.isArray(parsed.shots) && parsed.shots.length ? parsed.shots : seedShots(),
      }
    } catch {
      return init
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* quota exceeded or private mode — ignore */
    }
  }, [state])

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

export function useAssumptions() {
  const { state, dispatch } = useStore()
  return {
    assumptions: state.assumptions,
    update: (key, value) => dispatch({ type: 'UPDATE_ASSUMPTION', payload: { key, value } }),
  }
}

export function useShots() {
  const { state, dispatch } = useStore()
  return {
    shots: state.shots,
    updateShot: (id, key, value) =>
      dispatch({ type: 'UPDATE_SHOT', payload: { id, key, value } }),
    addShot: () => dispatch({ type: 'ADD_SHOT' }),
    removeShot: (id) => dispatch({ type: 'REMOVE_SHOT', payload: { id } }),
    clearShots: () => dispatch({ type: 'CLEAR_SHOTS' }),
  }
}

export function useReset() {
  const { dispatch } = useStore()
  return () => dispatch({ type: 'RESET' })
}
