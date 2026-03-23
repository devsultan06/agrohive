import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MARKET_PRODUCTS = [
  {
    name: 'Rotavator',
    rating: 4.8,
    price: 899000.0,
    imageUrl:
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
    category: 'New Products',
    description:
      'Heavy-duty rotavator designed for efficient soil preparation. Features multiple blade configurations for varying soil types.',
  },
  {
    name: 'EcoWagon',
    rating: 4.5,
    price: 450000.0,
    imageUrl:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    category: 'New Products',
    description:
      'Eco-friendly agricultural wagon perfect for transporting crops and tools across the farm with minimal effort.',
  },
  {
    name: 'Mini Tractor',
    rating: 4.2,
    price: 8500000.0,
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    category: 'New Products',
    description:
      'Versatile mini tractor ideal for small to medium farms. Compact design makes it easy to maneuver in tight spaces.',
  },
  {
    name: 'Mini Tractor (Used)',
    rating: 3.8,
    price: 4500000.0,
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    category: 'UK Used',
    description:
      'Reliable UK Used mini tractor. Fully serviced and ready for field work. Great value for cost-conscious farmers.',
  },
  {
    name: 'Drone Sprayer',
    rating: 5.0,
    price: 1200000.0,
    imageUrl:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    category: 'New Products',
    description:
      'High-precision drone sprayer ensuring uniform application of fertilizers and pesticides while protecting your health.',
  },
  {
    name: 'Seed planter machine',
    rating: 4.0,
    price: 320000.0,
    imageUrl:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
    category: 'UK Used',
    description:
      'Precision seed planter that ensures optimal depth and spacing for various seed types, significantly improving germination rates.',
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Admin Users to seed
  const adminUsers = [
    {
      email: 'admin@agrohive.com',
      fullName: 'AgroHive Admin',
      username: 'admin',
      role: UserRole.ADMIN,
    },
    {
      email: 'super@agrohive.com',
      fullName: 'Super Admin',
      username: 'superadmin',
      role: UserRole.SUPER_ADMIN,
    },
    {
      email: 'manager@agrohive.com',
      fullName: 'Product Manager',
      username: 'manager',
      role: UserRole.MANAGER,
    },
    {
      email: 'support@agrohive.com',
      fullName: 'Support Agent',
      username: 'support',
      role: UserRole.SUPPORT,
    },
  ];

  for (const user of adminUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
          isVerified: true,
        },
      });
      console.log(`👤 User created: ${user.email} (${user.role})`);
    } else {
      console.log(`⏭️ User ${user.email} already exists, skipping.`);
    }
  }

  // Seed Products
  console.log('📦 Seeding products...');
  for (const product of MARKET_PRODUCTS) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });
    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
