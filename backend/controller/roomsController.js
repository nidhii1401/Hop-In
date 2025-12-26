import prisma from '../db.js';

export const getRoomsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.userId;

    if (!hostelId) {
      return res.status(400).json({ message: 'Hostel ID is required' });
    }

    // Find the hostel to verify ownership
    const hostel = await prisma.hostel.findUnique({
      where: { id: parseInt(hostelId) },
      select: { ownerId: true }
    });

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Verify ownership
    if (hostel.ownerId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized access to this hostel' });
    }

    // Get all rooms for this hostel with hosteller avatars
    const rooms = await prisma.room.findMany({
      where: { hostelId: parseInt(hostelId) },
      include: {
        stays: {
          where: { status: 'ACTIVE', endDate: null },
          include: {
            hosteller: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                avatarUrl: true,
                avatar: true,
                hostellerProfile: {
                  select: {
                    collegeName: true,
                    course: true,
                    branch: true,
                    yearOfStudy: true,
                    bio: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        { roomNumber: 'asc' },
        { floor: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Rooms retrieved successfully',
      data: rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;

    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    // Get the room with hostel information and hosteller data
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
      include: {
        hostel: {
          select: { ownerId: true }
        },
        stays: {
          where: { status: 'ACTIVE', endDate: null },
          include: {
            hosteller: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                avatarUrl: true,
                avatar: true,
                hostellerProfile: {
                  select: {
                    collegeName: true,
                    course: true,
                    branch: true,
                    yearOfStudy: true,
                    bio: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Verify ownership
    if (room.hostel.ownerId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized access to this room' });
    }

    res.status(200).json({
      success: true,
      message: 'Room retrieved successfully',
      data: room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    // Extract fields from body
    const { roomNumber, floor, roomType, capacity, pricePerMonth, isActive } = req.body;

    if (!roomId) {
      return res.status(400).json({ success: false, message: 'Room ID is required' });
    }

    // 1. Fetch Room AND Active Residents Count
    const existingRoom = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
      include: {
        hostel: { select: { ownerId: true } },
        stays: {
          where: { status: 'ACTIVE', endDate: null }
        }
      }
    });

    if (!existingRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // 2. Verify Ownership
    if (userRole !== 'ADMIN' && existingRoom.hostel.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this room' });
    }

    // 3. Determine Final Values
    let finalRoomType = roomType || existingRoom.roomType;
    let finalCapacity = capacity !== undefined ? parseInt(capacity) : existingRoom.capacity;
    const finalIsActive = isActive !== undefined ? isActive : existingRoom.isActive;

    // 🚨 LOGIC FIX: Enforce Capacity = RoomType if RoomType is a number <= 10
    // If user updates roomType to "2", force capacity to 2.
    if (roomType !== undefined) {
        const typeNum = parseInt(roomType);
        if (!isNaN(typeNum) && typeNum > 0 && typeNum <= 10) {
            finalCapacity = typeNum; 
        }
    }

    // Calculate current occupancy
    const currentOccupancy = existingRoom.stays.length;

    console.log(`Update Check: Room ${existingRoom.roomNumber} | Occupancy: ${currentOccupancy} | New Cap: ${finalCapacity}`);

    // ---------------- VALIDATION LOGIC ----------------

    // Rule A: Cannot reduce capacity below current occupancy
    if (finalCapacity < currentOccupancy) {
      return res.status(400).json({
        success: false,
        message: `Cannot reduce capacity below current occupancy`,
        details: {
          roomNumber: existingRoom.roomNumber,
          currentOccupancy,
          newCapacity: finalCapacity,
          error: `Room ${existingRoom.roomNumber} has ${currentOccupancy} active residents. You cannot set capacity to ${finalCapacity}.`
        }
      });
    }

    // Rule B: Cannot deactivate room if anyone is living there
    if (finalIsActive === false && currentOccupancy > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate room with active residents',
        details: {
          error: 'Please deallocate all residents before marking the room as inactive.',
          currentOccupancy
        }
      });
    }

    // ---------------- DATABASE UPDATE ----------------

    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: {
        roomNumber: roomNumber || existingRoom.roomNumber,
        floor: floor || existingRoom.floor,
        roomType: String(finalRoomType), // Ensure string if your DB expects string
        capacity: finalCapacity,
        pricePerMonth: pricePerMonth ? parseFloat(pricePerMonth) : existingRoom.pricePerMonth,
        isActive: finalIsActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: updatedRoom
    });

  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const toggleRoomStatus = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;

    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    // Get the room to verify ownership
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
      include: {
        hostel: {
          select: { ownerId: true }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Verify ownership
    if (room.hostel.ownerId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized access to this room' });
    }

    // Toggle room status
    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: {
        isActive: !room.isActive
      }
    });

    res.status(200).json({
      success: true,
      message: `Room ${updatedRoom.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedRoom
    });
  } catch (error) {
    console.error('Toggle room status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!roomId) {
      return res.status(400).json({ success: false, message: 'Room ID is required' });
    }

    const id = parseInt(roomId);

    // 1. Get room with active residents count
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        hostel: {
          select: { ownerId: true }
        },
        stays: {
          where: {
            status: 'ACTIVE',
            endDate: null
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // 2. Verify ownership
    if (userRole !== 'ADMIN' && room.hostel.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this room' });
    }

    // 3. BLOCK if active residents exist
    if (room.stays.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active residents',
        details: {
          roomNumber: room.roomNumber,
          activeResidents: room.stays.length
        }
      });
    }

    // 4. Perform Safe Deletion (Transaction)
    await prisma.$transaction([
      // A. Delete associated amenities for this room
      prisma.roomAmenity.deleteMany({
        where: { roomId: id }
      }),

      // B. Detach past stays (preserve history, remove link to room)
      prisma.stay.updateMany({
        where: { roomId: id },
        data: { roomId: null }
      }),

      // C. Finally, delete the room
      prisma.room.delete({
        where: { id }
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      roomId: id
    });

  } catch (error) {
    console.error('Delete room error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



export const addRoom = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { roomNumber, floor, roomType, capacity, pricePerMonth } = req.body;

    // ✅ 1. Input Validation
    if (!hostelId || !roomNumber || !roomType || !capacity || !pricePerMonth) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: roomNumber, roomType, capacity, pricePerMonth'
      });
    }

    const parsedHostelId = parseInt(hostelId);
    const parsedCapacity = parseInt(capacity);
    const parsedPrice = parseFloat(pricePerMonth);

    if (isNaN(parsedHostelId) || isNaN(parsedCapacity) || isNaN(parsedPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid numeric values for capacity or price'
      });
    }

    // ✅ 2. Verify Ownership + Hostel Active
    const hostel = await prisma.hostel.findFirst({
      where: { 
        id: parsedHostelId,
        isActive: true // Only active hostels
      },
      select: { 
        ownerId: true,
        name: true
      }
    });

    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Active hostel not found' 
      });
    }

    if (userRole !== 'ADMIN' && hostel.ownerId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access to this hostel' 
      });
    }

    // ✅ 3. Check DUPLICATE roomNumber in hostel
    const existingRoom = await prisma.room.findFirst({
      where: {
        hostelId: parsedHostelId,
        roomNumber: roomNumber.trim()
      }
    });

    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room "${roomNumber}" already exists in this hostel`,
        details: { existingRoomId: existingRoom.id }
      });
    }

    // ✅ 4. Validate capacity by roomType (Business Rule)
    const capacityByType = {
      'SINGLE': 1,
      'DOUBLE': 2,
      'TRIPLE': 3,
      'QUAD': 4
    };

    const maxCapacity = capacityByType[roomType.toUpperCase()];
    if (maxCapacity && parsedCapacity > maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Capacity cannot exceed ${maxCapacity} for ${roomType} room type`,
        details: { maxCapacity, requested: parsedCapacity }
      });
    }

    // ✅ 5. Create Room
    const newRoom = await prisma.room.create({
      data: {
        hostelId: parsedHostelId,
        roomNumber: roomNumber.trim(),
        floor: floor || '1',
        roomType: roomType.toUpperCase(),
        capacity: parsedCapacity,
        pricePerMonth: parsedPrice,
        isActive: true
      }
    });

    console.log(`Room "${newRoom.roomNumber}" added to hostel ${hostelId} successfully`);

    res.status(201).json({
      success: true,
      message: 'Room added successfully',
      data: newRoom
    });

  } catch (error) {
    console.error('Add Room Error:', error);
    
    // ✅ Prisma-specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists or data conflict'
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

