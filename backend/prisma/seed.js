import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Amenities data
const amenities = [
  { keyName: 'WIFI', displayName: 'WiFi', scope: 'BOTH' },
  { keyName: 'AC', displayName: 'AC', scope: 'HOSTEL' },
  { keyName: 'LAUNDRY', displayName: 'Laundry', scope: 'BOTH' },
  { keyName: 'POWER_BACKUP', displayName: 'Power Backup', scope: 'HOSTEL' },
  { keyName: 'CCTV', displayName: 'CCTV', scope: 'HOSTEL' },
  { keyName: 'GYM', displayName: 'Gym', scope: 'BOTH' },
  { keyName: 'PARKING', displayName: 'Parking', scope: 'HOSTEL' },
  { keyName: 'KITCHEN', displayName: 'Kitchen', scope: 'HOSTEL' },
  { keyName: 'STUDY_ROOM', displayName: 'Study Room', scope: 'BOTH' },
  { keyName: 'COMMON_ROOM', displayName: 'Common Room', scope: 'HOSTEL' },
  { keyName: 'HOT_WATER', displayName: 'Hot Water', scope: 'BOTH' },
  { keyName: 'CLEANING_SERVICE', displayName: 'Cleaning Service', scope: 'HOSTEL' },
  { keyName: 'BED', displayName: 'Bed', scope: 'ROOM' },
  { keyName: 'MATTRESS', displayName: 'Mattress', scope: 'ROOM' },
  { keyName: 'STUDY_TABLE', displayName: 'Study Table', scope: 'ROOM' },
  { keyName: 'WARDROBE', displayName: 'Wardrobe', scope: 'ROOM' }
];

// Users data
const users = [
  {
    fullName: 'John Doe Hostel Owner',
    email: 'owner@hopin.com',
    phone: '+919876543210',
    password: 'password123',
    role: 'OWNER'
  },
  {
    fullName: 'Admin User',
    email: 'admin@hopin.com',
    phone: '+919876543212',
    password: 'password123',
    role: 'ADMIN'
  },
  // 10 Verified Hostellers with complete profiles
  {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@hopin.com',
    phone: '+919876543213',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Rahul Kumar',
    email: 'rahul.kumar@hopin.com',
    phone: '+919876543214',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Ananya Reddy',
    email: 'ananya.reddy@hopin.com',
    phone: '+919876543215',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Vikram Singh',
    email: 'vikram.singh@hopin.com',
    phone: '+919876543216',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Kavya Nair',
    email: 'kavya.nair@hopin.com',
    phone: '+919876543217',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Arjun Patel',
    email: 'arjun.patel@hopin.com',
    phone: '+919876543218',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Divya Gupta',
    email: 'divya.gupta@hopin.com',
    phone: '+919876543219',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Rohit Verma',
    email: 'rohit.verma@hopin.com',
    phone: '+919876543220',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Meera Joshi',
    email: 'meera.joshi@hopin.com',
    phone: '+919876543221',
    password: 'password123',
    role: 'HOSTELLER'
  },
  {
    fullName: 'Karan Malhotra',
    email: 'karan.malhotra@hopin.com',
    phone: '+919876543222',
    password: 'password123',
    role: 'HOSTELLER'
  }
];

