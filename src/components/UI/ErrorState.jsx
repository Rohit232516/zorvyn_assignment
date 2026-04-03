import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mb-4">
        <AlertCircle size={22} className="text-rose-500" />
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Failed to load data
      </p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 btn-ghost text-xs gap-1.5 border border-slate-200 dark:border-slate-700"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  )
}
