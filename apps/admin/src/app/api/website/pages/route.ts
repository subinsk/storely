import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Custom pages API without authentication for demo purposes

// Mock data for custom pages
const mockPages = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About Storely</h1><p>We are passionate about bringing you the finest furniture...</p>',
    status: 'published',
    template: 'default',
    seo: {
      title: 'About Us - Storely',
      description: 'Learn about Storely\'s mission to provide premium furniture',
      keywords: 'about, storely, furniture, company'
    },
    isVisible: true,
    showInMenu: true,
    menuOrder: 1,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h1>Privacy Policy</h1><p>This Privacy Policy describes how we collect, use, and protect your information...</p>',
    status: 'published',
    template: 'legal',
    seo: {
      title: 'Privacy Policy - Storely',
      description: 'Read our privacy policy to understand how we handle your data',
      keywords: 'privacy, policy, data, protection'
    },
    isVisible: true,
    showInMenu: false,
    menuOrder: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Sustainability',
    slug: 'sustainability',
    content: '<h1>Our Commitment to Sustainability</h1><p>Draft content about our environmental initiatives...</p>',
    status: 'draft',
    template: 'feature',
    seo: {
      title: 'Sustainability - Storely',
      description: 'Learn about our environmental commitments and sustainable practices',
      keywords: 'sustainability, environment, eco-friendly'
    },
    isVisible: false,
    showInMenu: true,
    menuOrder: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const pageTemplates = [
  {
    id: 'default',
    name: 'Default Page',
    description: 'Standard page layout with header and content area',
    preview: '/templates/default.png',
    sections: ['header', 'content', 'footer']
  },
  {
    id: 'feature',
    name: 'Feature Page',
    description: 'Page with hero section, features grid, and call-to-action',
    preview: '/templates/feature.png',
    sections: ['hero', 'features', 'cta', 'footer']
  },
  {
    id: 'legal',
    name: 'Legal Page',
    description: 'Simple layout for terms, privacy policy, and other legal pages',
    preview: '/templates/legal.png',
    sections: ['header', 'content']
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Full-featured landing page with multiple sections',
    preview: '/templates/landing.png',
    sections: ['hero', 'features', 'testimonials', 'pricing', 'cta']
  }
];

// GET: Fetch pages and templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    let data = {};

    switch (type) {
      case 'pages':
        data = { pages: mockPages };
        break;
      case 'templates':
        data = { templates: pageTemplates };
        break;
      case 'page':
        if (slug) {
          const page = mockPages.find(p => p.slug === slug);
          if (page) {
            data = { page };
          } else {
            return NextResponse.json(
              { error: 'Page not found' },
              { status: 404 }
            );
          }
        }
        break;
      default:
        data = {
          pages: mockPages,
          templates: pageTemplates
        };
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Custom pages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom pages' },
      { status: 500 }
    );
  }
}

// POST: Create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, template, status, seo, showInMenu, menuOrder } = body;

    // Check if slug already exists
    const existingPage = mockPages.find(p => p.slug === slug);
    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newPage = {
      id: Date.now().toString(),
      title,
      slug,
      content,
      template: template || 'default',
      status: status || 'draft',
      seo: seo || { title: '', description: '', keywords: '' },
      isVisible: status === 'published',
      showInMenu: showInMenu || false,
      menuOrder: menuOrder || 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : undefined
    };

    mockPages.push(newPage);

    return NextResponse.json({
      success: true,
      data: newPage,
      message: 'Page created successfully'
    });

  } catch (error) {
    console.error('Page creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

// PUT: Update page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, slug, ...data } = body;

    const pageIndex = mockPages.findIndex(page => page.id === id);
    
    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== mockPages[pageIndex].slug) {
      const existingPage = mockPages.find(p => p.slug === slug && p.id !== id);
      if (existingPage) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const previousStatus = mockPages[pageIndex].status;
    
    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...data,
      slug: slug || mockPages[pageIndex].slug,
      updatedAt: now,
      isVisible: data.status === 'published',
      publishedAt: data.status === 'published' && previousStatus !== 'published' 
        ? now 
        : mockPages[pageIndex].publishedAt
    };

    return NextResponse.json({
      success: true,
      data: mockPages[pageIndex],
      message: 'Page updated successfully'
    });

  } catch (error) {
    console.error('Page update error:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE: Remove page
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const pageIndex = mockPages.findIndex(page => page.id === id);
    
    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    mockPages.splice(pageIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    });

  } catch (error) {
    console.error('Page deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
