import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useFilteredTransactions() {
  const { state } = useApp()
  const { transactions, filter, searchQuery, sortConfig } = state

  return useMemo(() => {
    let result = [...transactions]

    // Type filter
    if (filter !== 'all') {
      result = result.filter((tx) => tx.type === filter)
    }

    // Search: match description, category, or amount
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          String(tx.amount).includes(q)
      )
    }

    // Sorting
    const { key, direction } = sortConfig
    result.sort((a, b) => {
      let valA = a[key]
      let valB = b[key]

      if (key === 'date') {
        valA = new Date(valA)
        valB = new Date(valB)
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1
      if (valA > valB) return direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [transactions, filter, searchQuery, sortConfig])
}
