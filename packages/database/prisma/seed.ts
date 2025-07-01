import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a demo organization
  const organization = await prisma.organization.upsert({
    where: { name: 'Demo Store' },
    update: {},
    create: {
      name: 'Demo Store',
      subdomain: 'demo',
      plan: 'premium',
      logo: 'https://example.com/logo.png',
    },
  })

  console.log('✅ Created organization:', organization.name)

  // Create demo categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        organizationId: organization.id,
        image: 'https://example.com/electronics.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        organizationId: organization.id,
        image: 'https://example.com/clothing.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        organizationId: organization.id,
        image: 'https://example.com/home-garden.jpg',
      },
    }),
  ])

  console.log('✅ Created categories:', categories.map(c => c.name).join(', '))

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demostore.com' },
    update: {},
    create: {
      email: 'admin@demostore.com',
      name: 'Store Admin',
      password: hashedPassword,
      role: 'org_admin',
      organizationId: organization.id,
      emailVerified: new Date(),
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@demostore.com' },
    update: {},
    create: {
      email: 'user@demostore.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'user',
      organizationId: organization.id,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created users:', [adminUser.email, demoUser.email].join(', '))

  // Create demo products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PHONE-001' },
      update: {},
      create: {
        name: 'Smartphone Pro Max',
        slug: 'smartphone-pro-max',
        sku: 'PHONE-001',
        price: 999.99,
        comparePrice: 1199.99,
        mrp: 1199.99,
        cost: 600.00,
        categoryId: categories[0].id,
        organizationId: organization.id,
        status: 'active',
        featured: true,
        quantity: 50,
        lowStockAlert: 10,
        content: 'Latest smartphone with advanced features and premium design.',
        subDescription: 'High-performance smartphone with excellent camera',
        images: [
          'https://example.com/phone1.jpg',
          'https://example.com/phone2.jpg'
        ],
        tags: ['smartphone', 'mobile', 'electronics'],
        metaTitle: 'Smartphone Pro Max - Latest Technology',
        metaDescription: 'Experience the latest in smartphone technology with our Pro Max model.',
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SHIRT-001' },
      update: {},
      create: {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        sku: 'SHIRT-001',
        price: 29.99,
        comparePrice: 39.99,
        mrp: 39.99,
        cost: 15.00,
        categoryId: categories[1].id,
        organizationId: organization.id,
        status: 'active',
        quantity: 100,
        lowStockAlert: 20,
        content: 'Comfortable cotton t-shirt perfect for everyday wear.',
        subDescription: '100% organic cotton, soft and breathable',
        images: [
          'https://example.com/shirt1.jpg',
          'https://example.com/shirt2.jpg'
        ],
        tags: ['clothing', 'cotton', 'casual'],
        saleLabel: '25% OFF',
      },
    }),
    prisma.product.upsert({
      where: { sku: 'CHAIR-001' },
      update: {},
      create: {
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        sku: 'CHAIR-001',
        price: 299.99,
        mrp: 299.99,
        cost: 150.00,
        categoryId: categories[2].id,
        organizationId: organization.id,
        status: 'active',
        quantity: 25,
        lowStockAlert: 5,
        content: 'Professional office chair with ergonomic design for maximum comfort.',
        subDescription: 'Adjustable height, lumbar support, premium materials',
        images: [
          'https://example.com/chair1.jpg',
          'https://example.com/chair2.jpg'
        ],
        tags: ['furniture', 'office', 'ergonomic'],
        newLabel: 'NEW',
      },
    }),
  ])

  console.log('✅ Created products:', products.map(p => p.name).join(', '))

  // Create product variants for the t-shirt
  const tshirtVariants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: products[1].id,
        name: 'Size',
        value: 'Small',
        sku: 'SHIRT-001-S',
        quantity: 30,
        attributes: { size: 'S', color: 'Blue' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products[1].id,
        name: 'Size',
        value: 'Medium',
        sku: 'SHIRT-001-M',
        quantity: 40,
        attributes: { size: 'M', color: 'Blue' },
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products[1].id,
        name: 'Size',
        value: 'Large',
        sku: 'SHIRT-001-L',
        quantity: 30,
        attributes: { size: 'L', color: 'Blue' },
      },
    }),
  ])

  console.log('✅ Created product variants for t-shirt')

  // Create store settings
  const storeSettings = await prisma.storeSettings.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      storeName: 'Demo Store',
      storeUrl: 'https://demo.storely.com',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en',
      metaTitle: 'Demo Store - Your One-Stop Shop',
      metaDescription: 'Discover amazing products at Demo Store. Quality guaranteed.',
      contactInfo: {
        email: 'contact@demostore.com',
        phone: '+1-555-0123',
        address: '123 Demo Street, Demo City, DC 12345'
      },
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      }
    },
  })

  console.log('✅ Created store settings')

  // Create theme settings
  const themeSettings = await prisma.themeSettings.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      themeName: 'modern',
      colorScheme: 'light',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#16a34a',
      fontPrimary: 'Inter',
      fontSecondary: 'Inter',
      borderRadius: 8,
      spacing: 16,
      shadows: true,
    },
  })

  console.log('✅ Created theme settings')

  // Create a demo address for the user
  const address = await prisma.address.create({
    data: {
      userId: demoUser.id,
      name: 'John Doe',
      phone: '+1-555-0123',
      street: '123 Main Street',
      house: 'Apt 4B',
      city: 'Demo City',
      state: 'Demo State',
      country: 'United States',
      zip: '12345',
      type: 'home',
      isDefault: true,
    },
  })

  console.log('✅ Created demo address')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
