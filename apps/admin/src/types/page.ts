export type PageStatus = 'draft' | 'published' | 'scheduled';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PageStatus;
  isVisible: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}
