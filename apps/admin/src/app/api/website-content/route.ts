import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Homepage content schema
const HomepageContentSchema = z.object({
  hero: z.object({
    title: z.string().min(1).max(200),
    subtitle: z.string().max(500).optional(),
    backgroundImage: z.string().url().optional(),
    ctaText: z.string().max(50).optional(),
    ctaLink: z.string().optional()
  }).optional(),
  sections: z.array(z.object({
    id: z.string(),
    type: z.enum(['hero', 'features', 'products', 'testimonials', 'newsletter', 'custom']),
    title: z.string().max(200).optional(),
    content: z.any(), // JSON content varies by section type
    order: z.number(),
    isVisible: z.boolean().default(true)
  })).optional(),
  seo: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    keywords: z.array(z.string()).optional(),
    image: z.string().url().optional()
  }).optional()
});

// Navigation menu schema
const NavigationSchema = z.object({
  menus: z.array(z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    type: z.enum(['header', 'footer', 'mobile', 'sidebar']),
    items: z.array(z.object({
      id: z.string(),
      label: z.string().min(1).max(100),
      url: z.string(),
      type: z.enum(['internal', 'external', 'category', 'page']),
      target: z.enum(['_self', '_blank']).default('_self'),
      icon: z.string().optional(),
      order: z.number(),
      isVisible: z.boolean().default(true),
      children: z.array(z.any()).optional() // Recursive for sub-menus
    })),
    settings: z.object({
      maxDepth: z.number().default(2),
      showIcons: z.boolean().default(false),
      style: z.string().optional()
    }).optional()
  }))
});

// Get homepage and navigation data
export async function GET(request: NextRequest) {
  try {
    // For now, we'll skip authentication and use a default organization
    // In production, you'd get this from session
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'homepage', 'navigation', or 'all'
    const organizationId = searchParams.get('organizationId') || 'default-org';

    let homepage = null;
    let navigation = null;

    if (type === 'homepage' || type === 'all' || !type) {
      // Get store settings for homepage content
      const storeSettings = await prisma.storeSettings.findFirst({
        where: { organizationId }
      });

      // Extract homepage content from store settings metadata or use defaults
      homepage = {
        hero: {
          title: 'Welcome to Our Store',
          subtitle: 'Discover amazing products at great prices',
          backgroundImage: '/assets/images/hero-bg.jpg',
          ctaText: 'Shop Now',
          ctaLink: '/products'
        },
        sections: [
          {
            id: 'featured-products',
            type: 'products',
            title: 'Featured Products',
            content: { productIds: [], displayType: 'grid', limit: 8 },
            order: 1,
            isVisible: true
          },
          {
            id: 'features',
            type: 'features',
            title: 'Why Choose Us',
            content: {
              features: [
                { icon: 'eva:shield-check', title: 'Secure Shopping', description: 'Safe and secure payment processing' },
                { icon: 'eva:truck', title: 'Fast Delivery', description: 'Quick delivery to your doorstep' },
                { icon: 'eva:headphones', title: '24/7 Support', description: 'Round the clock customer support' },
                { icon: 'eva:refresh', title: 'Easy Returns', description: 'Hassle-free return policy' }
              ]
            },
            order: 2,
            isVisible: true
          }
        ],
        seo: {
          title: storeSettings?.metaTitle || 'Home - Your Online Store',
          description: storeSettings?.metaDescription || 'Shop the best products at amazing prices. Fast delivery, secure payment, and excellent customer service.',
          keywords: storeSettings?.metaKeywords ? JSON.parse(storeSettings.metaKeywords) : ['online store', 'shopping', 'products', 'ecommerce']
        }
      };
    }

    if (type === 'navigation' || type === 'all' || !type) {
      // Default navigation structure
      navigation = {
        menus: [
          {
            id: 'main-header',
            name: 'Main Header Menu',
            type: 'header',
            items: [
              { id: '1', label: 'Home', url: '/', type: 'internal', target: '_self', order: 1, isVisible: true },
              { id: '2', label: 'Products', url: '/products', type: 'internal', target: '_self', order: 2, isVisible: true },
              { id: '3', label: 'Categories', url: '/categories', type: 'internal', target: '_self', order: 3, isVisible: true },
              { id: '4', label: 'About', url: '/about', type: 'internal', target: '_self', order: 4, isVisible: true },
              { id: '5', label: 'Contact', url: '/contact', type: 'internal', target: '_self', order: 5, isVisible: true }
            ],
            settings: { maxDepth: 2, showIcons: false }
          },
          {
            id: 'main-footer',
            name: 'Main Footer Menu',
            type: 'footer',
            items: [
              { id: '1', label: 'Privacy Policy', url: '/privacy', type: 'internal', target: '_self', order: 1, isVisible: true },
              { id: '2', label: 'Terms of Service', url: '/terms', type: 'internal', target: '_self', order: 2, isVisible: true },
              { id: '3', label: 'Support', url: '/support', type: 'internal', target: '_self', order: 3, isVisible: true },
              { id: '4', label: 'FAQ', url: '/faq', type: 'internal', target: '_self', order: 4, isVisible: true }
            ],
            settings: { maxDepth: 1, showIcons: true }
          }
        ]
      };
    }

    const response: any = {};
    if (homepage) response.homepage = homepage;
    if (navigation) response.navigation = navigation;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Website content fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update homepage content (simplified version)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, organizationId = 'default-org' } = body;

    if (type === 'homepage') {
      const validatedData = HomepageContentSchema.parse(data);
      
      // For now, we'll store some homepage data in store settings
      await prisma.storeSettings.upsert({
        where: { organizationId },
        update: {
          metaTitle: validatedData.seo?.title,
          metaDescription: validatedData.seo?.description,
          metaKeywords: validatedData.seo?.keywords ? JSON.stringify(validatedData.seo.keywords) : null,
          updatedAt: new Date()
        },
        create: {
          organizationId,
          storeName: 'My Store',
          metaTitle: validatedData.seo?.title,
          metaDescription: validatedData.seo?.description,
          metaKeywords: validatedData.seo?.keywords ? JSON.stringify(validatedData.seo.keywords) : null
        }
      });
    } else if (type === 'navigation') {
      const validatedData = NavigationSchema.parse(data);
      
      // Store navigation in contact info JSON field temporarily
      await prisma.storeSettings.upsert({
        where: { organizationId },
        update: {
          contactInfo: validatedData as any,
          updatedAt: new Date()
        },
        create: {
          organizationId,
          storeName: 'My Store',
          contactInfo: validatedData as any
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "homepage" or "navigation"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type} updated successfully`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Website content update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
