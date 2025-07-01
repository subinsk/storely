import { NextRequest, NextResponse } from 'next/server';

// Footer configuration API without authentication for demo purposes

// Mock data for footer configuration
const mockFooterConfig = {
  companyInfo: {
    name: 'Storely',
    description: 'Premium furniture for modern living spaces',
    address: '123 Design Street, Furniture City, FC 12345',
    phone: '+1 (555) 123-4567',
    email: 'hello@storely.com'
  },
  sections: [
    {
      id: '1',
      title: 'Shop',
      order: 1,
      isVisible: true,
      links: [
        { id: '1', text: 'All Products', url: '/products', isExternal: false, isVisible: true },
        { id: '2', text: 'Living Room', url: '/category/living-room', isExternal: false, isVisible: true },
        { id: '3', text: 'Bedroom', url: '/category/bedroom', isExternal: false, isVisible: true },
        { id: '4', text: 'Dining Room', url: '/category/dining-room', isExternal: false, isVisible: true }
      ]
    },
    {
      id: '2',
      title: 'Customer Service',
      order: 2,
      isVisible: true,
      links: [
        { id: '5', text: 'Contact Us', url: '/contact', isExternal: false, isVisible: true },
        { id: '6', text: 'FAQ', url: '/faq', isExternal: false, isVisible: true },
        { id: '7', text: 'Shipping Info', url: '/shipping', isExternal: false, isVisible: true },
        { id: '8', text: 'Returns', url: '/returns', isExternal: false, isVisible: true }
      ]
    },
    {
      id: '3',
      title: 'Company',
      order: 3,
      isVisible: true,
      links: [
        { id: '9', text: 'About Us', url: '/about', isExternal: false, isVisible: true },
        { id: '10', text: 'Careers', url: '/careers', isExternal: false, isVisible: true },
        { id: '11', text: 'Press', url: '/press', isExternal: false, isVisible: true },
        { id: '12', text: 'Sustainability', url: '/sustainability', isExternal: false, isVisible: true }
      ]
    }
  ],
  socialLinks: [
    { id: '1', platform: 'facebook', url: 'https://facebook.com/storely', icon: 'eva:facebook-fill', isVisible: true },
    { id: '2', platform: 'instagram', url: 'https://instagram.com/storely', icon: 'eva:instagram-fill', isVisible: true },
    { id: '3', platform: 'twitter', url: 'https://twitter.com/storely', icon: 'eva:twitter-fill', isVisible: true },
    { id: '4', platform: 'linkedin', url: 'https://linkedin.com/company/storely', icon: 'eva:linkedin-fill', isVisible: true }
  ],
  newsletter: {
    enabled: true,
    title: 'Stay in the loop',
    description: 'Subscribe to our newsletter for the latest updates and exclusive offers.',
    placeholder: 'Enter your email address'
  },
  copyright: {
    text: '© {year} Storely. All rights reserved.',
    showYear: true,
    customText: 'Built with care for furniture lovers everywhere.'
  },
  appearance: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    linkColor: '#3f51b5',
    layout: 'default'
  }
};

// GET: Fetch footer configuration
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockFooterConfig
    });

  } catch (error) {
    console.error('Footer configuration fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer configuration' },
      { status: 500 }
    );
  }
}

// PUT: Update footer configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update the mock configuration
    Object.assign(mockFooterConfig, body);

    return NextResponse.json({
      success: true,
      data: mockFooterConfig,
      message: 'Footer configuration updated successfully'
    });

  } catch (error) {
    console.error('Footer configuration update error:', error);
    return NextResponse.json(
      { error: 'Failed to update footer configuration' },
      { status: 500 }
    );
  }
}

// POST: Preview footer configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'preview':
        // Generate preview HTML for the footer
        const previewHtml = generateFooterPreview(data || mockFooterConfig);
        return NextResponse.json({
          success: true,
          data: { previewHtml },
          message: 'Footer preview generated successfully'
        });

      case 'validate':
        // Validate footer configuration
        const validation = validateFooterConfig(data);
        return NextResponse.json({
          success: true,
          data: validation,
          message: 'Footer configuration validated'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Footer configuration operation error:', error);
    return NextResponse.json(
      { error: 'Failed to process footer configuration operation' },
      { status: 500 }
    );
  }
}

