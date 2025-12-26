const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMissingHostellerProfiles() {
  console.log('=== CREATING MISSING HOSTELLER PROFILES ===');
  
  try {
    // Users who need hostellerProfile records (from our data check)
    const usersNeedingProfiles = [
      { id: 9, email: 'nidhichaudhary1617@gmail.com' },
      { id: 10, email: 'hefelix346@gamintor.com' },
      { id: 21, email: 'nezuko.142004@gmail.com' }
    ];
    
    console.log(`Creating profiles for ${usersNeedingProfiles.length} users...`);
    
    for (const user of usersNeedingProfiles) {
      // Check if profile already exists
      const existingProfile = await prisma.hostellerProfile.findUnique({
        where: { userId: user.id }
      });
      
      if (existingProfile) {
        console.log(`✅ Profile already exists for user ${user.id}`);
        continue;
      }
      
      // Create minimal hostellerProfile
      const newProfile = await prisma.hostellerProfile.create({
        data: {
          userId: user.id,
          collegeName: 'Not specified',
          course: 'Not specified', 
          branch: 'Not specified',
          yearOfStudy: 'Not specified',
          bio: null
        }
      });
      
      console.log(`✅ Created profile for user ${user.id}: ${newProfile.id}`);
    }
    
    console.log('\n=== PROFILE CREATION COMPLETE ===');
    
  } catch (error) {
    console.error('Error creating profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingHostellerProfiles();
