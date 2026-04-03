import { Search, ChevronDown, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../data/transactions'

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

const ALL_CATEGORIES = ['all', ...Object.values(CATEGORIES)]

export default function TransactionFilters() {
  const { state, dispatch } = useApp()
  const { filter, searchQuery, categoryFilter, dateRange, sortConfig } = state

  const sortValue = `${sortConfig.key}-${sortConfig.direction}`

  const handleSort = (e) => {
    const [key, direction] = e.target.value.split('-')
    dispatch({ type: 'SET_SORT', payload: { key, direction } })
  }

  // True if any advanced filter is set — used to show the clear button
  const hasAdvancedFilters =
    categoryFilter !== 'all' || dateRange.start !== '' || dateRange.end !== ''

  const clearAdvanced = () => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: 'all' })
    dispatch({ type: 'SET_DATE_RANGE', payload: { start: '', end: '' } })
  }

  return (
    <div className="space-y-2.5">
      {/* Row 1: search + type + sort (unchanged) */}
      <div className="flex flex-col sm:flex-row gap-3">
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

      {/* Row 2: category + date range + clear */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Category */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) =>
              dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })
            }
            className="input pr-8 appearance-none cursor-pointer min-w-36"
          >
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 flex-1">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              dispatch({ type: 'SET_DATE_RANGE', payload: { start: e.target.value } })
            }
            className="input cursor-pointer flex-1 min-w-0"
            title="From date"
          />
          <span className="text-xs text-slate-400 shrink-0">to</span>
          <input
            type="date"
            value={dateRange.end}
            min={dateRange.start || undefined}
            onChange={(e) =>
              dispatch({ type: 'SET_DATE_RANGE', payload: { end: e.target.value } })
            }
            className="input cursor-pointer flex-1 min-w-0"
            title="To date"
          />
        </div>

        {/* Clear advanced filters — only visible when something is set */}
        {hasAdvancedFilters && (
          <button
            onClick={clearAdvanced}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap"
          >
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
