import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { getExpensesByCategory } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { CATEGORY_COLORS } from '../../data/transactions'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{name}</p>
      <p className="text-slate-500 dark:text-slate-400 mt-1">{formatCurrency(value)}</p>
    </div>
  )
}

export default function ExpenseBreakdownChart() {
  const { state } = useApp()

  const data = useMemo(() => {
    return getExpensesByCategory(state.transactions)
      .filter((d) => d.amount > 0)
      .map((d) => ({ name: d.category, value: d.amount }))
  }, [state.transactions])

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Spending by Category
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">All time</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Donut chart */}
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={68}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? '#94a3b8'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-1 gap-1.5 w-full">
          {data.slice(0, 7).map(({ name, value }) => {
            const pct = ((value / total) * 100).toFixed(0)
            return (
              <div key={name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[name] ?? '#94a3b8' }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">
                  {name}
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
