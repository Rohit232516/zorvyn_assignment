import { Menu, Moon, Sun, Shield, Eye } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Header({ onMenuClick, title }) {
  const { state, dispatch } = useApp()
  const { role, darkMode } = state

  const toggleDark = () => dispatch({ type: 'TOGGLE_DARK_MODE' })
  const setRole = (r) => dispatch({ type: 'SET_ROLE', payload: r })

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
      </div>

      {/* Right: role switch + dark mode */}
      <div className="flex items-center gap-2">
        {/* Role toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setRole('viewer')}
            title="Viewer — read-only"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              role === 'viewer'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Viewer</span>
          </button>
          <button
            onClick={() => setRole('admin')}
            title="Admin — full access"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              role === 'admin'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Shield size={13} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
