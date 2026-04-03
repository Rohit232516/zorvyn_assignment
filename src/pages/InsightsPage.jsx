import {
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Zap,
  Calendar,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useInsights } from '../hooks/useInsights'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { CATEGORY_COLORS } from '../data/transactions'
import InsightCard from '../components/Insights/InsightCard'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p className="text-slate-500">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function InsightsPage() {
  const {
    thisMonthTotals,
    lastMonthTotals,
    expenseChange,
    incomeChange,
    topCategory,
    biggestSpike,
    savingsRate,
    dailyAvg,
    categoryBreakdown,
  } = useInsights()

  const chartData = categoryBreakdown.slice(0, 8).map((d) => ({
    name: d.category,
    amount: d.amount,
  }))

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Intro */}
      <div className="card p-5 bg-gradient-to-br from-brand-600 to-indigo-700 border-0">
        <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide">March 2026</p>
        <h2 className="text-xl font-bold text-white mt-1">
          You spent {formatCurrency(thisMonthTotals.expenses)} this month
        </h2>
        <p className="text-sm text-indigo-200 mt-1">
          {expenseChange > 0
            ? `That's ${Math.abs(expenseChange).toFixed(1)}% more than February.`
            : expenseChange < 0
            ? `That's ${Math.abs(expenseChange).toFixed(1)}% less than February — nice work.`
            : `Same as last month.`}
        </p>
      </div>

      {/* Insight cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InsightCard
          icon={ShoppingBag}
          title="Top Spending Category"
          value={topCategory ? topCategory.category : '—'}
          subtext={topCategory ? `${formatCurrency(topCategory.amount)} this month` : ''}
          accent="indigo"
        />

        <InsightCard
          icon={expenseChange >= 0 ? TrendingUp : TrendingDown}
          title="Month-over-Month Expenses"
          value={formatPercent(expenseChange)}
          subtext="vs February 2026"
          trend={expenseChange}
          accent={expenseChange > 0 ? 'rose' : 'emerald'}
        />

        <InsightCard
          icon={PiggyBank}
          title="Savings Rate"
          value={`${savingsRate.toFixed(0)}%`}
          subtext="of income saved this month"
          trend={undefined}
          accent="emerald"
        />

        <InsightCard
          icon={Calendar}
          title="Average Daily Spend"
          value={formatCurrency(dailyAvg)}
          subtext="per day in March"
          accent="amber"
        />
      </div>

      {/* Spike alert */}
      {biggestSpike && (
        <div className="card p-5 border-l-4 border-amber-400">
          <div className="flex items-start gap-3">
            <Zap size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Spending spike: {biggestSpike.category}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You spent {formatCurrency(biggestSpike.amount)} on {biggestSpike.category} this month —{' '}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {biggestSpike.change.toFixed(0)}% more
                </span>{' '}
                than the {formatCurrency(biggestSpike.prev)} you spent in February.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly comparison table */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Feb vs Mar Comparison
        </h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div />
          <div className="text-xs font-medium text-slate-400 text-right uppercase tracking-wide">Feb</div>
          <div className="text-xs font-medium text-slate-400 text-right uppercase tracking-wide">Mar</div>

          {[
            { label: 'Income',   curr: thisMonthTotals.income,   prev: lastMonthTotals.income,   isGreen: true  },
            { label: 'Expenses', curr: thisMonthTotals.expenses, prev: lastMonthTotals.expenses, isGreen: false },
            {
              label: 'Net',
              curr: thisMonthTotals.income - thisMonthTotals.expenses,
              prev: lastMonthTotals.income - lastMonthTotals.expenses,
              isGreen: true,
            },
          ].map(({ label, curr, prev, isGreen }) => {
            const improved = isGreen ? curr >= prev : curr <= prev
            return (
              <>
                <div key={`l-${label}`} className="text-xs text-slate-500 dark:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-700 flex items-center">
                  {label}
                </div>
                <div key={`p-${label}`} className="text-xs text-right py-2 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-end font-medium">
                  {formatCurrency(prev)}
                </div>
                <div
                  key={`c-${label}`}
                  className={`text-xs text-right py-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end font-semibold ${
                    improved
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatCurrency(curr)}
                </div>
              </>
            )
          })}
        </div>
      </div>

      {/* Category bar chart */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Expenses by Category (All Time)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 60, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" strokeOpacity={0.6} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] ?? '#6366f1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
