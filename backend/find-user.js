const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'sultanabaniks@gmail.com' },
    select: { id: true, fullName: true }
  });
  console.log('USER_DETAILS:', JSON.stringify(user));
  await prisma.$disconnect();
}

findUser();
