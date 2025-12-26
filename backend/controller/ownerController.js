import prisma from "../db.js";
import { v2 as cloudinary } from "cloudinary";

export const ownerDashboard = async (req, res) => {
  console.log("owner dashboard ");
  try {
    const ownerId = req.user?.userId;
    const userRole = req.user?.role;

    // ADMIN users can see all hostels, OWNER users see only their own
    const whereCondition =
      userRole === "ADMIN"
        ? { isActive: true } // ADMIN sees all active hostels
        : { ownerId, isActive: true }; // OWNER sees only their hostels

    // Get owner's hostels with stats
    const hostels = await prisma.hostel.findMany({
      where: whereCondition,
      include: {
        _count: {
          select: {
            rooms: true,
            stays: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    });

    const totalHostels = hostels.length;
    const totalRooms = hostels.reduce(
      (sum, hostel) => sum + hostel._count.rooms,
      0
    );
    const activeStays = hostels.reduce(
      (sum, hostel) => sum + hostel._count.stays,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalHostels,
        totalRooms,
        activeStays,
        recentHostels: hostels.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --- Helper to parse form-data strings ---
const parseField = (field) => {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch (e) {
      return field;
    }
  }
  return field;
};

export const createHostel = async (req, res) => {
  try {
    // 1. Parse JSON fields (Required for multipart/form-data)
    const amenities = parseField(req.body.amenities);
    const rooms = parseField(req.body.rooms);
    const existingMediaRaw = parseField(req.body.media);

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
      messDescription,
      rules,
    } = req.body;

    // Numerical parsing
    const messPricePerMonth = req.body.messPricePerMonth
      ? parseFloat(req.body.messPricePerMonth)
      : null;

    // 2. Process Images (Cloudinary + Manual URLs)
    let finalMedia = [];

    // Handle uploaded files with metadata
    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file, index) => {
        // Get image metadata from form data if available
        let imageData = { isCover: false, mediaType: "IMAGE" };

        // Try to parse image data from form
        const imageDataKey = `imageData[${index}]`;
        if (req.body[imageDataKey]) {
          try {
            imageData = JSON.parse(req.body[imageDataKey]);
          } catch (e) {
            console.warn("Invalid image metadata for file", index);
          }
        }

        return {
          mediaType: imageData.mediaType || "IMAGE",
          url: file.path, // Cloudinary URL
          isCover:
            imageData.isCover || (index === 0 && finalMedia.length === 0),
          sortOrder: index,
        };
      });

      finalMedia = [...finalMedia, ...uploadedFiles];
    }

    // Combine with any manual URLs sent in body
    if (existingMediaRaw && existingMediaRaw.length > 0) {
      finalMedia = [...finalMedia, ...existingMediaRaw];
    }

    // Check Max 6 constraint
    if (finalMedia.length > 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Maximum 6 images allowed per hostel",
        });
    }

    // Validate required fields
    if (!name || !city || !state) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, city, and state are required fields",
        });
    }

    const ownerId = req.user?.userId;
    if (!ownerId)
      return res
        .status(401)
        .json({ success: false, message: "Owner authentication required" });

    // Verify Owner
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || (owner.role !== "OWNER" && owner.role !== "ADMIN")) {
      return res
        .status(403)
        .json({ success: false, message: "Only owners can create hostels" });
    }

    // 3. Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Hostel
      const hostel = await tx.hostel.create({
        data: {
          ownerId,
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
          messType: messType || "NONE",
          messPricePerMonth,
          messDescription,
          rules,
        },
      });

      // Validate and Add Amenities
      if (amenities && amenities.length > 0) {
        // Validate amenity IDs exist in database
        const validAmenityIds = await tx.amenity.findMany({
          where: { id: { in: amenities.map((id) => parseInt(id)) } },
          select: { id: true },
        });

        const validIds = validAmenityIds.map((a) => a.id);
        const invalidIds = amenities
          .map((id) => parseInt(id))
          .filter((id) => !validIds.includes(id));

        if (invalidIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid amenity IDs: ${invalidIds.join(", ")}`,
          });
        }

        await tx.hostelAmenity.createMany({
          data: validIds.map((amenityId) => ({
            hostelId: hostel.id,
            amenityId: amenityId,
          })),
        });
      }

      // Validate and Add Media (max 6 images)
      if (finalMedia.length > 0) {
        if (finalMedia.length > 6) {
          return res.status(400).json({
            success: false,
            message: "Maximum 6 images allowed",
          });
        }

        // Validate media URLs and types
        const validMedia = finalMedia.filter((item) => {
          if (!item.url || typeof item.url !== "string") return false;
          if (item.mediaType && !["IMAGE", "VIDEO"].includes(item.mediaType))
            return false;
          return true;
        });

        if (validMedia.length !== finalMedia.length) {
          return res.status(400).json({
            success: false,
            message: "Invalid media data provided",
          });
        }

        await tx.hostelMedia.createMany({
          data: validMedia.map((item, index) => ({
            hostelId: hostel.id,
            mediaType: item.mediaType || "IMAGE",
            url: item.url.trim(),
            isCover: !!item.isCover,
            sortOrder: index,
          })),
        });
      }

      // Add Rooms
      if (rooms && rooms.length > 0) {
        await tx.room.createMany({
          data: rooms.map((room, index) => ({
            hostelId: hostel.id,
            roomNumber: room.roomNumber || `${index + 1}`,
            floor: room.floor || "1",
            roomType: room.roomType || "SINGLE",
            capacity: parseInt(room.capacity) || 1,
            pricePerMonth: parseFloat(room.pricePerMonth) || 5000,
            isActive: true,
          })),
        });
      }

      return hostel;
    });

    const completeHostel = await prisma.hostel.findUnique({
      where: { id: result.id }, // ✅ CHANGED: Use 'result.id' instead of 'hostel.id'
      include: {
        owner: { select: { id: true, fullName: true, email: true } },
        hostelAmenities: { include: { amenity: true } },
        media: { orderBy: { sortOrder: "asc" } },
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Hostel created successfully",
        data: completeHostel,
      });
  } catch (error) {
    console.error("Error creating hostel:", error);
    if (error.code === "P2002")
      return res
        .status(400)
        .json({ success: false, message: "Duplicate hostel info" });
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
  }
};

export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // 1. Parse fields for Multipart/Form-data
    const amenities = parseField(req.body.amenities);
    const rooms = parseField(req.body.rooms);
    const existingMediaRaw = parseField(req.body.media); // This should be the array of OLD image objects the user kept

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
      messDescription,
      rules,
    } = req.body;

    const messPricePerMonth = req.body.messPricePerMonth
      ? parseFloat(req.body.messPricePerMonth)
      : null;

    // 2. Verify Access
    let hostelQuery = { id: parseInt(id) };
    if (userRole !== "ADMIN") hostelQuery.ownerId = userId;

    const existingHostel = await prisma.hostel.findFirst({
      where: hostelQuery,
      include: {
        rooms: {
          include: { stays: { where: { status: "ACTIVE", endDate: null } } },
        },
      },
    });

    if (!existingHostel)
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found or access denied" });

    // 3. Room Capacity Validation
    if (rooms) {
      const violations = validateRoomCapacityChanges(
        existingHostel.rooms,
        rooms
      );
      if (violations.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot reduce room capacity below current occupancy",
          violations,
        });
      }
    }

    // 4. Prepare Media (Merge Old + New)
    const newFiles = req.files
      ? req.files.map((file, index) => ({
          mediaType: "IMAGE",
          url: file.path,
          isCover: false, // Default false for new uploads, let user set it in UI later
          sortOrder: 99 + index,
        }))
      : [];

    // If 'media' field was sent, it implies the FULL new state of media (minus the files just uploaded)
    // If 'media' wasn't sent, we assume we keep existing DB media and just append new files
    let finalMediaToSave = undefined;

    if (existingMediaRaw || newFiles.length > 0) {
      // If frontend sent a list of "media to keep", we start with that.
      // If not, we don't delete old media blindly unless 'media' key was explicitly passed as empty array.
      const prevMedia = existingMediaRaw || [];
      finalMediaToSave = [...prevMedia, ...newFiles];

      // Re-index sort order
      finalMediaToSave = finalMediaToSave.map((m, i) => ({
        ...m,
        sortOrder: i,
      }));

      if (finalMediaToSave.length > 6) {
        return res
          .status(400)
          .json({ success: false, message: "Total images cannot exceed 6" });
      }
    }

    // 5. Transaction Update
    await prisma.$transaction(async (tx) => {
      // Update Basic Info
      await tx.hostel.update({
        where: { id: parseInt(id) },
        data: {
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
          messType: messType || "NONE",
          messPricePerMonth,
          messDescription,
          rules,
        },
      });

      // Update Amenities
      if (amenities !== undefined) {
        await tx.hostelAmenity.deleteMany({
          where: { hostelId: parseInt(id) },
        });
        if (amenities.length > 0) {
          await tx.hostelAmenity.createMany({
            data: amenities.map((amenityId) => ({
              hostelId: parseInt(id),
              amenityId: parseInt(amenityId),
            })),
          });
        }
      }

      // Update Media
      if (finalMediaToSave !== undefined) {
        // Delete all and recreate to ensure sync
        await tx.hostelMedia.deleteMany({ where: { hostelId: parseInt(id) } });
        if (finalMediaToSave.length > 0) {
          await tx.hostelMedia.createMany({
            data: finalMediaToSave.map((item, index) => ({
              hostelId: parseInt(id),
              mediaType: item.mediaType || "IMAGE",
              url: item.url,
              isCover: !!item.isCover,
              sortOrder: index,
            })),
          });
        }
      }

      // Update Rooms (Logic unchanged from your version)
      if (rooms !== undefined) {
        await tx.room.updateMany({
          where: { hostelId: parseInt(id), isActive: false },
          data: { isActive: false },
        });

        if (rooms.length > 0) {
          for (const roomData of rooms) {
            await tx.room.upsert({
              where: {
                id: roomData.id ? parseInt(roomData.id) : -1, // Use -1 to force create if no ID
                hostelId_roomNumber: {
                  hostelId: parseInt(id),
                  roomNumber: roomData.roomNumber,
                },
              },
              update: {
                roomNumber: roomData.roomNumber,
                floor: roomData.floor,
                roomType: roomData.roomType,
                capacity: parseInt(roomData.capacity),
                pricePerMonth: parseFloat(roomData.pricePerMonth),
                isActive: true,
              },
              create: {
                hostelId: parseInt(id),
                roomNumber: roomData.roomNumber,
                floor: roomData.floor || "1",
                roomType: roomData.roomType || "SINGLE",
                capacity: parseInt(roomData.capacity),
                pricePerMonth: parseFloat(roomData.pricePerMonth) || 5000,
                isActive: true,
              },
            });
          }
        }
      }
    });

    const completeHostel = await prisma.hostel.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: true,
        hostelAmenities: { include: { amenity: true } },
        media: { orderBy: { sortOrder: "asc" } },
        rooms: { where: { isActive: true }, orderBy: { roomNumber: "asc" } },
      },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Hostel updated successfully",
        data: completeHostel,
      });
  } catch (error) {
    console.error("Error updating hostel:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// ✅ CAPACITY VALIDATION FUNCTION
const validateRoomCapacityChanges = (existingRooms, newRooms) => {
  const violations = [];

  for (const newRoom of newRooms) {
    const existingRoom = existingRooms.find(
      (r) =>
        r.roomNumber === newRoom.roomNumber ||
        r.id === (newRoom.id ? parseInt(newRoom.id) : null)
    );

    if (existingRoom) {
      const currentOccupancy = existingRoom.stays.length;
      const newCapacity = parseInt(newRoom.capacity);

      // 🚨 CRITICAL: Cannot reduce capacity below current occupancy
      if (newCapacity < currentOccupancy) {
        violations.push({
          roomNumber: newRoom.roomNumber,
          currentOccupancy,
          newCapacity,
          error: `Room ${newRoom.roomNumber}: Cannot reduce capacity from ${existingRoom.capacity} to ${newCapacity} (has ${currentOccupancy} residents)`,
        });
      }
    }
  }

  return violations;
};

export const getOwnerHostels = async (req, res) => {
  try {
    const ownerId = req.user?.userId;
    const userRole = req.user?.role;

    if (!ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    // ✅ LOGIC UPDATE:
    // 1. ADMIN: Sees ALL active hostels.
    // 2. OWNER: Sees ONLY their own active hostels.

    const whereCondition =
      userRole === "ADMIN"
        ? { isActive: true } // ADMIN sees ALL active hostels
        : { ownerId: ownerId, isActive: true }; // OWNER sees only THEIR active hostels

    const hostels = await prisma.hostel.findMany({
      where: whereCondition,
      include: {
        media: {
          where: { isCover: true },
          take: 1,
        },
        _count: {
          select: {
            rooms: {
              where: { isActive: true },
            },
            stays: {
              where: {
                status: "ACTIVE",
                endDate: null,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: hostels,
    });
  } catch (error) {
    console.error("Error fetching owner hostels:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getHostelById = async (req, res) => {
  console.log("get hostel by id");

  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // ✅ STRICT: Only Active Hostels are accessible
    let hostelQuery = { id: parseInt(id), isActive: true };

    // ✅ ACCESS CONTROL:
    // If NOT Admin, restrict to their own hostels.
    // If Admin, they can view ANY active hostel.
    if (userRole !== "ADMIN") {
      hostelQuery.ownerId = userId;
    }

    const hostel = await prisma.hostel.findFirst({
      where: hostelQuery,
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        hostelAmenities: {
          include: {
            amenity: true,
          },
        },
        media: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        rooms: {
          where: {
            isActive: true,
          },
          orderBy: {
            roomNumber: "asc",
          },
          include: {
            roomAmenities: {
              include: { amenity: true },
            },
            _count: {
              select: {
                stays: {
                  where: {
                    status: "ACTIVE",
                    endDate: null,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            stays: {
              where: {
                status: "ACTIVE",
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
        message: "Hostel not found, inactive, or access denied",
      });
    }

    const hostelWithComputedData = {
      ...hostel,
      totalActiveResidents: hostel._count.stays,
      rooms: hostel.rooms.map((room) => ({
        ...room,
        occupancy: room._count.stays || 0,
        occupancyPercentage:
          room.capacity > 0
            ? Math.round(((room._count.stays || 0) / room.capacity) * 100)
            : 0,
      })),
    };

    res.status(200).json({
      success: true,
      data: hostelWithComputedData,
    });
  } catch (error) {
    console.error("Error fetching hostel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;
    const userRole = req.user?.role;

    // ✅ 1. Verify hostel exists and user has permission (ADMIN override)
    let hostelQuery = { id: parseInt(id), isActive: true };
    if (userRole !== "ADMIN") {
      hostelQuery.ownerId = ownerId;
    }

    const existingHostel = await prisma.hostel.findFirst({
      where: hostelQuery,
      include: {
        rooms: {
          include: {
            stays: {
              where: {
                status: "ACTIVE",
                endDate: null, // Currently staying
              },
            },
          },
        },
      },
    });

    if (!existingHostel) {
      return res.status(404).json({
        success: false,
        message: "Active hostel not found or access denied",
      });
    }

    // ✅ 2. Check for active residents - BLOCK deletion if any
    const activeResidents = existingHostel.rooms.flatMap((room) => room.stays);
    if (activeResidents.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete hostel with active residents",
        activeResidentCount: activeResidents.length,
        affectedRooms: existingHostel.rooms
          .filter((room) => room.stays.length > 0)
          .map((room) => ({
            roomNumber: room.roomNumber,
            occupants: room.stays.length,
          })),
      });
    }

    // ✅ 3. FULL CASCADE CLEANUP in transaction
    await prisma.$transaction(async (tx) => {
      const hostelId = parseInt(id);

      // STEP 1: Cleanup Stay records (set endDate, remove room assignment)
      await tx.stay.updateMany({
        where: {
          hostelId,
          status: { not: "ACTIVE" }, // Only non-active stays
        },
        data: {
          status: "CANCELLED",
          endDate: new Date(),
          roomId: null, // Deallocate rooms
          updatedAt: new Date(),
        },
      });

      // STEP 2: Deactivate all rooms (soft delete)
      await tx.room.updateMany({
        where: { hostelId },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      // STEP 3: Remove hostel amenities junction records
      await tx.hostelAmenity.deleteMany({
        where: { hostelId },
      });

      // STEP 4: Remove hostel media records
      await tx.hostelMedia.deleteMany({
        where: { hostelId },
      });

      // STEP 5: Soft delete hostel itself
      await tx.hostel.update({
        where: { id: hostelId },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Hostel deleted successfully (soft delete)",
      hostelId: parseInt(id),
    });
  } catch (error) {
    console.error("Error deleting hostel:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during hostel deletion",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// GET /owner/hostels/:hostelId/rooms - All rooms grouped by type
export const getHostelRooms = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.userId;

    if (!hostelId) {
      return res.status(400).json({ message: "Hostel ID is required" });
    }

    // Verify ownership
    const hostel = await prisma.hostel.findUnique({
      where: { id: parseInt(hostelId) },
      select: { ownerId: true },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (hostel.ownerId !== userId && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this hostel" });
    }

    const rooms = await prisma.room.findMany({
      where: {
        hostelId: +hostelId,
        isActive: true,
      },
      include: {
        stays: {
          where: { status: "ACTIVE" },
          include: {
            hosteller: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                hostellerProfile: {
                  select: {
                    collegeName: true,
                    yearOfStudy: true,
                    branch: true,
                  },
                },
              },
            },
          },
        },
        roomAmenities: {
          include: {
            amenity: {
              select: { keyName: true, displayName: true },
            },
          },
        },
      },
      orderBy: [{ roomType: "asc" }, { roomNumber: "asc" }],
    });

    res.status(200).json({
      success: true,
      message: "Rooms retrieved successfully",
      data: rooms,
    });
  } catch (error) {
    console.error("Get hostel rooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /owner/search-hostellers?email= - Available hostellers only
export const searchHostellers = async (req, res) => {
  try {
    const { email = "" } = req.query;

    console.log("Searching hostellers with email:", email);

    const hostellers = await prisma.user.findMany({
      where: {
        role: "HOSTELLER",
        email: {
          contains: email,
          mode: "insensitive",
        },
        // Only show hostellers who don't have ACTIVE stays
        // Users with LEFT status should be searchable
        stays: {
          none: {
            status: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        // avatar: true,
        hostellerProfile: {
          select: {
            collegeName: true,
            yearOfStudy: true,
            branch: true,
          },
        },
      },
      take: 10,
      orderBy: { fullName: "asc" },
    });

    console.log(
      "Found hostellers:",
      hostellers.map((h) => ({ id: h.id, email: h.email }))
    );

    res.status(200).json({
      success: true,
      message: "Hostellers found successfully",
      data: hostellers,
    });
  } catch (error) {
    console.error("Search hostellers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /owner/hostels/:hostelId/rooms/:roomId/allocate
export const allocateRoom = async (req, res) => {
  try {
    const { hostelId, roomId } = req.params;
    const { hostellerId } = req.body;
    const userId = req.user?.userId;

    if (!hostelId || !roomId || !hostellerId) {
      return res
        .status(400)
        .json({ message: "Hostel ID, Room ID, and Hosteller ID are required" });
    }

    // Verify ownership
    const hostel = await prisma.hostel.findUnique({
      where: { id: parseInt(hostelId) },
      select: { ownerId: true },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (hostel.ownerId !== userId && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this hostel" });
    }

    // Transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check room capacity
      const room = await tx.room.findUnique({
        where: { id: +roomId },
        include: {
          stays: {
            where: { status: "ACTIVE" },
          },
        },
      });

      if (!room) {
        throw new Error("Room not found");
      }

      if (room.stays.length >= room.capacity) {
        throw new Error("Room is full");
      }

      // 2. Check hosteller availability
      const existingStay = await tx.stay.findFirst({
        where: {
          hostellerId: +hostellerId,
          status: "ACTIVE",
        },
      });

      if (existingStay) {
        throw new Error("Hosteller already has an active stay");
      }

      // 3. Create stay
      return tx.stay.create({
        data: {
          hostellerId: +hostellerId,
          hostelId: +hostelId,
          roomId: +roomId,
          status: "ACTIVE",
          initiatedBy: "OWNER",
          startDate: new Date(),
        },
        include: {
          hosteller: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          room: {
            select: {
              id: true,
              roomNumber: true,
              roomType: true,
            },
          },
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Room allocated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Allocate room error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// DELETE /owner/hostels/:hostelId/rooms/:roomId/stays/:stayId
export const deallocateRoom = async (req, res) => {
  try {
    const { hostelId, roomId, stayId } = req.params;
    const userId = req.user?.userId;

    if (!hostelId || !roomId || !stayId) {
      return res
        .status(400)
        .json({ message: "Hostel ID, Room ID, and Stay ID are required" });
    }

    // Verify ownership
    const hostel = await prisma.hostel.findUnique({
      where: { id: parseInt(hostelId) },
      select: { ownerId: true },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (hostel.ownerId !== userId && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this hostel" });
    }

    const result = await prisma.stay.update({
      where: { id: +stayId },
      data: {
        status: "LEFT",
        endDate: new Date(),
        updatedAt: new Date(),
      },
      include: {
        hosteller: {
          select: {
            fullName: true,
            email: true,
            id: true,
          },
        },
        room: {
          select: {
            roomNumber: true,
          },
        },
      },
    });

    console.log("Deallocated hosteller:", {
      hostellerId: result.hosteller.id,
      hostellerEmail: result.hosteller.email,
      stayId: result.id,
      newStatus: result.status,
    });

    res.status(200).json({
      success: true,
      message: "Room deallocated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Deallocate room error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /owner/hostels/:hostelId/rooms/:roomId - Single room details
export const getRoomDetails = async (req, res) => {
  try {
    const { hostelId, roomId } = req.params;
    const userId = req.user?.userId;

    if (!hostelId || !roomId) {
      return res
        .status(400)
        .json({ message: "Hostel ID and Room ID are required" });
    }

    // Verify ownership
    const hostel = await prisma.hostel.findUnique({
      where: { id: parseInt(hostelId) },
      select: { ownerId: true },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (hostel.ownerId !== userId && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this hostel" });
    }

    const room = await prisma.room.findUnique({
      where: {
        id: +roomId,
      },
      include: {
        stays: {
          where: { status: "ACTIVE" },
          include: {
            hosteller: {
              include: {
                hostellerProfile: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        roomAmenities: {
          include: { amenity: true },
        },
        hostel: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      success: true,
      message: "Room details retrieved successfully",
      data: room,
    });
  } catch (error) {
    console.error("Get room details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Hostel Media
export const deleteHostelMedia = async (req, res) => {
  try {
    const { hostelId, mediaId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Verify hostel ownership
    let hostelQuery = { id: parseInt(hostelId) };
    if (userRole !== "ADMIN") hostelQuery.ownerId = userId;

    const hostel = await prisma.hostel.findFirst({
      where: hostelQuery,
      include: {
        media: {
          where: { id: parseInt(mediaId) },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found or access denied",
      });
    }

    if (hostel.media.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const mediaToDelete = hostel.media[0];

    // Delete from Cloudinary if it's a Cloudinary image
    if (mediaToDelete.url && mediaToDelete.url.includes("cloudinary")) {
      try {
        const publicId = mediaToDelete.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`Hop-In/hostels/${publicId}`);
      } catch (cloudinaryError) {
        console.warn("Failed to delete from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await prisma.hostelMedia.delete({
      where: { id: parseInt(mediaId) },
    });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete hostel media error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
};

// Update Hostel Media
export const updateHostelMedia = async (req, res) => {
  try {
    const { hostelId, mediaId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { isCover, sortOrder } = req.body;

    // Verify hostel ownership
    let hostelQuery = { id: parseInt(hostelId) };
    if (userRole !== "ADMIN") hostelQuery.ownerId = userId;

    const hostel = await prisma.hostel.findFirst({
      where: hostelQuery,
      include: {
        media: {
          where: { id: parseInt(mediaId) },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found or access denied",
      });
    }

    if (hostel.media.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const mediaToUpdate = hostel.media[0];

    // If setting as cover, unset all other cover images first
    if (isCover) {
      await prisma.hostelMedia.updateMany({
        where: {
          hostelId: parseInt(hostelId),
          id: { not: parseInt(mediaId) },
        },
        data: { isCover: false },
      });
    }

    // Update the media
    const updatedMedia = await prisma.hostelMedia.update({
      where: { id: parseInt(mediaId) },
      data: {
        ...(isCover !== undefined && { isCover }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Media updated successfully",
      data: updatedMedia,
    });
  } catch (error) {
    console.error("Update hostel media error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update media",
    });
  }
};

// Upload Hostel Media (for editing)
export const uploadHostelMedia = async (req, res) => {
  try {
    console.log("=== UPLOAD DEBUG ===");
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    console.log("hostelId:", req.params.hostelId);

    const { hostelId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const files = req.files;

    if (!files || files.length === 0) {
      console.log("No files received");
      return res.status(400).json({
        success: false,
        message: "No files received",
      });
    }

    // Verify hostel ownership
    let hostelQuery = { id: parseInt(hostelId) };
    if (userRole !== "ADMIN") hostelQuery.ownerId = userId;

    const hostel = await prisma.hostel.findFirst({
      where: hostelQuery,
      include: {
        media: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found or access denied",
      });
    }

    // Check image limit
    const currentMediaCount = hostel.media.length;
    if (currentMediaCount + files.length > 6) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${
          files.length
        } images. Maximum 6 images allowed (${
          6 - currentMediaCount
        } slots remaining)`,
      });
    }

    // Process uploaded files with metadata
    const newMediaItems = [];
    let hasCoverImage = hostel.media.some((img) => img.isCover);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageDataKey = `imageData[${i}]`;
      const imageData = req.body[imageDataKey]
        ? JSON.parse(req.body[imageDataKey])
        : {};

      // If this is marked as cover, unset existing cover first
      if (imageData.isCover && hasCoverImage) {
        await prisma.hostelMedia.updateMany({
          where: { hostelId: parseInt(hostelId) },
          data: { isCover: false },
        });
        hasCoverImage = false;
      }

      // Set first image as cover if no cover exists
      const shouldBeCover =
        imageData.isCover ||
        (!hasCoverImage && currentMediaCount === 0 && i === 0);

      newMediaItems.push({
        hostelId: parseInt(hostelId),
        url: file.path,
        mediaType: imageData.mediaType || "IMAGE",
        isCover: shouldBeCover,
        sortOrder: currentMediaCount + i,
      });

      if (shouldBeCover) hasCoverImage = true;
    }

    // Create new media records
    const createdMedia = await prisma.hostelMedia.createMany({
      data: newMediaItems,
    });

    // Fetch the complete updated media list
    const allMedia = await prisma.hostelMedia.findMany({
      where: { hostelId: parseInt(hostelId) },
      orderBy: { sortOrder: "asc" },
    });

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${files.length} images`,
      data: {
        uploaded: files.length,
        media: allMedia,
      },
    });
  } catch (error) {
    console.error("Upload hostel media error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
    });
  }
};
