const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function comprehensiveDataCheck() {
  console.log('=== COMPREHENSIVE DATA CONSISTENCY CHECK ===');
  
  try {
    // 1. Check Users vs HostellerProfiles
    console.log('\n--- Users vs HostellerProfiles ---');
    const allHostellers = await prisma.user.findMany({
      where: { role: 'HOSTELLER' },
      include: { hostellerProfile: true, stays: true }
    });
    
    const hostellersWithoutProfile = allHostellers.filter(u => !u.hostellerProfile);
    const hostellersWithProfile = allHostellers.filter(u => u.hostellerProfile);
    
    console.log(`Total hostellers: ${allHostellers.length}`);
    console.log(`Hostellers WITHOUT profile: ${hostellersWithoutProfile.length}`);
    console.log(`Hostellers WITH profile: ${hostellersWithProfile.length}`);
    
    hostellersWithoutProfile.forEach(hosteller => {
      console.log(`  ❌ User ID: ${hosteller.id}, Email: ${hosteller.email}`);
      console.log(`  Stays count: ${hosteller.stays?.length || 0}`);
    });
    
    // 2. Check Stays consistency
    console.log('\n--- Stays Data Consistency ---');
    const allStays = await prisma.stay.findMany({
      include: {
        hosteller: { select: { id: true, fullName: true, email: true } },
        room: { select: { roomNumber: true } },
        hostel: { select: { name: true } }
      }
    });
    
    // Check for inconsistent stays
    const inconsistentStays = allStays.filter(stay => {
      const isLeft = stay.status === 'LEFT';
      const hasEndDate = stay.endDate !== null;
      const isActive = stay.status === 'ACTIVE';
      const hasNoEndDate = stay.endDate === null;
      
      return (isLeft && !hasEndDate) || (isActive && hasEndDate) || (isLeft && hasNoEndDate);
    });
    
    console.log(`Total stays: ${allStays.length}`);
    console.log(`Inconsistent stays: ${inconsistentStays.length}`);
    
    inconsistentStays.forEach(stay => {
      console.log(`  ❌ Stay ID: ${stay.id}`);
      console.log(`    Hosteller: ${stay.hosteller?.fullName} (${stay.hostellerId})`);
      console.log(`    Status: ${stay.status}`);
      console.log(`    EndDate: ${stay.endDate}`);
      console.log(`    Room: ${stay.room?.roomNumber}`);
      console.log(`    Hostel: ${stay.hostel?.name}`);
    });
    
    // 3. Check Room data
    console.log('\n--- Rooms Data ---');
    const allRooms = await prisma.room.findMany({
      include: {
        stays: { where: { status: 'ACTIVE' } },
        hostel: { select: { name: true } }
      }
    });
    
    const roomsWithIssues = allRooms.filter(room => {
      const activeStays = room.stays || [];
      return activeStays.length > room.capacity;
    });
    
    console.log(`Total rooms: ${allRooms.length}`);
    console.log(`Over capacity rooms: ${roomsWithIssues.length}`);
    
    roomsWithIssues.forEach(room => {
      console.log(`  ❌ Room: ${room.roomNumber} (Capacity: ${room.capacity}, Active: ${room.stays?.length || 0})`);
    });
    
    // 4. Check Hostel data
    console.log('\n--- Hostel Data ---');
    const allHostels = await prisma.hostel.findMany({
      include: {
        owner: { select: { id: true, fullName: true } },
        rooms: { select: { roomNumber: true } },
        stays: {
          where: { status: 'ACTIVE' }
        }
      }
    });
    
    const hostelsWithIssues = allHostels.filter(hostel => {
      const activeStays = hostel.rooms?.flatMap(room => room.stays || []) || [];
      const totalCapacity = hostel.rooms?.reduce((sum, room) => sum + (room.capacity || 0), 0);
      return activeStays.length > totalCapacity;
    });
    
    console.log(`Total hostels: ${allHostels.length}`);
    console.log(`Over capacity hostels: ${hostelsWithIssues.length}`);
    
    hostelsWithIssues.forEach(hostel => {
      const activeStays = hostel.rooms?.flatMap(room => room.stays || []) || [];
      const totalCapacity = hostel.rooms?.reduce((sum, room) => sum + (room.capacity || 0), 0);
      console.log(`  ❌ Hostel: ${hostel.name} (Owner: ${hostel.owner?.fullName})`);
      console.log(`    Capacity: ${totalCapacity}, Active: ${activeStays.length}`);
    });
    
    console.log('\n=== CONSISTENCY CHECK COMPLETE ===');
    
  } catch (error) {
    console.error('Error during consistency check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

comprehensiveDataCheck();
