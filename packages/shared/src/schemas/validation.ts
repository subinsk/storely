import { z } from 'zod'

// Email validation schema
export const emailSchema = z.string().email('Invalid email address')

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')

// Phone number validation schema
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format')

// URL validation schema
export const urlSchema = z.string().url('Invalid URL format')

// Required string schema
export const requiredStringSchema = z.string().min(1, 'This field is required')

// Optional string schema
export const optionalStringSchema = z.string().optional()

// Number validation schemas
export const positiveNumberSchema = z.number().positive('Must be a positive number')
export const nonNegativeNumberSchema = z.number().min(0, 'Must be zero or positive')

// Currency validation schema
export const currencySchema = z.number().min(0, 'Amount must be positive').multipleOf(0.01)

// Date validation schemas
export const dateSchema = z.date()
export const futureDateSchema = z.date().refine(
  (date) => date > new Date(),
  'Date must be in the future'
)
export const pastDateSchema = z.date().refine(
  (date) => date < new Date(),
  'Date must be in the past'
)

// File validation schema
export const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
})

// Image file validation schema
export const imageFileSchema = fileSchema.extend({
  type: z.string().regex(/^image\//, 'File must be an image'),
})

// User validation schemas
export const userNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')

export const userRegistrationSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Product validation schemas
export const productNameSchema = z
  .string()
  .min(1, 'Product name is required')
  .max(100, 'Product name must be less than 100 characters')

export const productPriceSchema = z
  .number()
  .positive('Price must be positive')
  .max(999999.99, 'Price is too high')

export const productSkuSchema = z
  .string()
  .min(1, 'SKU is required')
  .max(50, 'SKU must be less than 50 characters')
  .regex(/^[A-Z0-9\-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')

export const productCreateSchema = z.object({
  name: productNameSchema,
  sku: productSkuSchema,
  price: productPriceSchema,
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  quantity: nonNegativeNumberSchema,
  weight: z.number().positive().optional(),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).default('draft'),
})

// Order validation schemas
export const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: productPriceSchema,
})

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: z.object({
    street: requiredStringSchema,
    city: requiredStringSchema,
    state: requiredStringSchema,
    country: requiredStringSchema,
    zip: requiredStringSchema,
  }),
  billingAddress: z.object({
    street: requiredStringSchema,
    city: requiredStringSchema,
    state: requiredStringSchema,
    country: requiredStringSchema,
    zip: requiredStringSchema,
  }).optional(),
  notes: optionalStringSchema,
})

// Category validation schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: optionalStringSchema,
  parentId: z.string().uuid().optional(),
  image: urlSchema.optional(),
})

// Address validation schemas
export const addressCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema.optional(),
  street: requiredStringSchema,
  house: optionalStringSchema,
  city: requiredStringSchema,
  state: requiredStringSchema,
  country: requiredStringSchema,
  zip: z.string().min(1, 'ZIP code is required'),
  type: z.enum(['home', 'work', 'other']).default('home'),
  isDefault: z.boolean().default(false),
})

// Organization validation schemas
export const organizationCreateSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(100),
  subdomain: z.string().min(3, 'Subdomain must be at least 3 characters').max(50).optional(),
  customDomain: urlSchema.optional(),
  plan: z.enum(['free', 'premium', 'enterprise']).default('free'),
})

// Search and filter schemas
export const searchParamsSchema = z.object({
  q: optionalStringSchema,
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: optionalStringSchema,
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const productFiltersSchema = searchParamsSchema.extend({
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
  featured: z.coerce.boolean().optional(),
})

// Utility validation functions
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email)
    return true
  } catch {
    return false
  }
}

export const validatePassword = (password: string): boolean => {
  try {
    passwordSchema.parse(password)
    return true
  } catch {
    return false
  }
}

export const validateUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url)
    return true
  } catch {
    return false
  }
}
