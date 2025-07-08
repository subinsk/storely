import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

// Load environment variables from .env file
dotenv.config()

const prisma = new PrismaClient()

// Realistic demo data
const REALISTIC_PRODUCT_IMAGES = {
  chairs: [
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&h=600',
  ],
  tables: [
    'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&h=600',
  ],
  sofas: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&h=600',
  ],
  storage: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&h=600',
    'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=800&h=600',
  ],
}

const USER_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1494790108755-2616b332c123?auto=format&fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200',
]

// Helper function to skip conflicts
async function createIfNotExists(model: any, data: any, uniqueField: string) {
  try {
    const existing = await model.findUnique({
      where: { [uniqueField]: data[uniqueField] }
    })
    if (existing) {
      console.log(`⏭️  Skipping ${model.name || 'item'} - already exists: ${data[uniqueField]}`)
      return existing
    }
    return await model.create({ data })
  } catch (error) {
    console.warn(`⚠️  Conflict creating ${model.name || 'item'}: ${data[uniqueField]} - skipping`)
    return null
  }
}

// Modular seeder functions
async function createOrganizations() {
  console.log('🏢 Creating organizations...')
  
  const org1 = await createIfNotExists(prisma.organization, {
    name: 'FurnerIO Premium Store',
    subdomain: 'furnerio-premium',
    customDomain: 'furnerio-premium.com',
    logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&h=200',
    plan: 'premium',
    isActive: true,
  }, 'name')

  const org2 = await createIfNotExists(prisma.organization, {
    name: 'ModernSpace Furniture',
    subdomain: 'modernspace',
    customDomain: 'modernspace.com',
    logo: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=200&h=200',
    plan: 'enterprise',
    isActive: true,
  }, 'name')

  return { org1, org2 }
}

async function createSuperUsers() {
  console.log('👑 Creating super users...')
  
  const superUser1 = await createIfNotExists(prisma.user, {
    email: 'super1@storely.com',
    name: 'Sarah Wilson',
    phone: '+1-555-0001',
    password: await bcrypt.hash('super_password_1', 10),
    image: USER_AVATARS[0],
    role: 'super_admin',
    emailVerified: new Date(),
  }, 'email')

  const superUser2 = await createIfNotExists(prisma.user, {
    email: 'super2@storely.com',
    name: 'Michael Chen',
    phone: '+1-555-0002',
    password: await bcrypt.hash('super_password_2', 10),
    image: USER_AVATARS[1],
    role: 'super_admin',
    emailVerified: new Date(),
  }, 'email')

  return { superUser1, superUser2 }
}

async function createOrgUsers(organizations: any) {
  console.log('👥 Creating organization users...')
  
  const users = []
  
  // Create 2 org admins for each organization
  if (organizations.org1) {
    const org1Admin1 = await createIfNotExists(prisma.user, {
      email: 'admin1@furnerio-premium.com',
      name: 'Emma Rodriguez',
      phone: '+1-555-1001',
      password: await bcrypt.hash('admin_password_1', 10),
      image: USER_AVATARS[2],
      role: 'org_admin',
      organizationId: organizations.org1.id,
      emailVerified: new Date(),
    }, 'email')

    const org1Admin2 = await createIfNotExists(prisma.user, {
      email: 'admin2@furnerio-premium.com',
      name: 'James Thompson',
      phone: '+1-555-1002',
      password: await bcrypt.hash('admin_password_2', 10),
      image: USER_AVATARS[3],
      role: 'org_admin',
      organizationId: organizations.org1.id,
      emailVerified: new Date(),
    }, 'email')

    users.push(org1Admin1, org1Admin2)
  }

  if (organizations.org2) {
    const org2Admin1 = await createIfNotExists(prisma.user, {
      email: 'admin1@modernspace.com',
      name: 'Lisa Anderson',
      phone: '+1-555-2001',
      password: await bcrypt.hash('admin_password_3', 10),
      image: USER_AVATARS[4],
      role: 'org_admin',
      organizationId: organizations.org2.id,
      emailVerified: new Date(),
    }, 'email')

    const org2Admin2 = await createIfNotExists(prisma.user, {
      email: 'admin2@modernspace.com',
      name: 'David Kim',
      phone: '+1-555-2002',
      password: await bcrypt.hash('admin_password_4', 10),
      image: USER_AVATARS[5],
      role: 'org_admin',
      organizationId: organizations.org2.id,
      emailVerified: new Date(),
    }, 'email')

    users.push(org2Admin1, org2Admin2)
  }

  // Create some regular users
  const customer1 = await createIfNotExists(prisma.user, {
    email: 'customer1@example.com',
    name: 'John Doe',
    phone: '+1-555-3001',
    password: await bcrypt.hash('customer_password_1', 10),
    image: USER_AVATARS[0],
    role: 'user',
    organizationId: organizations.org1?.id,
    emailVerified: new Date(),
  }, 'email')

  const customer2 = await createIfNotExists(prisma.user, {
    email: 'customer2@example.com',
    name: 'Jane Smith',
    phone: '+1-555-3002',
    password: await bcrypt.hash('customer_password_2', 10),
    image: USER_AVATARS[1],
    role: 'user',
    organizationId: organizations.org2?.id,
    emailVerified: new Date(),
  }, 'email')

  users.push(customer1, customer2)
  return users.filter(Boolean)
}

