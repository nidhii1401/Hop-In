import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateAvatars() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { avatarUrl: null },
        { avatarUrl: '' }
      ]
    }
  });

  for (const user of users) {
    const seed = user.fullName?.replace(/\s+/g, '') || user.email || 'default';
    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`
      }
    });
  }
  
  console.log(`Updated ${users.length} users`);
}

updateAvatars()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });