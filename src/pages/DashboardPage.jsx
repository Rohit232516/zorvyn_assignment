import { useMemo } from 'react'
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  getTotals,
  getMonthTransactions,
  getPercentChange,
} from '../utils/calculations'
import { formatCurrency } from '../utils/formatters'
import SummaryCard from '../components/Dashboard/SummaryCard'
import BalanceTrendChart from '../components/Dashboard/BalanceTrendChart'
import ExpenseBreakdownChart from '../components/Dashboard/ExpenseBreakdownChart'

const THIS_MONTH = '2026-03'
const LAST_MONTH = '2026-02'

export default function DashboardPage() {
  const { state } = useApp()
  const { transactions } = state

  const summary = useMemo(() => {
    const all   = getTotals(transactions)
    const curr  = getTotals(getMonthTransactions(transactions, THIS_MONTH))
    const prev  = getTotals(getMonthTransactions(transactions, LAST_MONTH))

    return {
      balance:       all.income - all.expenses,
      totalIncome:   all.income,
      totalExpenses: all.expenses,
      incomeChange:  getPercentChange(curr.income,   prev.income),
      expenseChange: getPercentChange(curr.expenses, prev.expenses),
      balanceChange: getPercentChange(
        curr.income - curr.expenses,
        prev.income - prev.expenses
      ),
    }
  }, [transactions])

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Net Balance"
          amount={summary.balance}
          change={summary.balanceChange}
          icon={Wallet}
          colorClass="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
        />
        <SummaryCard
          label="Total Income"
          amount={summary.totalIncome}
          change={summary.incomeChange}
          icon={ArrowUpCircle}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <SummaryCard
          label="Total Expenses"
          amount={summary.totalExpenses}
          change={summary.expenseChange}
          icon={ArrowDownCircle}
          colorClass="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <ExpenseBreakdownChart />
        </div>
      </div>

      {/* Recent activity */}
      <RecentTransactions transactions={transactions} />
    </div>
  )
}

function RecentTransactions({ transactions }) {
  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [transactions]
  )

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Recent Transactions
        </h2>
        <a
          href="/transactions"
          className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          View all →
        </a>
      </div>
      <div className="space-y-1">
        {recent.map((tx) => {
          const isIncome = tx.type === 'income'
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-2.5 px-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold ${
                  isIncome
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}
              >
                {tx.category[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {tx.description}
                </p>
                <p className="text-xs text-slate-400">{tx.date}</p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