async function createStores(organizations: any) {
  console.log('🏪 Creating stores...')
  
  const stores = []
  
  if (organizations.org1) {
    const store1 = await prisma.store.create({
      data: {
        name: 'FurnerIO Main Store',
        organizationId: organizations.org1.id,
        isDefault: true,
        isActive: true,
      },
    })
    stores.push(store1)
  }

  if (organizations.org2) {
    const store2 = await prisma.store.create({
      data: {
        name: 'ModernSpace Flagship',
        organizationId: organizations.org2.id,
        isDefault: true,
        isActive: true,
      },
    })
    stores.push(store2)
  }

  return stores
}

async function createAddresses(users: any[]) {
  console.log('📍 Creating addresses...')
  
  const addresses = []
  
  for (const user of users) {
    if (!user || user.role === 'super_admin') continue
    
    const address = await prisma.address.create({
      data: {
        name: `${user.name}'s Address`,
        phone: user.phone,
        street: `${Math.floor(Math.random() * 999) + 1} ${['Main St', 'Oak Ave', 'Elm St', 'Park Blvd', 'Broadway'][Math.floor(Math.random() * 5)]}`,
        house: `Apt ${Math.floor(Math.random() * 50) + 1}`,
        landmark: ['Near Central Park', 'Next to Mall', 'Close to Metro', 'Downtown Area'][Math.floor(Math.random() * 4)],
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
        country: 'United States',
        zip: `${Math.floor(Math.random() * 90000) + 10000}`,
        pincode: `${Math.floor(Math.random() * 90000) + 10000}`,
        type: ['home', 'work', 'other'][Math.floor(Math.random() * 3)] as any,
        isDefault: true,
        userId: user.id,
      },
    })
    addresses.push(address)
  }

  return addresses
}

async function createCategories(organizations: any) {
  console.log('🏷️ Creating categories...')
  
  const categories = []
  
  for (const org of [organizations.org1, organizations.org2].filter(Boolean)) {
    // Parent categories
    const furniture = await createIfNotExists(prisma.category, {
      name: 'Furniture',
      slug: `furniture-${org.id}`,
      description: 'Quality furniture for your home and office',
      image: REALISTIC_PRODUCT_IMAGES.chairs[0],
      organizationId: org.id,
    }, 'slug')

    const decor = await createIfNotExists(prisma.category, {
      name: 'Home Decor',
      slug: `home-decor-${org.id}`,
      description: 'Beautiful decorative items for your home',
      image: REALISTIC_PRODUCT_IMAGES.storage[0],
      organizationId: org.id,
    }, 'slug')

    if (furniture) {
      // Child categories for furniture
      const chairs = await createIfNotExists(prisma.category, {
        name: 'Chairs',
        slug: `chairs-${org.id}`,
        description: 'Comfortable and stylish chairs',
        image: REALISTIC_PRODUCT_IMAGES.chairs[1],
        organizationId: org.id,
        parentId: furniture.id,
      }, 'slug')

      const tables = await createIfNotExists(prisma.category, {
        name: 'Tables',
        slug: `tables-${org.id}`,
        description: 'Dining and coffee tables',
        image: REALISTIC_PRODUCT_IMAGES.tables[0],
        organizationId: org.id,
        parentId: furniture.id,
      }, 'slug')

      const sofas = await createIfNotExists(prisma.category, {
        name: 'Sofas',
        slug: `sofas-${org.id}`,
        description: 'Comfortable seating solutions',
        image: REALISTIC_PRODUCT_IMAGES.sofas[0],
        organizationId: org.id,
        parentId: furniture.id,
      }, 'slug')

      const storage = await createIfNotExists(prisma.category, {
        name: 'Storage',
        slug: `storage-${org.id}`,
        description: 'Storage solutions for every room',
        image: REALISTIC_PRODUCT_IMAGES.storage[1],
        organizationId: org.id,
        parentId: furniture.id,
      }, 'slug')

      categories.push(furniture, decor, chairs, tables, sofas, storage)
    }
  }

  return categories.filter(Boolean)
}

