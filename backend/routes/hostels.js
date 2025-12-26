import express from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all hostels (for browsing)
router.get('/', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, roomType, messType } = req.query;
    
    const where = {
      isActive: true
    };

    // Search by name or area
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.rooms = {
        some: {
          isActive: true,
          pricePerMonth: {}
        }
      };
      
      if (minPrice) {
        where.rooms.some.pricePerMonth.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.rooms.some.pricePerMonth.lte = parseFloat(maxPrice);
      }
    }

    // Filter by room type
    if (roomType) {
      where.rooms = where.rooms || { some: {} };
      where.rooms.some.roomType = roomType;
    }

    // Filter by mess type
    if (messType) {
      where.messType = messType;
    }

    const hostels = await prisma.hostel.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        rooms: {
          where: { isActive: true },
          select: {
            id: true,
            roomType: true,
            capacity: true,
            pricePerMonth: true,
            _count: {
              select: {
                stays: {
                  where: { status: 'ACTIVE' }
                }
              }
            }
          }
        },
        hostelAmenities: {
          include: {
            amenity: true
          }
        },
        media: {
          where: { isCover: true },
          take: 1,
          select: {
            url: true,
            mediaType: true
          }
        },
        _count: {
          select: {
            rooms: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for frontend
    const transformedHostels = hostels.map(hostel => ({
      ...hostel,
      minPrice: Math.min(...hostel.rooms.map(room => parseFloat(room.pricePerMonth))),
      totalCapacity: hostel.rooms.reduce((sum, room) => sum + room.capacity, 0),
      currentOccupancy: hostel.rooms.reduce((sum, room) => sum + room._count.stays.length, 0),
      amenities: hostel.hostelAmenities.map(ha => ha.amenity),
      coverImage: hostel.media[0]?.url || null
    }));

    res.json(transformedHostels);
  } catch (error) {
    console.error('Get hostels error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single hostel details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await prisma.hostel.findUnique({
      where: { 
        id: parseInt(id),
        isActive: true 
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        rooms: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                stays: {
                  where: { status: 'ACTIVE' }
                }
              }
            }
          },
          orderBy: {
            pricePerMonth: 'asc'
          }
        },
        hostelAmenities: {
          include: {
            amenity: true
          }
        },
        media: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        stays: {
          where: { 
            status: 'ACTIVE',
            hosteller: {
              role: 'HOSTELLER'
            }
          },
          include: {
            hosteller: {
              select: {
                fullName: true
              }
            },
            room: {
              select: {
                roomType: true
              }
            }
          },
          take: 10
        }
      }
    });

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Transform data
    const transformedHostel = {
      ...hostel,
      amenities: hostel.hostelAmenities.map(ha => ha.amenity),
      currentResidents: hostel.stays.map(stay => ({
        name: stay.hosteller.fullName,
        roomType: stay.room?.roomType || 'Not assigned'
      }))
    };

    // Remove nested objects that aren't needed
    delete transformedHostel.hostelAmenities;
    delete transformedHostel.stays;

    res.json(transformedHostel);
  } catch (error) {
    console.error('Get hostel error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create hostel (owner only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ message: 'Only owners can create hostels' });
    }

    const {
      name,
      description,
      addressLine,
      area,
      city,
      state,
      pincode,
      landmark,
      nearCollege,
      genderType,
      messType,
      messPricePerMonth,
      messDescription,
      rules,
      amenityIds
    } = req.body;

    const hostel = await prisma.hostel.create({
      data: {
        ownerId: req.user.userId,
        name,
        description,
        addressLine,
        area,
        city,
        state,
        pincode,
        landmark,
        nearCollege,
        genderType,
        messType,
        messPricePerMonth: messPricePerMonth ? parseFloat(messPricePerMonth) : null,
        messDescription,
        rules
      }
    });

    // Add amenities if provided
    if (amenityIds && amenityIds.length > 0) {
      await prisma.hostelAmenity.createMany({
        data: amenityIds.map(amenityId => ({
          hostelId: hostel.id,
          amenityId: parseInt(amenityId)
        }))
      });
    }

    res.status(201).json({ message: 'Hostel created successfully', hostel });
  } catch (error) {
    console.error('Create hostel error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update hostel (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ message: 'Only owners can update hostels' });
    }

    const { id } = req.params;
    const hostelId = parseInt(id);

    // Check if user owns this hostel
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId }
    });

    if (!hostel || hostel.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own hostels' });
    }

    const updateData = req.body;
    
    // Handle numeric fields
    if (updateData.messPricePerMonth) {
      updateData.messPricePerMonth = parseFloat(updateData.messPricePerMonth);
    }

    const updatedHostel = await prisma.hostel.update({
      where: { id: hostelId },
      data: updateData
    });

    res.json({ message: 'Hostel updated successfully', hostel: updatedHostel });
  } catch (error) {
    console.error('Update hostel error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete hostel (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ message: 'Only owners can delete hostels' });
    }

    const { id } = req.params;
    const hostelId = parseInt(id);

    // Check if user owns this hostel
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId }
    });

    if (!hostel || hostel.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own hostels' });
    }

    // Soft delete by setting isActive to false
    await prisma.hostel.update({
      where: { id: hostelId },
      data: { isActive: false }
    });

    res.json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    console.error('Delete hostel error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get owner's hostels
router.get('/owner/my-hostels', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ message: 'Only owners can view their hostels' });
    }

    const hostels = await prisma.hostel.findMany({
      where: {
        ownerId: req.user.userId,
        isActive: true
      },
      include: {
        rooms: {
          where: { isActive: true },
          _count: {
            select: {
              stays: {
                where: { status: 'ACTIVE' }
              }
            }
          }
        },
        _count: {
          select: {
            rooms: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformedHostels = hostels.map(hostel => ({
      ...hostel,
      totalRooms: hostel._count.rooms,
      totalOccupancy: hostel.rooms.reduce((sum, room) => sum + room.capacity, 0),
      currentOccupancy: hostel.rooms.reduce((sum, room) => sum + room._count.stays.length, 0)
    }));

    res.json(transformedHostels);
  } catch (error) {
    console.error('Get owner hostels error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
