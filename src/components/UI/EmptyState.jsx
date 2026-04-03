import { SearchX } from 'lucide-react'

export default function EmptyState({ title = 'No results', message = 'Try adjusting your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <SearchX size={22} className="text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{message}</p>
    </div>
  )
}