async function createProducts(organizations: any, categories: any[]) {
  console.log('🛏️ Creating products...')
  
  const products = []
  
  // Product data templates
  const productTemplates = [
    {
      name: 'Modern Office Chair',
      category: 'chairs',
      price: 299.99,
      comparePrice: 399.99,
      description: 'Ergonomic modern office chair with lumbar support and adjustable height.',
      images: REALISTIC_PRODUCT_IMAGES.chairs,
      tags: ['chair', 'office', 'ergonomic', 'furniture'],
    },
    {
      name: 'Oak Dining Table',
      category: 'tables',
      price: 899.99,
      comparePrice: 1199.99,
      description: 'Beautiful solid oak dining table that seats 6 people comfortably.',
      images: REALISTIC_PRODUCT_IMAGES.tables,
      tags: ['table', 'dining', 'oak', 'furniture'],
    },
    {
      name: 'Leather Sectional Sofa',
      category: 'sofas',
      price: 1299.99,
      comparePrice: 1699.99,
      description: 'Luxurious leather sectional sofa perfect for family gatherings.',
      images: REALISTIC_PRODUCT_IMAGES.sofas,
      tags: ['sofa', 'leather', 'sectional', 'living room'],
    },
    {
      name: 'Storage Cabinet',
      category: 'storage',
      price: 199.99,
      comparePrice: 299.99,
      description: 'Versatile storage cabinet with multiple shelves and drawers.',
      images: REALISTIC_PRODUCT_IMAGES.storage,
      tags: ['storage', 'cabinet', 'organization', 'furniture'],
    },
  ]

  for (const org of [organizations.org1, organizations.org2].filter(Boolean)) {
    for (let i = 0; i < productTemplates.length; i++) {
      const template = productTemplates[i]
      const category = categories.find(c => c?.slug?.includes(template.category) && c.organizationId === org.id)
      
      if (!category) continue

      const product = await createIfNotExists(prisma.product, {
        slug: `${template.name.toLowerCase().replace(/\s+/g, '-')}-${org.id}`,
        name: template.name,
        sku: `${template.category.toUpperCase()}-${org.id.slice(-3)}-${i + 1}`,
        price: template.price,
        comparePrice: template.comparePrice,
        mrp: template.comparePrice * 1.2,
        cost: template.price * 0.5,
        categoryId: category.id,
        organizationId: org.id,
        status: 'active',
        featured: Math.random() > 0.5,
        trackQuantity: true,
        quantity: Math.floor(Math.random() * 50) + 10,
        lowStockAlert: 5,
        weight: Math.floor(Math.random() * 30) + 5,
        dimensions: `{"length": "${Math.floor(Math.random() * 100) + 50}cm", "width": "${Math.floor(Math.random() * 100) + 50}cm", "height": "${Math.floor(Math.random() * 100) + 50}cm"}`,
        content: template.description,
        code: `${template.category.toUpperCase()}${i + 1}`,
        images: template.images.slice(0, 2),
        newLabel: Math.random() > 0.7 ? 'New Arrival' : null,
        saleLabel: Math.random() > 0.6 ? 'Sale 25% Off' : null,
        subDescription: `Premium ${template.category} for your home`,
        metaTitle: `${template.name} - Premium Quality`,
        metaDescription: template.description,
        tags: template.tags,
        isActive: true,
        publishedAt: new Date(),
      }, 'slug')

      if (product) {
        products.push(product)
        
        // Create variants for some products
        if (Math.random() > 0.5) {
          await createProductVariants(product)
        }
      }
    }
  }

  return products.filter(Boolean)
}

