import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: Record<string, any>;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface ProductSEO {
  name: string;
  description: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition: 'New' | 'Used' | 'Refurbished';
  brand: string;
  category: string;
  images: string[];
  sku?: string;
  gtin?: string;
  mpn?: string;
  rating?: {
    value: number;
    count: number;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
}

export interface ArticleSEO {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
  category: string;
  image?: string;
  wordCount?: number;
  readingTime?: number;
}

class SEOService {
  private readonly siteUrl: string;
  private readonly siteName: string;
  private readonly defaultImage: string;
  private readonly defaultDescription: string;

  constructor() {
    this.siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://storely.com';
    this.siteName = 'Storely';
    this.defaultImage = `${this.siteUrl}/og-image.jpg`;
    this.defaultDescription = 'Storely - Your premium shopping experience with quality products and exceptional service.';
  }

  generateMetadata(config: SEOConfig): Metadata {
    const {
      title,
      description,
      keywords,
      canonical,
      ogImage,
      ogType = 'website',
      twitterCard = 'summary_large_image',
      noIndex = false,
      noFollow = false,
    } = config;

    const fullTitle = title.includes(this.siteName) ? title : `${title} | ${this.siteName}`;
    const canonicalUrl = canonical || this.siteUrl;
    const imageUrl = ogImage || this.defaultImage;

    const metadata: Metadata = {
      title: fullTitle,
      description: description || this.defaultDescription,
      keywords: keywords?.join(', '),
      robots: {
        index: !noIndex,
        follow: !noFollow,
        googleBot: {
          index: !noIndex,
          follow: !noFollow,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: fullTitle,
        description: description || this.defaultDescription,
        url: canonicalUrl,
        siteName: this.siteName,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: ogType,
      },
      twitter: {
        card: twitterCard,
        title: fullTitle,
        description: description || this.defaultDescription,
        images: [imageUrl],
      },
    };

    return metadata;
  }

  generateProductSchema(product: ProductSEO): Record<string, any> {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
        itemCondition: `https://schema.org/${product.condition}Condition`,
        url: `${this.siteUrl}/product/${product.sku}`,
      },
    };

    // Add optional fields
    if (product.sku) {
      schema['sku'] = product.sku;
    }
    if (product.gtin) {
      schema['gtin'] = product.gtin;
    }
    if (product.mpn) {
      schema['mpn'] = product.mpn;
    }

    // Add rating if available
    if (product.rating) {
      schema['aggregateRating'] = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        ratingCount: product.rating.count,
      };
    }

    // Add reviews if available
    if (product.reviews && product.reviews.length > 0) {
      schema['review'] = product.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
        },
        reviewBody: review.text,
        datePublished: review.date,
      }));
    }

    return schema;
  }

  generateArticleSchema(article: ArticleSEO): Record<string, any> {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      author: {
        '@type': 'Person',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.siteUrl}/logo.png`,
        },
      },
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime || article.publishedTime,
      articleSection: article.category,
    };

    if (article.image) {
      schema['image'] = {
        '@type': 'ImageObject',
        url: article.image,
        width: 1200,
        height: 630,
      };
    }

    if (article.tags && article.tags.length > 0) {
      schema['keywords'] = article.tags.join(', ');
    }

    if (article.wordCount) {
      schema['wordCount'] = article.wordCount;
    }

    return schema;
  }

  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  generateOrganizationSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      url: this.siteUrl,
      logo: `${this.siteUrl}/logo.png`,
      description: this.defaultDescription,
      sameAs: [
        'https://www.facebook.com/storely',
        'https://www.twitter.com/storely',
        'https://www.instagram.com/storely',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-0123',
        contactType: 'customer service',
        availableLanguage: 'English',
      },
    };
  }

  generateWebSiteSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.siteUrl,
      description: this.defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  generateHowToSchema(guide: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    totalTime?: string;
    supply?: string[];
    tool?: string[];
  }): Record<string, any> {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: guide.name,
      description: guide.description,
      step: guide.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        ...(step.image && {
          image: {
            '@type': 'ImageObject',
            url: step.image,
          },
        }),
      })),
    };

    if (guide.totalTime) {
      schema['totalTime'] = guide.totalTime;
    }

    if (guide.supply && guide.supply.length > 0) {
      schema['supply'] = guide.supply.map(item => ({
        '@type': 'HowToSupply',
        name: item,
      }));
    }

    if (guide.tool && guide.tool.length > 0) {
      schema['tool'] = guide.tool.map(item => ({
        '@type': 'HowToTool',
        name: item,
      }));
    }

    return schema;
  }

  generateLocalBusinessSchema(business: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    phone: string;
    email: string;
    hours: Array<{ day: string; opens: string; closes: string }>;
    priceRange: string;
    acceptsCreditCards: boolean;
  }): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.street,
        addressLocality: business.address.city,
        addressRegion: business.address.state,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
      telephone: business.phone,
      email: business.email,
      url: this.siteUrl,
      priceRange: business.priceRange,
      paymentAccepted: business.acceptsCreditCards ? 'Credit Card' : 'Cash',
      openingHours: business.hours.map(hour => `${hour.day} ${hour.opens}-${hour.closes}`),
    };
  }

  generateSitemapUrl(urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>): string {
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(url => [
        '  <url>',
        `    <loc>${url.loc}</loc>`,
        ...(url.lastmod ? [`    <lastmod>${url.lastmod}</lastmod>`] : []),
        ...(url.changefreq ? [`    <changefreq>${url.changefreq}</changefreq>`] : []),
        ...(url.priority ? [`    <priority>${url.priority}</priority>`] : []),
        '  </url>',
      ].join('\n')),
      '</urlset>',
    ].join('\n');

    return sitemap;
  }

  generateRobotsTxt(rules: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
  }>): string {
    const robotsTxt = [
      ...rules.map(rule => [
        `User-agent: ${rule.userAgent}`,
        ...(rule.allow ? rule.allow.map(path => `Allow: ${path}`) : []),
        ...(rule.disallow ? rule.disallow.map(path => `Disallow: ${path}`) : []),
        '',
      ].join('\n')),
      `Sitemap: ${this.siteUrl}/sitemap.xml`,
    ].join('\n');

    return robotsTxt;
  }

  // Utility methods
  calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  extractKeywords(text: string, count: number = 10): string[] {
    const commonWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'were', 'will', 'with', 'would', 'you', 'your',
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([word]) => word);
  }

  validateStructuredData(data: Record<string, any>): boolean {
    // Basic validation - in production, you might want to use a more robust validator
    return data['@context'] && data['@type'];
  }
}

export const seoService = new SEOService();
export default seoService;
