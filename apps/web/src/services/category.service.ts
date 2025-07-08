import { prisma } from '../lib/prisma';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useOrganization } from '../contexts/OrganizationContext';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryService {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  async getCategories() {
    return await prisma.category.findMany({
      where: {
        organizationId: this.organizationId,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        parent: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getCategoryById(id: string) {
    return await prisma.category.findFirst({
      where: {
        id,
        organizationId: this.organizationId,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        parent: true,
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    return await prisma.category.findFirst({
      where: {
        slug,
        organizationId: this.organizationId,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        parent: true,
      },
    });
  }

  async getCategoryTree() {
    const categories = await this.getCategories();
    
    // Build tree structure
    const categoryMap = new Map();
    const tree: any[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        tree.push(categoryMap.get(category.id));
      }
    });

    return tree;
  }
}

// React hooks for client-side usage
export function useGetCategories() {
  const { organization } = useOrganization();
  
  const URL = organization?.id ? '/api/categories' : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      categories: data?.data || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCategory(params?: { id?: string; slug?: string }) {
  const { organization } = useOrganization();
  const { id, slug } = params || {};
  
  const URL = organization?.id && (slug || id) ? `/api/categories/${slug || id}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      category: data?.data || null,
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCategoryTree() {
  const { organization } = useOrganization();
  
  const URL = organization?.id ? '/api/categories/tree' : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch category tree');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      categoryTree: data?.data || [],
      categoryTreeLoading: isLoading,
      categoryTreeError: error,
      categoryTreeValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