async function createProductVariants(product: any) {
  console.log(`🎨 Creating variants for ${product.name}...`)
  
  const colorVariants = ['Black', 'White', 'Brown', 'Gray']
  const sizeVariants = ['Small', 'Medium', 'Large']
  
  // Create color variants
  for (let i = 0; i < Math.min(2, colorVariants.length); i++) {
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: 'Color',
        value: colorVariants[i],
        sku: `${product.sku}-${colorVariants[i].slice(0, 3).toUpperCase()}`,
        price: 0,
        quantity: Math.floor(Math.random() * 20) + 5,
        weight: product.weight,
        image: product.images[0],
        position: i + 1,
        attributes: {
          colorCode: ['#000000', '#FFFFFF', '#8B4513', '#808080'][i] || '#000000'
        }
      },
    })
  }
}

async function createInventory(products: any[]) {
  console.log('📦 Creating inventory records...')
  
  for (const product of products) {
    if (!product) continue
    
    await prisma.productInventory.create({
      data: {
        productId: product.id,
        quantity: product.quantity,
        reservedQuantity: Math.floor(Math.random() * 5),
        location: 'Main Warehouse',
      },
    })
  }
}

async function createCarts(users: any[]) {
  console.log('🛒 Creating shopping carts...')
  
  const carts = []
  
  for (const user of users) {
    if (!user || user.role !== 'user') continue
    
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    })
    carts.push(cart)
  }

  return carts
}

async function createOrders(organizations: any, users: any[], products: any[]) {
  console.log('📋 Creating orders...')
  
  const orders = []
  const customerUsers = users.filter(u => u?.role === 'user')
  
  for (let i = 0; i < 5; i++) {
    const customer = customerUsers[Math.floor(Math.random() * customerUsers.length)]
    if (!customer) continue
    
    const orgProducts = products.filter(p => p?.organizationId === customer.organizationId)
    if (orgProducts.length === 0) continue
    
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        userId: customer.id,
        organizationId: customer.organizationId,
        status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 5)] as any,
        paymentStatus: ['pending', 'paid', 'failed'][Math.floor(Math.random() * 3)] as any,
        shippingStatus: ['pending', 'preparing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)] as any,
        subtotal: 0, // Will be calculated after adding items
        taxAmount: 0,
        shippingAmount: 19.99,
        discountAmount: 0,
        totalAmount: 0, // Will be calculated after adding items
        currency: 'USD',
        notes: 'Customer order',
        paymentMethod: 'credit_card',
        shippingAddress: {
          name: customer.name,
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'United States'
        },
        billingAddress: {
          name: customer.name,
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'United States'
        },
      },
    })

    // Add order items
    let subtotal = 0
    const numItems = Math.floor(Math.random() * 3) + 1
    
    for (let j = 0; j < numItems; j++) {
      const product = orgProducts[Math.floor(Math.random() * orgProducts.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const price = product.price
      const total = price * quantity
      
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          price,
          total,
        },
      })
      
      subtotal += total
    }
    
    // Update order totals
    const taxAmount = subtotal * 0.08 // 8% tax
    const totalAmount = subtotal + taxAmount + 19.99 // shipping
    
    await prisma.order.update({
      where: { id: order.id },
      data: {
        subtotal,
        taxAmount,
        totalAmount,
      },
    })

    orders.push(order)
  }

  return orders
}

async function createReviews(products: any[], users: any[]) {
  console.log('⭐ Creating product reviews...')
  
  const customerUsers = users.filter(u => u?.role === 'user')
  
  for (let i = 0; i < 10; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const customer = customerUsers[Math.floor(Math.random() * customerUsers.length)]
    
    if (!product || !customer) continue
    
    const reviewTexts = [
      'Great quality product! Highly recommended.',
      'Excellent craftsmanship and fast delivery.',
      'Good value for money. Very satisfied.',
      'Beautiful design and sturdy construction.',
      'Perfect addition to our home. Love it!',
    ]
    
    await prisma.review.create({
      data: {
        content: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        productId: product.id,
        userId: customer.id,
      },
    })
  }
}

