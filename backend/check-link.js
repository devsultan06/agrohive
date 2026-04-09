const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'sultanabaniks@gmail.com' },
      select: { id: true, fullName: true, telegramId: true }
    });
    console.log('Result:', JSON.stringify(user, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
