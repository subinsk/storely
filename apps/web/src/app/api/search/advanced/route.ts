import { NextRequest, NextResponse } from 'next/server';
import { createAdvancedSearchService } from '../../../../services/search.service';

// GET /api/search/advanced - Advanced product search with filters and facets
export async function GET(request: NextRequest) {
  try {
    const organizationId = request.headers.get('x-organization-id');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const filters: any = {
      query: searchParams.get('q') || '',
      categoryId: searchParams.get('categoryId') || undefined,
      priceRange: {
        min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      },
      brand: searchParams.get('brand') || undefined,
      tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : [],
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    // Remove undefined values from priceRange
    if (!filters.priceRange.min && !filters.priceRange.max) {
      filters.priceRange = undefined;
    }

    const searchService = createAdvancedSearchService(organizationId);
    const results = await searchService.search(filters);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