async function createStoreSettings(organizations: any) {
  console.log('⚙️ Creating store settings...')
  
  const storeConfigs = [
    {
      org: organizations.org1,
      config: {
        storeName: 'FurnerIO - Premium Furniture Store',
        storeUrl: 'https://furnerio-premium.storely.com',
        primaryColor: '#8B4513',
        secondaryColor: '#556B7D',
        currency: 'USD',
        timezone: 'America/New_York',
        metaTitle: 'FurnerIO - Premium Furniture Store',
        metaDescription: 'Discover premium furniture for your home and office.',
      }
    },
    {
      org: organizations.org2,
      config: {
        storeName: 'ModernSpace - Contemporary Furniture',
        storeUrl: 'https://modernspace.storely.com',
        primaryColor: '#2C3E50',
        secondaryColor: '#34495E',
        currency: 'USD',
        timezone: 'America/Los_Angeles',
        metaTitle: 'ModernSpace - Contemporary Furniture',
        metaDescription: 'Modern and contemporary furniture for urban living.',
      }
    }
  ]

  for (const { org, config } of storeConfigs) {
    if (!org) continue
    
    await prisma.storeSettings.create({
      data: {
        organizationId: org.id,
        storeName: config.storeName,
        storeUrl: config.storeUrl,
        logo: org.logo,
        favicon: org.logo,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        fontFamily: 'Inter',
        currency: config.currency,
        timezone: config.timezone,
        language: 'en',
        metaTitle: config.metaTitle,
        metaDescription: config.metaDescription,
        metaKeywords: 'furniture, home decor, premium furniture',
        socialMediaLinks: {
          facebook: `https://facebook.com/${org.subdomain}`,
          twitter: `https://twitter.com/${org.subdomain}`,
          instagram: `https://instagram.com/${org.subdomain}`,
        },
        contactInfo: {
          phone: '+1-800-FURNITURE',
          email: `hello@${org.subdomain}.com`,
          address: '123 Furniture Ave, Design City, DC 12345',
        },
        businessHours: {
          monday: '9:00 AM - 8:00 PM',
          tuesday: '9:00 AM - 8:00 PM',
          wednesday: '9:00 AM - 8:00 PM',
          thursday: '9:00 AM - 8:00 PM',
          friday: '9:00 AM - 8:00 PM',
          saturday: '10:00 AM - 6:00 PM',
          sunday: '12:00 PM - 5:00 PM',
        },
      },
    })
  }
}

async function createThemeSettings(organizations: any) {
  console.log('🎨 Creating theme settings...')
  
  for (const org of [organizations.org1, organizations.org2].filter(Boolean)) {
    await prisma.themeSettings.create({
      data: {
        organizationId: org.id,
        themeName: `${org.name} Theme`,
        colorScheme: 'light',
        primaryColor: org.id === organizations.org1?.id ? '#8B4513' : '#2C3E50',
        secondaryColor: org.id === organizations.org1?.id ? '#556B7D' : '#34495E',
        accentColor: '#1976D2',
        fontPrimary: 'Inter',
        fontSecondary: 'Inter',
        borderRadius: 8,
        spacing: 8,
        shadows: true,
        customCSS: `/* Custom styles for ${org.name} */`,
        layout: {
          header: 'fixed',
          sidebar: 'collapsible',
          footer: 'minimal',
        },
        components: {
          buttons: { style: 'rounded' },
          cards: { shadow: 'medium' },
          forms: { style: 'outlined' },
        },
      },
    })
  }
}

async function createNavigationMenus(organizations: any) {
  console.log('🧭 Creating navigation menus...')
  
  for (const org of [organizations.org1, organizations.org2].filter(Boolean)) {
    await prisma.navigationMenu.create({
      data: {
        organizationId: org.id,
        name: 'Main Header Menu',
        type: 'header',
        items: [
          { label: 'Home', url: '/', type: 'page' },
          { label: 'Furniture', url: '/categories/furniture', type: 'category' },
          { label: 'About', url: '/about', type: 'page' },
          { label: 'Contact', url: '/contact', type: 'page' },
        ],
        isActive: true,
        position: 1,
      },
    })

    await prisma.navigationMenu.create({
      data: {
        organizationId: org.id,
        name: 'Footer Menu',
        type: 'footer',
        items: [
          { label: 'Privacy Policy', url: '/privacy', type: 'page' },
          { label: 'Terms of Service', url: '/terms', type: 'page' },
          { label: 'Return Policy', url: '/returns', type: 'page' },
        ],
        isActive: true,
        position: 1,
      },
    })
  }
}

