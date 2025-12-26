const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDataConsistency() {
  console.log('=== CHECKING DATA CONSISTENCY ===');
  
  try {
    // 1. Check for stays without endDate but with status 'LEFT'
    const inconsistentStays = await prisma.stay.findMany({
      where: {
        status: 'LEFT',
        endDate: null
      }
    });
    
    console.log(`Found ${inconsistentStays.length} stays with status 'LEFT' but null endDate:`);
    inconsistentStays.forEach(stay => {
      console.log(`  Stay ID: ${stay.id}, Hosteller: ${stay.hostellerId}, Status: ${stay.status}, EndDate: ${stay.endDate}`);
    });
    
    // 2. Check for stays with status 'ACTIVE' but with endDate
    const activeStaysWithEndDate = await prisma.stay.findMany({
      where: {
        status: 'ACTIVE',
        NOT: {
          endDate: null
        }
      }
    });
    
    console.log(`Found ${activeStaysWithEndDate.length} stays with status 'ACTIVE' but have endDate:`);
    activeStaysWithEndDate.forEach(stay => {
      console.log(`  Stay ID: ${stay.id}, Hosteller: ${stay.hostellerId}, Status: ${stay.status}, EndDate: ${stay.endDate}`);
    });
    
    // 3. Check for users with stays but missing hostellerProfile
    const hostellersWithStaysButNoProfile = await prisma.user.findMany({
      where: {
        role: 'HOSTELLER',
        stays: {
          some: {}
        }
      },
      include: {
        hostellerProfile: true
      }
    });
    
    const missingProfile = hostellersWithStaysButNoProfile.filter(user => !user.hostellerProfile);
    console.log(`Found ${missingProfile.length} hostellers with stays but no hostellerProfile:`);
    missingProfile.forEach(user => {
      console.log(`  User ID: ${user.id}, Email: ${user.email}, Has Profile: ${!!user.hostellerProfile}`);
    });
    
    // 4. Fix inconsistent stays
    if (inconsistentStays.length > 0) {
      console.log('Fixing inconsistent stays...');
      await prisma.stay.updateMany({
        where: {
          id: { in: inconsistentStays.map(s => s.id) }
        },
        data: {
          endDate: new Date()
        }
      });
      console.log(`Fixed ${inconsistentStays.length} inconsistent stays`);
    }
    
    if (activeStaysWithEndDate.length > 0) {
      console.log('Fixing active stays with endDate...');
      await prisma.stay.updateMany({
        where: {
          id: { in: activeStaysWithEndDate.map(s => s.id) }
        },
        data: {
          endDate: null
        }
      });
      console.log(`Fixed ${activeStaysWithEndDate.length} active stays with endDate`);
    }
    
    console.log('=== DATA CONSISTENCY CHECK COMPLETE ===');
    
  } catch (error) {
    console.error('Error checking data consistency:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDataConsistency();
