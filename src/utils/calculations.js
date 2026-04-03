// Pure calculation helpers — no side effects

export const getTotals = (transactions) => {
  return transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') {
        acc.income += tx.amount
      } else {
        acc.expenses += tx.amount
      }
      return acc
    },
    { income: 0, expenses: 0, balance: 0 }
  )
}

export const getBalance = (transactions) => {
  const { income, expenses } = getTotals(transactions)
  return income - expenses
}

// Group transactions by calendar month, return array sorted ascending
export const groupByMonth = (transactions) => {
  const map = {}
  transactions.forEach((tx) => {
    const month = tx.date.slice(0, 7) // "2026-01"
    if (!map[month]) map[month] = { income: 0, expenses: 0 }
    if (tx.type === 'income') map[month].income += tx.amount
    else map[month].expenses += tx.amount
  })

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      ...data,
      balance: data.income - data.expenses,
    }))
}

// Sum expenses by category for a given month or all months
export const getExpensesByCategory = (transactions, month = null) => {
  const filtered = month
    ? transactions.filter((tx) => tx.type === 'expense' && tx.date.startsWith(month))
    : transactions.filter((tx) => tx.type === 'expense')

  const map = {}
  filtered.forEach((tx) => {
    map[tx.category] = (map[tx.category] || 0) + tx.amount
  })

  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }))
}

export const getMonthTransactions = (transactions, monthStr) =>
  transactions.filter((tx) => tx.date.startsWith(monthStr))

export const getPercentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const getRunningBalance = (transactions) => {
  const monthly = groupByMonth(transactions)
  let running = 0
  return monthly.map((m) => {
    running += m.balance
    return { ...m, runningBalance: running }
  })
}
