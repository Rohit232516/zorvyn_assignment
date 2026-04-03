import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function InsightCard({ icon: Icon, title, value, subtext, trend, accent = 'indigo' }) {
  const accentMap = {
    indigo:  'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    rose:    'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    amber:   'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  }

  const TrendIcon = trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown
  const trendColor = trend === 0
    ? 'text-slate-400'
    : trend > 0
    ? 'text-rose-600 dark:text-rose-400'   // higher spend = bad
    : 'text-emerald-600 dark:text-emerald-400'

  return (
    <div className="card p-5 flex gap-4 items-start animate-fade-in">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {title}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          {value}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
              <TrendIcon size={12} />
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {subtext && (
            <span className="text-xs text-slate-400">{subtext}</span>
          )}
        </div>
      </div>
    </div>
  )
}
