import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function SummaryCard({ label, amount, change, icon: Icon, colorClass, prefix = '$' }) {
  const isPositive = change > 0
  const isNeutral  = change === 0

  const trendIcon = isNeutral
    ? <Minus size={13} />
    : isPositive
    ? <TrendingUp size={13} />
    : <TrendingDown size={13} />

  const trendColor = isNeutral
    ? 'text-slate-400'
    : isPositive
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400'

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {amount < 0 ? '-' : ''}{formattedAmount}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon size={18} />
        </div>
      </div>

      {change !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          {trendIcon}
          <span>{Math.abs(change).toFixed(1)}% vs last month</span>
        </div>
      )}
    </div>
  )
}