async function createInvitations(organizations: any, users: any[]) {
  console.log('✉️ Creating invitations...')
  
  const orgAdmins = users.filter(u => u?.role === 'org_admin')
  
  for (const admin of orgAdmins) {
    if (!admin) continue
    
    await prisma.invitation.create({
      data: {
        email: `newuser@${admin.organizationId}.com`,
        role: 'org_user',
        organizationId: admin.organizationId,
        invitedById: admin.id,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    })
  }
}

async function createNotifications(users: any[]) {
  console.log('🔔 Creating notifications...')
  
  for (const user of users) {
    if (!user) continue
    
    const notificationTypes = ['order_created', 'order_shipped', 'welcome', 'low_stock', 'general']
    const notifications = [
      { title: 'Welcome to the platform!', description: 'Thanks for joining us.' },
      { title: 'Order shipped', description: 'Your order has been shipped and is on its way.' },
      { title: 'New product available', description: 'Check out our latest furniture collection.' },
      { title: 'Low stock alert', description: 'Some products are running low on stock.' },
    ]
    
    for (let i = 0; i < Math.min(3, notifications.length); i++) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as any,
          title: notifications[i].title,
          description: notifications[i].description,
          isRead: Math.random() > 0.5,
          isArchived: false,
          metadata: { source: 'system' },
        },
      })
    }
  }
}

async function createAnalyticsAndReports(organizations: any) {
  console.log('📊 Creating analytics and reports...')
  
  for (const org of [organizations.org1, organizations.org2].filter(Boolean)) {
    // Create analytics events
    const eventTypes = ['page_view', 'product_view', 'add_to_cart', 'purchase']
    
    for (let i = 0; i < 20; i++) {
      await prisma.analyticsEvent.create({
        data: {
          organizationId: org.id,
          eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          eventData: {
            page: '/products',
            product_id: 'sample-product-id',
            value: Math.random() * 100,
          },
          sessionId: `session-${Math.random().toString(36).substring(7)}`,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (compatible)',
          referrer: 'https://google.com',
        },
      })
    }

    // Create sales reports
    for (let i = 0; i < 7; i++) {
      const reportDate = new Date()
      reportDate.setDate(reportDate.getDate() - i)
      
      await prisma.salesReport.create({
        data: {
          organizationId: org.id,
          reportDate,
          totalSales: Math.random() * 10000 + 1000,
          totalOrders: Math.floor(Math.random() * 50) + 10,
          averageOrderValue: Math.random() * 200 + 50,
          newCustomers: Math.floor(Math.random() * 20) + 5,
          returningCustomers: Math.floor(Math.random() * 30) + 10,
          conversionRate: Math.random() * 0.1 + 0.02, // 2-12%
          reportData: {
            topProducts: ['chair-1', 'table-1', 'sofa-1'],
            revenue: Math.random() * 15000 + 2000,
          },
        },
      })
    }
  }
}

// Main seeder function
async function main() {
  console.log('🌱 Starting comprehensive database seeding...')
  console.log('🧹 Note: Using conflict-safe approach - existing records will be skipped')

  try {
    // Create core data
    const organizations = await createOrganizations()
    const superUsers = await createSuperUsers()
    const orgUsers = await createOrgUsers(organizations)
    const allUsers = [...Object.values(superUsers), ...orgUsers].filter(Boolean)
    
    // Create supporting data
    const stores = await createStores(organizations)
    const addresses = await createAddresses(allUsers)
    const categories = await createCategories(organizations)
    const products = await createProducts(organizations, categories)
    
    // Create inventory and commerce data
    await createInventory(products)
    const carts = await createCarts(allUsers)
    const orders = await createOrders(organizations, allUsers, products)
    await createReviews(products, allUsers)
    
    // Create configuration data
    await createStoreSettings(organizations)
    await createThemeSettings(organizations)
    await createNavigationMenus(organizations)
    
    // Create additional data
    await createInvitations(organizations, allUsers)
    await createNotifications(allUsers)
    await createAnalyticsAndReports(organizations)

    console.log('✅ Comprehensive seed data created successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Organizations: ${Object.values(organizations).filter(Boolean).length}`)
    console.log(`   - Super Users: ${Object.values(superUsers).filter(Boolean).length}`)
    console.log(`   - Org Users: ${orgUsers.filter(Boolean).length}`)
    console.log(`   - Total Users: ${allUsers.length}`)
    console.log(`   - Stores: ${stores.length}`)
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Addresses: ${addresses.length}`)
    console.log(`   - Orders: ${orders.length}`)
    console.log(`   - Shopping Carts: ${carts.length}`)
    console.log(`   - Store Settings: ${Object.values(organizations).filter(Boolean).length}`)
    console.log(`   - Theme Settings: ${Object.values(organizations).filter(Boolean).length}`)
    console.log(`   - Navigation Menus: ${Object.values(organizations).filter(Boolean).length * 2}`)
    
  } catch (error) {
    console.error('❌ Error during comprehensive seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
