import { Search, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const FILTER_OPTIONS = [
  { value: 'all',     label: 'All' },
  { value: 'income',  label: 'Income' },
  { value: 'expense', label: 'Expenses' },
]

const SORT_OPTIONS = [
  { value: 'date-desc',   label: 'Date (newest)' },
  { value: 'date-asc',    label: 'Date (oldest)' },
  { value: 'amount-desc', label: 'Amount (high)' },
  { value: 'amount-asc',  label: 'Amount (low)'  },
]

export default function TransactionFilters() {
  const { state, dispatch } = useApp()
  const { filter, searchQuery, sortConfig } = state

  const sortValue = `${sortConfig.key}-${sortConfig.direction}`

  const handleSort = (e) => {
    const [key, direction] = e.target.value.split('-')
    dispatch({ type: 'SET_SORT', payload: { key, direction } })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search transactions…"
          value={searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          className="input pl-9"
        />
      </div>

      {/* Type filter pills */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: value })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              filter === value
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <select
          value={sortValue}
          onChange={handleSort}
          className="input pr-8 appearance-none cursor-pointer min-w-36"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  )
}
