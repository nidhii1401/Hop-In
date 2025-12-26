import prisma from "../db.js";

export const getAllHostels = async (req, res) => {
  try {
    const {
      search,
      city,
      area,
      nearCollege,
      genderType,
      messType,
      minPrice,
      maxPrice,
      roomCategories,
      page = 1,
      limit = 9,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // ✅ STRUCTURAL CHANGE: Use an explicit AND array to prevent filter collisions
    const andConditions = [
      { isActive: true }, // 🔒 CRITICAL: This is now the hard constraint
    ];

    // 1. Add Location & Type Filters
    if (city)
      andConditions.push({ city: { equals: city, mode: "insensitive" } });
    if (area)
      andConditions.push({ area: { equals: area, mode: "insensitive" } });
    if (nearCollege)
      andConditions.push({
        nearCollege: { contains: nearCollege, mode: "insensitive" },
      });
    if (genderType) andConditions.push({ genderType });
    if (messType) andConditions.push({ messType });

    // 2. Add Search Logic
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { area: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { nearCollege: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // 3. Room Filters
    let roomConditions = [];

    // Price filter
    if (minPrice || maxPrice) {
      roomConditions.push({
        pricePerMonth: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
        isActive: true,
      });
    }

    // Room categories
    if (roomCategories) {
      const categoriesArray = roomCategories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const exactCaps = categoriesArray
        .filter((c) => c !== "MORE")
        .map((c) => Number(c))
        .filter((n) => !Number.isNaN(n));

      const includeMore = categoriesArray.includes("MORE");

      if (exactCaps.length > 0) {
        roomConditions.push({
          capacity: { in: exactCaps },
          isActive: true,
        });
      }

      if (includeMore) {
        roomConditions.push({
          capacity: { gt: 3 },
          isActive: true,
        });
      }
    }

    // Attach Room Conditions (if any exist)
    if (roomConditions.length > 0) {
      andConditions.push({
        rooms: {
          some: {
            OR: roomConditions,
          },
        },
      });
    }

    // ✅ FINAL QUERY OBJECT
    const finalWhere = { AND: andConditions };

    // 4. Sorting
    const validSortFields = [
      "name",
      "city",
      "createdAt",
      "messPricePerMonth",
      "updatedAt",
    ];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const orderBy = { [safeSortBy]: sortOrder };

    // 5. Execute Queries
    const [hostels, total] = await Promise.all([
      prisma.hostel.findMany({
        where: finalWhere,
        skip,
        take,
        orderBy,
        include: {
          owner: { select: { fullName: true } },
          _count: {
            select: {
              // ✅ Fix: Count only ACTIVE rooms
              rooms: { where: { isActive: true } },
              // ✅ Fix: Count only ACTIVE stays (residents)
              stays: { where: { status: "ACTIVE", endDate: null } },
            },
          },
          hostelAmenities: {
            include: {
              amenity: { select: { displayName: true } },
            },
            take: 6,
          },
          media: {
            where: { isCover: true },
            take: 1,
          },
        },
      }),
      prisma.hostel.count({ where: finalWhere }),
    ]);

    // 6. Transform Response
    const transformed = hostels.map((h) => ({
      id: h.id,
      name: h.name,
      area: h.area,
      city: h.city,
      messType: h.messType,
      messPricePerMonth: h.messPricePerMonth
        ? Number(h.messPricePerMonth)
        : null,
      ownerName: h.owner?.fullName || "Owner",
      totalRooms: h._count.rooms, // Now represents only active rooms
      activeResidents: h._count.stays,
      topAmenities: h.hostelAmenities.map((ha) => ha.amenity.displayName),
      coverImage: h.media[0]?.url || null,
    }));

    res.json({
      success: true,
      hostels: transformed,
      pagination: {
        total,
        page: Number(page),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    console.error("Get all hostels error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hostels",
    });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ FIXED: Single stays query with ROOM ALLOCATION filter
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: parseInt(id),
        isActive: true,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
        media: {
          orderBy: { sortOrder: "asc" },
        },
        hostelAmenities: {
          include: {
            amenity: {
              select: {
                displayName: true,
              },
            },
          },
        },
        rooms: {
          where: { isActive: true },
          include: {
            roomAmenities: {
              include: {
                amenity: {
                  select: { displayName: true },
                },
              },
            },
            _count: {
              select: {
                stays: {
                  where: {
                    status: "ACTIVE",
                    // ✅ Only room-assigned stays (roomId is NOT NULL)
                    roomId: { not: null },
                    endDate: null,
                  },
                },
              },
            },
            // ✅ Keep stays for room-level data (roomId is always available since room is included)
            stays: {
              where: {
                status: "ACTIVE",
                roomId: { not: null }, // ✅ ROOM ASSIGNED
                endDate: null, // ✅ CURRENTLY STAYING
              },
              select: {
                id: true,
              },
            },
          },
        },
        // ✅ FIXED: Single stays query - ONLY ROOM-ASSIGNED + CURRENT
        stays: {
          where: {
            status: "ACTIVE",
            roomId: { not: null }, // ✅ MUST HAVE ROOM (roomId exists)
            endDate: null, // ✅ NO END DATE (still staying)
          },
          take: 5,
          include: {
            hosteller: {
              select: {
                id: true,
                fullName: true,
              },
            },
            room: {
              // ✅ Include room for verification
              select: {
                id: true,
                roomNumber: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            stays: {
              where: {
                status: "ACTIVE",
                roomId: { not: null },
                endDate: null,
              },
            },
          },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    // ✅ FIXED: Accurate resident counts
    const transformedHostel = {
      ...hostel,
      amenities: hostel.hostelAmenities.map((ha) => ha.amenity.displayName),
      roomCategories: getRoomCategories(hostel.rooms),
      totalRooms: hostel.rooms.length,
      // ✅ ONLY ROOM-ASSIGNED RESIDENTS
      activeResidentsPreview: hostel.stays.map((stay) => ({
        id: stay.hosteller.id,
        fullName: stay.hosteller.fullName,
        roomNumber: stay.room?.roomNumber || "N/A",
      })),
      totalActiveResidents: hostel._count.stays, // ✅ Now accurate!
      minPrice: Math.min(...hostel.rooms.map((r) => Number(r.pricePerMonth))),
      maxPrice: Math.max(...hostel.rooms.map((r) => Number(r.pricePerMonth))),
    };

    // Clean up unused fields
    delete transformedHostel.hostelAmenities;
    delete transformedHostel._count;
    delete transformedHostel.rooms;
    delete transformedHostel.stays;

    res.json({
      success: true,
      hostel: transformedHostel,
    });
  } catch (error) {
    console.error("Error fetching hostel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hostel details",
    });
  }
};

const getRoomCategories = (rooms) => {
  const categories = {};

  rooms.forEach((room) => {
    const capacity = room.capacity;
    if (!categories[capacity]) {
      categories[capacity] = {
        capacity,
        totalRooms: 0,
        emptyRooms: 0,
        totalAvailableBeds: 0,
        occupancyRate: 0,
        minPrice: Infinity,
        maxPrice: 0,
      };
    }

    // ✅ FIXED LOGIC: Completely empty rooms ONLY (zero active stays)
    const isCompletelyEmpty = room._count.stays === 0;

    categories[capacity].totalRooms += 1;

    // ✅ ONLY increment if ZERO occupants (completely empty)
    if (isCompletelyEmpty) {
      categories[capacity].emptyRooms += 1;
    }

    // Keep bed calculation unchanged
    const emptyBeds = room.capacity - room._count.stays;
    categories[capacity].totalAvailableBeds += emptyBeds;

    categories[capacity].minPrice = Math.min(
      categories[capacity].minPrice,
      Number(room.pricePerMonth)
    );
    categories[capacity].maxPrice = Math.max(
      categories[capacity].maxPrice,
      Number(room.pricePerMonth)
    );
  });

  Object.values(categories).forEach((cat) => {
    const totalCapacity = cat.totalRooms * cat.capacity;
    const occupiedBeds = totalCapacity - cat.totalAvailableBeds;
    cat.occupancyRate =
      totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;
  });

  return Object.values(categories).sort((a, b) => a.capacity - b.capacity);
};

export const getHostelResidents = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const residents = await prisma.stay.findMany({
      where: {
        hostelId: parseInt(hostelId),
        status: "ACTIVE",
        roomId: { not: null },
        endDate: null,
      },
      include: {
        hosteller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hostellerProfile: {
              select: {
                collegeName: true,
                course: true,
                branch: true,
                yearOfStudy: true,
                bio: true,
              },
            },
          },
        },
        room: {
          select: {
            id: true,
            roomNumber: true,
            capacity: true,
            floor: true,
            hostel: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ room: { capacity: "asc" } }, { room: { roomNumber: "asc" } }],
    });

    // Transform data structure for frontend
    const roomsByType = {};
    residents.forEach((stay) => {
      const capacity = stay.room.capacity;
      if (!roomsByType[capacity]) {
        roomsByType[capacity] = [];
      }
      roomsByType[capacity].push({
        roomId: stay.room.id,
        roomNumber: stay.room.roomNumber,
        floor: stay.room.floor,
        capacity: stay.room.capacity,
        residents: {
          id: stay.hosteller.id,
          fullName: stay.hosteller.fullName,
          avatarUrl:
            stay.hosteller.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${stay.hosteller.id}`,
          hostellerProfile: stay.hosteller.hostellerProfile || {}, // ✅ Full profile data
          roomNumber: stay.room.roomNumber,
        },
      });
    });

    // Group by room number
    const groupedRooms = {};
    Object.entries(roomsByType).forEach(([capacity, rooms]) => {
      groupedRooms[capacity] = {};
      rooms.forEach((roomData) => {
        const roomKey = roomData.roomNumber || `Room-${roomData.roomId}`;
        if (!groupedRooms[capacity][roomKey]) {
          groupedRooms[capacity][roomKey] = {
            roomNumber: roomKey,
            floor: roomData.floor,
            capacity,
            residents: [],
          };
        }
        groupedRooms[capacity][roomKey].residents.push(roomData.residents);
      });
    });

    res.json({
      success: true,
      residents: groupedRooms,
      totalResidents: residents.length,
      hostelName: residents[0]?.room?.hostel?.name || "Hostel",
    });
  } catch (error) {
    console.error("Error fetching residents:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch residents" });
  }
};

export const getMyStay = async (req, res) => {
  try {
    // ✅ Use userId from JWT payload
    const userId = parseInt(req.user?.userId, 10);
    console.log("🔍 DEBUG - userId:", userId);

    if (!userId || Number.isNaN(userId)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid user session" });
    }

    // 🔍 DEBUG: Check ALL stays for this user (no filters)
    const allUserStays = await prisma.stay.findMany({
      where: { hostellerId: userId },
      select: {
        id: true,
        status: true,
        roomId: true,
        endDate: true,
        createdAt: true,
      },
    });
    console.log("🔍 DEBUG - ALL user stays:", allUserStays);

    // 🔍 DEBUG: Check active stays (relaxed filters)
    const relaxedStays = await prisma.stay.findMany({
      where: {
        hostellerId: userId,
        status: { in: ["ACTIVE", "active"] }, // Case insensitive
        endDate: { equals: null, or: undefined }, // Multiple null checks
      },
    });
    console.log("🔍 DEBUG - Relaxed active stays:", relaxedStays);

    // ✅ FIXED: More flexible query
    const currentStay = await prisma.stay.findFirst({
      where: {
        hostellerId: userId,
        status: { in: ["ACTIVE", "active"] }, // ✅ Case insensitive
        OR: [
          { roomId: { not: null } },
          { roomId: { gte: 1 } }, // ✅ Alternative for room-assigned
        ],
        endDate: null, // ✅ Single null check
      },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
            area: true,
            city: true,
            messType: true,
            messPricePerMonth: true,
            owner: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            capacity: true,
            pricePerMonth: true,
          },
        },
      },
    });

    console.log("🔍 DEBUG - currentStay found:", !!currentStay);

    if (!currentStay) {
      return res.json({
        success: true,
        data: null,
        debug: { allUserStays, relaxedStays }, // REMOVE after fixing
      });
    }

    // Rest of roommates query...
    const roommates = await prisma.stay.findMany({
      where: {
        roomId: currentStay.roomId,
        status: { in: ["ACTIVE", "active"] },
        endDate: null,
        hostellerId: { not: userId },
      },
      include: {
        hosteller: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            avatarUrl: true,
            hostellerProfile: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        stay: currentStay,
        roommates,
        totalRoommates: roommates.length,
        occupancy: {
          current: roommates.length + 1,
          total: currentStay.room.capacity,
        },
      },
    });
  } catch (error) {
    console.error("getMyStay error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
