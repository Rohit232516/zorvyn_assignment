import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  getExpensesByCategory,
  getMonthTransactions,
  getTotals,
  getPercentChange,
} from '../utils/calculations'

// Derives actionable insights from transaction data
export function useInsights() {
  const { state } = useApp()
  const { transactions } = state

  return useMemo(() => {
    const thisMonth = '2026-03'
    const lastMonth = '2026-02'

    const thisMonthTx = getMonthTransactions(transactions, thisMonth)
    const lastMonthTx = getMonthTransactions(transactions, lastMonth)

    const thisMonthTotals = getTotals(thisMonthTx)
    const lastMonthTotals = getTotals(lastMonthTx)

    const expenseChange = getPercentChange(
      thisMonthTotals.expenses,
      lastMonthTotals.expenses
    )
    const incomeChange = getPercentChange(
      thisMonthTotals.income,
      lastMonthTotals.income
    )

    // Highest spending category this month
    const categoryBreakdown = getExpensesByCategory(transactions, thisMonth)
    const topCategory = categoryBreakdown[0] ?? null

    // Find the category with the biggest month-over-month spike
    const lastMonthCategories = getExpensesByCategory(transactions, lastMonth)
    const lastMonthCatMap = Object.fromEntries(
      lastMonthCategories.map((c) => [c.category, c.amount])
    )

    let biggestSpike = null
    let biggestSpikePercent = 0
    categoryBreakdown.forEach(({ category, amount }) => {
      const prev = lastMonthCatMap[category] || 0
      if (prev > 0) {
        const change = getPercentChange(amount, prev)
        if (change > biggestSpikePercent) {
          biggestSpikePercent = change
          biggestSpike = { category, amount, prev, change }
        }
      }
    })

    // Savings rate this month
    const savingsRate =
      thisMonthTotals.income > 0
        ? ((thisMonthTotals.income - thisMonthTotals.expenses) /
            thisMonthTotals.income) *
          100
        : 0

    // Daily avg spend this month
    const daysInMonth = 31 // March
    const dailyAvg = thisMonthTotals.expenses / daysInMonth

    return {
      thisMonth,
      lastMonth,
      thisMonthTotals,
      lastMonthTotals,
      expenseChange,
      incomeChange,
      topCategory,
      biggestSpike,
      savingsRate,
      dailyAvg,
      categoryBreakdown,
    }
  }, [transactions])
}
