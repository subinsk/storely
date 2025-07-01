// Capitalize first letter
export const capitalize = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Convert to title case
export const titleCase = (str: string): string => {
  if (!str) return str
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

// Convert to camelCase
export const camelCase = (str: string): string => {
  if (!str) return str
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
}

// Convert to kebab-case
export const kebabCase = (str: string): string => {
  if (!str) return str
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

// Convert to snake_case
export const snakeCase = (str: string): string => {
  if (!str) return str
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

// Truncate string with ellipsis
export const truncate = (str: string, length: number = 100): string => {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Remove HTML tags
export const stripHtml = (str: string): string => {
  if (!str) return str
  return str.replace(/<[^>]*>/g, '')
}

// Generate slug from string
export const generateSlug = (str: string): string => {
  if (!str) return str
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

// Extract initials from name
export const getInitials = (name: string): string => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

// Check if string is email
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Check if string is URL
export const isUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return phone
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
  }
  
  return phone
}

// Generate random string
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Mask sensitive data
export const maskString = (str: string, visibleChars: number = 4): string => {
  if (!str || str.length <= visibleChars) return str
  const masked = '*'.repeat(str.length - visibleChars)
  return str.slice(0, visibleChars) + masked
}

// Count words
export const countWords = (str: string): number => {
  if (!str) return 0
  return str.trim().split(/\s+/).length
}

// Highlight search terms
export const highlightSearchTerms = (
  text: string,
  searchTerms: string,
  highlightClassName: string = 'highlight'
): string => {
  if (!text || !searchTerms) return text
  
  const regex = new RegExp(`(${searchTerms})`, 'gi')
  return text.replace(regex, `<mark class="${highlightClassName}">$1</mark>`)
}
