import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { groupByMonth } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'

const MONTH_LABELS = {
  '2026-01': 'Jan',
  '2026-02': 'Feb',
  '2026-03': 'Mar',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function BalanceTrendChart() {
  const { state } = useApp()

  const data = useMemo(() => {
    const monthly = groupByMonth(state.transactions)
    return monthly.map((m) => ({
      month: MONTH_LABELS[m.month] ?? m.month,
      Income: m.income,
      Expenses: m.expenses,
    }))
  }, [state.transactions])

  return (
    <div className="card p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Monthly Cash Flow
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Income vs expenses over time</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 0, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '16px', color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="Income"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
