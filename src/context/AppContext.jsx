import { createContext, useContext, useReducer, useEffect } from 'react'
import { mockTransactions } from '../data/transactions'

const AppContext = createContext(null)

const STORAGE_KEY = 'zorvyn_state'

const initialState = {
  transactions: mockTransactions,
  role: 'admin',            // 'admin' | 'viewer'
  filter: 'all',            // 'all' | 'income' | 'expense'
  searchQuery: '',
  sortConfig: { key: 'date', direction: 'desc' },
  darkMode: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          { ...action.payload, id: Date.now() },
          ...state.transactions,
        ],
      }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((tx) =>
          tx.id === action.payload.id ? { ...tx, ...action.payload } : tx
        ),
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== action.payload),
      }

    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'SET_FILTER':
      return { ...state, filter: action.payload }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }

    case 'SET_SORT':
      return { ...state, sortConfig: action.payload }

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }

    case 'LOAD_STATE':
      return { ...state, ...action.payload }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...init, ...parsed }
      }
    } catch {
      // ignore parse errors
    }
    return init
  })

  // Persist state to localStorage (skip heavy transaction array writes on every keystroke)
  useEffect(() => {
    const { searchQuery, ...persistable } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
  }, [state])

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
  }, [state.darkMode])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
