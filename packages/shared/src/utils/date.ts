import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

// Format date to string
export const formatDate = (
  date: Date | string | number,
  pattern: string = 'PPP'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  
  if (!isValid(dateObj)) {
    return 'Invalid date'
  }
  
  return format(dateObj, pattern)
}

// Format datetime
export const formatDateTime = (
  date: Date | string | number,
  pattern: string = 'PPpp'
): string => {
  return formatDate(date, pattern)
}

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (
  date: Date | string | number
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  
  if (!isValid(dateObj)) {
    return 'Invalid date'
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Check if date is today
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const today = new Date()
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

// Check if date is yesterday
export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  )
}

// Get start of day
export const getStartOfDay = (date: Date | string | number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const startOfDay = new Date(dateObj)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay
}

// Get end of day
export const getEndOfDay = (date: Date | string | number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const endOfDay = new Date(dateObj)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay
}

// Add days to date
export const addDays = (date: Date | string | number, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const result = new Date(dateObj)
  result.setDate(result.getDate() + days)
  return result
}

// Subtract days from date
export const subtractDays = (date: Date | string | number, days: number): Date => {
  return addDays(date, -days)
}