// Helper function to generate footer preview HTML
function generateFooterPreview(config: any): string {
  const currentYear = new Date().getFullYear();
  const copyrightText = config.copyright.text.replace('{year}', currentYear.toString());

  return `
    <footer style="background-color: ${config.appearance.backgroundColor}; color: ${config.appearance.textColor}; padding: 40px 20px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
          <!-- Company Info -->
          <div>
            <h3 style="color: ${config.appearance.textColor}; margin-bottom: 15px;">${config.companyInfo.name}</h3>
            <p style="color: ${config.appearance.textColor}; opacity: 0.8; margin-bottom: 10px;">${config.companyInfo.description}</p>
            <p style="color: ${config.appearance.textColor}; opacity: 0.7; font-size: 14px;">${config.companyInfo.address}</p>
            <p style="color: ${config.appearance.textColor}; opacity: 0.7; font-size: 14px;">${config.companyInfo.phone}</p>
            <p style="color: ${config.appearance.textColor}; opacity: 0.7; font-size: 14px;">${config.companyInfo.email}</p>
          </div>
          
          <!-- Footer Sections -->
          ${config.sections.filter((section: any) => section.isVisible).map((section: any) => `
            <div>
              <h4 style="color: ${config.appearance.textColor}; margin-bottom: 15px;">${section.title}</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${section.links.filter((link: any) => link.isVisible).map((link: any) => `
                  <li style="margin-bottom: 8px;">
                    <a href="${link.url}" style="color: ${config.appearance.linkColor}; text-decoration: none; opacity: 0.8;">
                      ${link.text}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
          
          <!-- Newsletter -->
          ${config.newsletter.enabled ? `
            <div>
              <h4 style="color: ${config.appearance.textColor}; margin-bottom: 15px;">${config.newsletter.title}</h4>
              <p style="color: ${config.appearance.textColor}; opacity: 0.8; margin-bottom: 15px;">${config.newsletter.description}</p>
              <form style="display: flex; gap: 10px;">
                <input type="email" placeholder="${config.newsletter.placeholder}" style="flex: 1; padding: 10px; border: none; border-radius: 4px;" />
                <button type="submit" style="background: ${config.appearance.linkColor}; color: white; border: none; padding: 10px 20px; border-radius: 4px;">Subscribe</button>
              </form>
            </div>
          ` : ''}
        </div>
        
        <!-- Social Links -->
        ${config.socialLinks.filter((social: any) => social.isVisible).length > 0 ? `
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; gap: 15px; justify-content: center;">
              ${config.socialLinks.filter((social: any) => social.isVisible).map((social: any) => `
                <a href="${social.url}" style="color: ${config.appearance.linkColor}; font-size: 20px;">
                  ${social.platform}
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Copyright -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <p style="color: ${config.appearance.textColor}; opacity: 0.7; margin: 0;">${copyrightText}</p>
          ${config.copyright.customText ? `
            <p style="color: ${config.appearance.textColor}; opacity: 0.6; margin: 5px 0 0 0; font-size: 14px;">${config.copyright.customText}</p>
          ` : ''}
        </div>
      </div>
    </footer>
  `;
}

// Helper function to validate footer configuration
function validateFooterConfig(config: any): any {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate company info
  if (!config.companyInfo?.name) {
    errors.push('Company name is required');
  }
  if (!config.companyInfo?.email) {
    warnings.push('Company email is recommended');
  }

  // Validate sections
  if (!config.sections || config.sections.length === 0) {
    warnings.push('At least one footer section is recommended');
  }

  config.sections?.forEach((section: any, index: number) => {
    if (!section.title) {
      errors.push(`Section ${index + 1} requires a title`);
    }
    if (section.links?.length === 0) {
      warnings.push(`Section "${section.title}" has no links`);
    }
  });

  // Validate social links
  config.socialLinks?.forEach((social: any, index: number) => {
    if (!social.url) {
      warnings.push(`Social link ${index + 1} (${social.platform}) has no URL`);
    }
  });

  // Validate newsletter
  if (config.newsletter?.enabled) {
    if (!config.newsletter.title) {
      warnings.push('Newsletter title is recommended when newsletter is enabled');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
