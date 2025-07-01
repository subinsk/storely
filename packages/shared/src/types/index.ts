import React from 'react'

// Export specific type modules
export * from './category'

// Common application types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface FilterParams extends SearchParams {
  [key: string]: any
}

// Navigation types
export interface NavItem {
  title: string
  path: string
  icon?: string
  children?: NavItem[]
  disabled?: boolean
  external?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ label: string; value: string | number }>
  validation?: any
}

export interface FormConfig {
  fields: FormField[]
  submitText?: string
  resetText?: string
  onSubmit: (data: any) => void | Promise<void>
  onReset?: () => void
}

// Table types
export interface TableColumn<T = any> {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  pagination?: {
    page: number
    limit: number
    total: number
    onChange: (page: number) => void
  }
  sorting?: {
    field: string
    order: 'asc' | 'desc'
    onChange: (field: string, order: 'asc' | 'desc') => void
  }
  selection?: {
    selected: string[]
    onChange: (selected: string[]) => void
  }
  actions?: {
    label: string
    icon?: string
    onClick: (row: T) => void
    disabled?: (row: T) => boolean
  }[]
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  borderRadius: number
  spacing: number
  shadows: boolean
}

// Dashboard types
export interface DashboardStats {
  label: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

// File upload types
export interface FileUploadConfig {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  onUpload: (files: File[]) => void | Promise<void>
  onError?: (error: string) => void
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

// Modal types
export interface ModalConfig {
  title: string
  content: React.ReactNode
  actions?: Array<{
    label: string
    variant?: 'contained' | 'outlined' | 'text'
    color?: 'primary' | 'secondary' | 'error'
    onClick: () => void
  }>
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  disableBackdropClick?: boolean
}

// Address types
export interface Address {
  id: string
  name?: string
  phone?: string
  street: string
  house?: string
  landmark?: string
  city: string
  state: string
  country: string
  zip: string
  type: 'home' | 'work' | 'other'
  isDefault: boolean
}

// Cart types
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  image?: string
  price: number
  quantity: number
  total: number
  variant?: {
    name: string
    value: string
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

// Error types
export interface AppError {
  message: string
  code?: string
  field?: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

// Generic utility types
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Status types
export type Status = 'idle' | 'loading' | 'success' | 'error'

// Component prop types
export interface BaseComponentProps {
  className?: string
  sx?: any
  children?: React.ReactNode
}

export interface LoadingProps {
  loading: boolean
  error?: string | null
  retry?: () => void
}
