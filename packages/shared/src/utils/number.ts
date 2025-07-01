// Format currency values
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format numbers
export const formatNumber = (
  number: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(number)
}

// Format percentage
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

// Calculate percentage change
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

// Clamp number between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

// Generate random number between min and max
export const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

// Round to specific decimal places
export const roundTo = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