// Hostels data with rooms
const hostels = [
  {
    name: 'Sunshine Hostel & PG',
    description: 'A premium hostel facility with modern amenities, 24/7 security, and comfortable living spaces for students.',
    addressLine: '123, Main Road, Near Metro Station',
    area: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    landmark: 'Opposite Forum Mall',
    nearCollege: 'Christ University',
    genderType: 'COED',
    messType: 'COMPULSORY',
    messPricePerMonth: 3500,
    messDescription: 'Veg and Non-veg options, 3 meals per day + tea/coffee',
    rules: 'No smoking, No alcohol, Quiet hours 10PM-6AM, Visitors allowed until 8PM',
    amenities: [1, 2, 4, 5, 7, 11], // WiFi, AC, Power Backup, CCTV, Parking, Hot Water
    rooms: [
      // Single rooms
      { roomNumber: '101', floor: '1', roomType: 'SINGLE', capacity: 1, pricePerMonth: 8000 },
      { roomNumber: '102', floor: '1', roomType: 'SINGLE', capacity: 1, pricePerMonth: 8000 },
      { roomNumber: '103', floor: '1', roomType: 'SINGLE', capacity: 1, pricePerMonth: 8000 },
      // Double rooms
      { roomNumber: '201', floor: '2', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6000 },
      { roomNumber: '202', floor: '2', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6000 },
      { roomNumber: '203', floor: '2', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6000 },
      { roomNumber: '204', floor: '2', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6000 },
      // Triple rooms
      { roomNumber: '301', floor: '3', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 4500 },
      { roomNumber: '302', floor: '3', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 4500 },
      { roomNumber: '303', floor: '3', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 4500 }
    ]
  },
  {
    name: 'Blue Sky Boys Hostel',
    description: 'Comfortable and affordable hostel for male students with all basic amenities.',
    addressLine: '45 West Side, Near Metro Station',
    area: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    landmark: 'Near 100 Feet Road',
    nearCollege: 'Bangalore University',
    genderType: 'BOYS',
    messType: 'OPTIONAL',
    messPricePerMonth: 2500,
    messDescription: 'Veg meals, 2 times per day',
    rules: 'No smoking, Quiet hours 11PM-6AM, Visitors allowed on weekends',
    amenities: [1, 3, 4, 6, 10], // WiFi, Laundry, Power Backup, Gym, Common Room
    rooms: [
      // Double rooms
      { roomNumber: 'A1', floor: 'Ground', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 5000 },
      { roomNumber: 'A2', floor: 'Ground', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 5000 },
      // Triple rooms
      { roomNumber: 'B1', floor: '1', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 3500 },
      { roomNumber: 'B2', floor: '1', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 3500 },
      { roomNumber: 'B3', floor: '1', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 3500 },
      // Single rooms
      { roomNumber: 'C1', floor: '2', roomType: 'SINGLE', capacity: 1, pricePerMonth: 7000 },
      { roomNumber: 'C2', floor: '2', roomType: 'SINGLE', capacity: 1, pricePerMonth: 7000 }
    ]
  },
  {
    name: 'Rose Garden Girls Hostel',
    description: 'Safe and secure hostel for female students with homely atmosphere.',
    addressLine: '78, Ladies Colony',
    area: 'HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    landmark: 'Near BDA Complex',
    nearCollege: 'PES University',
    genderType: 'GIRLS',
    messType: 'COMPULSORY',
    messPricePerMonth: 3000,
    messDescription: 'Pure vegetarian meals, 3 times per day + evening snacks',
    rules: 'Strict security, No male visitors after 8PM, Quiet hours 10PM-6AM',
    amenities: [1, 2, 3, 4, 8, 11, 12], // WiFi, AC, Laundry, Power Backup, Kitchen, Hot Water, Cleaning Service
    rooms: [
      // Single rooms
      { roomNumber: 'G1', floor: 'Ground', roomType: 'SINGLE', capacity: 1, pricePerMonth: 9000 },
      { roomNumber: 'G2', floor: 'Ground', roomType: 'SINGLE', capacity: 1, pricePerMonth: 9000 },
      // Double rooms
      { roomNumber: 'F1', floor: '1', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6500 },
      { roomNumber: 'F2', floor: '1', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6500 },
      { roomNumber: 'F3', floor: '1', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6500 },
      { roomNumber: 'F4', floor: '1', roomType: 'DOUBLE', capacity: 2, pricePerMonth: 6500 },
      // Triple rooms
      { roomNumber: 'S1', floor: '2', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 5000 },
      { roomNumber: 'S2', floor: '2', roomType: 'TRIPLE', capacity: 3, pricePerMonth: 5000 }
    ]
  }
];

