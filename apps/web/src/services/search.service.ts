import { prisma } from '../lib/prisma';
import type { Product } from '../types';

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  brand?: string;
  tags?: string[];
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'tag';
  value: string;
  count: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  suggestions: SearchSuggestion[];
  facets: {
    categories: Array<{ id: string; name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRanges: Array<{ min: number; max: number; count: number }>;
    tags: Array<{ name: string; count: number }>;
  };
  searchTime: number;
}

export class AdvancedSearchService {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  async search(filters: SearchFilters): Promise<SearchResult> {
    const startTime = Date.now();
    const {
      query = '',
      categoryId,
      priceRange,
      brand,
      tags = [],
      inStock,
      featured,
      rating,
      sortBy = 'relevance',
      page = 1,
      limit = 12,
    } = filters;

    // Build base where clause
    const whereClause: any = {
      organizationId: this.organizationId,
      status: 'active',
    };

    // Text search with full-text capabilities
    if (query) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      whereClause.OR = [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            hasSome: searchTerms,
          },
        },
      ];
    }

    // Category filter
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // Price range filter
    if (priceRange) {
      whereClause.price = {
        gte: priceRange.min,
        lte: priceRange.max,
      };
    }

    // Brand filter (assuming brand is stored in a brand field or extracted from name)
    if (brand) {
      whereClause.brand = {
        contains: brand,
        mode: 'insensitive',
      };
    }

    // Tags filter
    if (tags.length > 0) {
      whereClause.tags = {
        hassome: tags,
      };
    }

    // Stock filter
    if (inStock !== undefined) {
      whereClause.stockQuantity = inStock ? { gt: 0 } : { lte: 0 };
    }

    // Featured filter
    if (featured !== undefined) {
      whereClause.featured = featured;
    }

    // Rating filter
    if (rating) {
      // This would require a subquery or computed field for average rating
      // For now, we'll skip this in the where clause and filter post-query
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popularity':
        // This would require tracking view/purchase counts
        orderBy = { createdAt: 'desc' }; // Fallback
        break;
      case 'rating':
        // This would require computed average rating
        orderBy = { createdAt: 'desc' }; // Fallback
        break;
      default: // relevance
        orderBy = query ? { createdAt: 'desc' } : { featured: 'desc' };
    }

    // Execute search query
    const [products, total, facets] = await Promise.all([
      this.executeSearchQuery(whereClause, orderBy, page, limit, rating),
      this.getTotalCount(whereClause),
      this.getFacets(query),
    ]);

    // Generate suggestions
    const suggestions = await this.getSuggestions(query);

    const searchTime = Date.now() - startTime;

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      suggestions,
      facets,
      searchTime,
    };
  }

  private async executeSearchQuery(
    whereClause: any,
    orderBy: any,
    page: number,
    limit: number,
    ratingFilter?: number
  ) {
    let products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate average ratings and filter if needed
    products = products.map((product: any) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      return {
        ...product,
        averageRating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
      };
    });

    // Apply rating filter if specified
    if (ratingFilter) {
      products = products.filter((product: any) => product.averageRating >= ratingFilter);
    }

    return products;
  }

  private async getTotalCount(whereClause: any): Promise<number> {
    return await prisma.product.count({ where: whereClause });
  }

  private async getFacets(query: string) {
    const baseWhere = {
      organizationId: this.organizationId,
      status: 'active',
    };

    const [categories, brands, priceStats, tagStats] = await Promise.all([
      // Categories with product counts
      prisma.category.findMany({
        where: {
          organizationId: this.organizationId,
          products: {
            some: baseWhere,
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              products: {
                where: baseWhere,
              },
            },
          },
        },
      }),

      // Brands (extracted from product data)
      prisma.product.groupBy({
        by: ['brand'],
        where: {
          ...baseWhere,
          brand: { not: null },
        },
        _count: true,
      }),

      // Price statistics for range generation
      prisma.product.aggregate({
        where: baseWhere,
        _min: { price: true },
        _max: { price: true },
        _avg: { price: true },
      }),

      // Tag statistics
      prisma.product.findMany({
        where: baseWhere,
        select: { tags: true },
      }),
    ]);

    // Process tags to get counts
    const tagCounts: Record<string, number> = {};
    tagStats.forEach((product: any) => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Generate price ranges
    const minPrice = priceStats._min.price || 0;
    const maxPrice = priceStats._max.price || 1000;
    const priceRanges = this.generatePriceRanges(minPrice, maxPrice);

    return {
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        count: cat._count.products,
      })),
      brands: brands.map((brand: any) => ({
        name: brand.brand,
        count: brand._count,
      })),
      priceRanges,
      tags: Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20), // Top 20 tags
    };
  }

  private generatePriceRanges(min: number, max: number) {
    const ranges = [];
    const range = max - min;
    const step = Math.ceil(range / 5); // 5 ranges

    for (let i = 0; i < 5; i++) {
      const rangeMin = min + (i * step);
      const rangeMax = i === 4 ? max : min + ((i + 1) * step);
      ranges.push({
        min: rangeMin,
        max: rangeMax,
        count: 0, // Would need additional query to get actual counts
      });
    }

    return ranges;
  }

  private async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];

    // Product name suggestions
    const productSuggestions = await prisma.product.findMany({
      where: {
        organizationId: this.organizationId,
        status: 'active',
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: { name: true },
      take: 5,
    });

    productSuggestions.forEach((product: any) => {
      suggestions.push({
        type: 'product',
        value: product.name,
        count: 1,
      });
    });

    // Category suggestions
    const categorySuggestions = await prisma.category.findMany({
      where: {
        organizationId: this.organizationId,
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: { name: true },
      take: 3,
    });

    categorySuggestions.forEach((category: any) => {
      suggestions.push({
        type: 'category',
        value: category.name,
        count: 1,
      });
    });

    return suggestions;
  }

  async getSearchHistory(userId: string): Promise<string[]> {
    // This would typically be stored in a user search history table
    // For now, return empty array
    return [];
  }

  async saveSearchQuery(userId: string, query: string): Promise<void> {
    // Save search query for analytics and personalization
    try {
      await prisma.userSearchHistory.create({
        data: {
          userId,
          query,
          organizationId: this.organizationId,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Table might not exist, ignore for now
      console.log('Search history not saved:', error);
    }
  }

  async getPopularSearches(limit: number = 10): Promise<string[]> {
    // Return popular search terms
    // This would require aggregating search history data
    return [
      'modern sofa',
      'dining table',
      'office chair',
      'bedroom set',
      'coffee table',
      'lamp',
      'bookshelf',
      'wardrobe',
    ].slice(0, limit);
  }

  async getTrendingProducts(limit: number = 6): Promise<Product[]> {
    // Get trending products based on recent views/purchases
    return await prisma.product.findMany({
      where: {
        organizationId: this.organizationId,
        status: 'active',
      },
      include: {
        category: true,
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
  }
}

// Export singleton pattern for easier use
export const createAdvancedSearchService = (organizationId: string) => 
  new AdvancedSearchService(organizationId);
