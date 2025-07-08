export interface Review {
  id: string;
  content: string;
  rating: number;
  productId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewRequest {
  productId: string;
  content: string;
  rating: number;
}

export interface UpdateReviewRequest {
  content: string;
  rating: number;
}

export interface ReviewFilters {
  rating?: number;
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';
  page?: number;
  limit?: number;
}
