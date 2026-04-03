export const formatCurrency = (amount, compact = false) => {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateStr, format = 'medium') => {
  const date = new Date(dateStr + 'T00:00:00')
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  if (format === 'month') {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatPercent = (value, decimals = 1) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export const getMonthName = (dateStr) => {
  const date = new Date(dateStr + '-01T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'long' })
}
