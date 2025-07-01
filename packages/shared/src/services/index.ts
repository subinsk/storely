// Service stubs to prevent import errors during monorepo migration

// Organization service
export const getOrganizations = async () => []
export const getOrganizationById = async (id: string) => null
export const getOrganizationUsers = async (id: string) => []

// Category service
export const useGetCategories = () => ({ categories: [], loading: false, error: null })
export const getCategoryById = async (id: string) => null
export const createCategory = async (data: any) => null
export const updateCategory = async (id: string, data: any) => null
export const deleteCategoryById = async (id: string) => null

// Product service
export const useGetProducts = () => ({ products: [], loading: false, error: null })
export const getProductById = async (id: string) => null
export const createProduct = async (data: any) => null
export const updateProduct = async (id: string, data: any) => null

// Order service
export const useGetOrders = () => ({ orders: [], loading: false, error: null })

// User service
export const useGetUserProfile = () => ({ user: null, loading: false, error: null })
export const updateUserProfile = async (data: any) => null