// Hosteller profile data with complete details
const hostellerProfiles = [
  {
    userId: 'priya.sharma@hopin.com',
    collegeName: 'Christ University',
    course: 'Computer Science Engineering',
    branch: 'Artificial Intelligence',
    yearOfStudy: '3rd Year',
    bio: 'Looking for a comfortable hostel near campus with good study environment.'
  },
  {
    userId: 'rahul.kumar@hopin.com',
    collegeName: 'Bangalore University',
    course: 'B.Com',
    branch: 'Finance',
    yearOfStudy: '2nd Year',
    bio: 'Need a clean and affordable hostel with good mess facility.'
  },
  {
    userId: 'ananya.reddy@hopin.com',
    collegeName: 'PES University',
    course: 'B.Tech',
    branch: 'Information Science',
    yearOfStudy: '4th Year',
    bio: 'Final year student looking for peaceful accommodation near college.'
  },
  {
    userId: 'vikram.singh@hopin.com',
    collegeName: 'RV College of Engineering',
    course: 'Mechanical Engineering',
    branch: 'Automobile',
    yearOfStudy: '3rd Year',
    bio: 'Sports enthusiast looking for hostel with gym facilities.'
  },
  {
    userId: 'kavya.nair@hopin.com',
    collegeName: 'Mount Carmel College',
    course: 'B.Sc',
    branch: 'Mathematics',
    yearOfStudy: '2nd Year',
    bio: 'Looking for girls hostel with good security and study environment.'
  },
  {
    userId: 'arjun.patel@hopin.com',
    collegeName: 'MSRIT',
    course: 'B.E',
    branch: 'Electronics & Communication',
    yearOfStudy: '3rd Year',
    bio: 'Need hostel with good WiFi and backup power for projects.'
  },
  {
    userId: 'divya.gupta@hopin.com',
    collegeName: 'Jain University',
    course: 'MBA',
    branch: 'Marketing',
    yearOfStudy: '1st Year',
    bio: 'Postgraduate student looking for peaceful accommodation.'
  },
  {
    userId: 'rohit.verma@hopin.com',
    collegeName: 'BMS College of Engineering',
    course: 'B.E',
    branch: 'Computer Science',
    yearOfStudy: '2nd Year',
    bio: 'Looking for hostel with good mess and laundry facilities.'
  },
  {
    userId: 'meera.joshi@hopin.com',
    collegeName: 'Christ University',
    course: 'BA',
    branch: 'Psychology',
    yearOfStudy: '3rd Year',
    bio: 'Need hostel near campus with good study environment.'
  },
  {
    userId: 'karan.malhotra@hopin.com',
    collegeName: 'Bangalore Institute of Technology',
    course: 'B.E',
    branch: 'Civil Engineering',
    yearOfStudy: '4th Year',
    bio: 'Final year student looking for comfortable accommodation.'
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // 1. Seed Amenities
    console.log('Seeding amenities...');
    for (const amenity of amenities) {
      await prisma.amenity.upsert({
        where: { keyName: amenity.keyName },
        update: {},
        create: amenity
      });
    }

    // 2. Seed Users (with verification for hostellers)
    console.log('Seeding users...');
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const isVerified = userData.role === 'HOSTELLER'; // All hostellers are verified
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          passwordHash: hashedPassword,
          role: userData.role,
          isVerified: isVerified // Mark hostellers as verified
        }
      });
      createdUsers.push(user);
    }

    // 3. Seed Hosteller Profiles for all hostellers
    console.log('Seeding hosteller profiles...');
    const hostellerUsers = createdUsers.filter(u => u.role === 'HOSTELLER');
    
    for (const profileData of hostellerProfiles) {
      const user = createdUsers.find(u => u.email === profileData.userId);
      if (user) {
        await prisma.hostellerProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            collegeName: profileData.collegeName,
            course: profileData.course,
            branch: profileData.branch,
            yearOfStudy: profileData.yearOfStudy,
            bio: profileData.bio
          }
        });
      }
    }

    // 4. Seed Hostels with Rooms
    console.log('Seeding hostels with rooms...');
    const ownerUser = createdUsers.find(u => u.role === 'OWNER');
    
    for (const hostelData of hostels) {
      // Create hostel
      const hostel = await prisma.hostel.create({
        data: {
          ownerId: ownerUser.id,
          name: hostelData.name,
          description: hostelData.description,
          addressLine: hostelData.addressLine,
          area: hostelData.area,
          city: hostelData.city,
          state: hostelData.state,
          pincode: hostelData.pincode,
          landmark: hostelData.landmark,
          nearCollege: hostelData.nearCollege,
          genderType: hostelData.genderType,
          messType: hostelData.messType,
          messPricePerMonth: hostelData.messPricePerMonth,
          messDescription: hostelData.messDescription,
          rules: hostelData.rules,
          isActive: true
        }
      });

      // Create hostel amenities
      const hostelAmenities = hostelData.amenities.map(amenityId => ({
        hostelId: hostel.id,
        amenityId: amenityId
      }));
      await prisma.hostelAmenity.createMany({
        data: hostelAmenities
      });

      // Create rooms
      const rooms = hostelData.rooms.map(room => ({
        hostelId: hostel.id,
        roomNumber: room.roomNumber,
        floor: room.floor,
        roomType: room.roomType,
        capacity: room.capacity,
        pricePerMonth: room.pricePerMonth,
        isActive: true
      }));
      await prisma.room.createMany({
        data: rooms
      });

      // Add room amenities (basic amenities for all rooms)
      const createdRooms = await prisma.room.findMany({
        where: { hostelId: hostel.id }
      });

      const roomAmenities = [];
      const roomAmenityIds = [13, 14, 15, 16]; // Bed, Mattress, Study Table, Wardrobe

      for (const room of createdRooms) {
        for (const amenityId of roomAmenityIds) {
          roomAmenities.push({
            roomId: room.id,
            amenityId: amenityId
          });
        }
      }

      await prisma.roomAmenity.createMany({
        data: roomAmenities
      });

      console.log(`Created hostel: ${hostel.name} with ${hostelData.rooms.length} rooms`);
    }

    // 5. Create sample stays for multiple hostellers
    console.log('Creating sample stays...');
    const createdHostels = await prisma.hostel.findMany({
      include: { rooms: true }
    });
    const existingHostellerProfiles = await prisma.hostellerProfile.findMany({
      include: { user: true }
    });

    if (createdHostels.length > 0 && existingHostellerProfiles.length > 0) {
      // Create stays for first 5 hostellers
      const hostellersToUse = existingHostellerProfiles.slice(0, 5);
      
      for (let i = 0; i < hostellersToUse.length; i++) {
        const hostellerProfile = hostellersToUse[i];
        const hostel = createdHostels[i % createdHostels.length]; // Distribute across hostels
        const availableRoom = hostel.rooms.find(r => r.isActive);
        
        if (availableRoom) {
          await prisma.stay.create({
            data: {
              hosteller: {
                connect: { id: hostellerProfile.userId }
              },
              hostel: {
                connect: { id: hostel.id }
              },
              room: {
                connect: { id: availableRoom.id }
              },
              status: 'ACTIVE',
              startDate: new Date(),
              endDate: new Date(Date.now() + (90 + i * 10) * 24 * 60 * 60 * 1000), // Different durations
              isMessOpted: hostel.messType !== 'NONE',
              messPriceAtJoin: hostel.messPricePerMonth
            }
          });
          
          console.log(`Created stay for ${hostellerProfile.user.fullName} at ${hostel.name}`);
        }
      }
    }

    console.log('Database seeding completed successfully!');

    // Show summary
    const summary = await prisma.$transaction([
      prisma.user.count(),
      prisma.hostel.count(),
      prisma.room.count(),
      prisma.amenity.count(),
      prisma.hostellerProfile.count(),
      prisma.stay.count()
    ]);

    console.log('\n=== Database Summary ===');
    console.log(`Users: ${summary[0]}`);
    console.log(`Hostels: ${summary[1]}`);
    console.log(`Rooms: ${summary[2]}`);
    console.log(`Amenities: ${summary[3]}`);
    console.log(`Hosteller Profiles: ${summary[4]}`);
    console.log(`Stays: ${summary[5]}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
