import prisma from "../config/prisma.js";
import { uploadToCloudflare } from "../utils/cloudflare.js";

// CREATE SCHOOL
export const createSchool = async (req, res) => {
  try {
    const {
      schoolName,
      contactPerson,
      designation,
      phoneNumber,
      email,
      address,
      city,
      district,
      state,
      latitude,
      longitude,
      responseStatus,
      followUpDate,
      notes,
      employeeId,
    } = req.body;

    
    if (!schoolName || !employeeId) {
      return res.status(400).json({
        message: "School name is required",
      });
    }

    const school = await prisma.school.create({
      data: {
        schoolName,
        contactPerson,
        designation,
        phoneNumber,
        email,
        address,
        city,
        district,
        state,

        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,

        responseStatus: responseStatus || "NOT_CONTACTED",

        followUpDate: followUpDate ? new Date(followUpDate) : null,

        notes,
        employeeId,
      },
    });

    // MULTIPLE IMAGE UPLOAD
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        const uploaded = await uploadToCloudflare(file, school.id);

        uploadedImages.push({
          imageUrl: uploaded.imageUrl,
          publicId: uploaded.publicId,
          schoolId: school.id,
        });
      }

      await prisma.schoolImage.createMany({
        data: uploadedImages,
      });
    }

    const finalData = await prisma.school.findUnique({
      where: {
        id: school.id,
      },

      include: {
        images: true,
        employee: true,
      },
    });

    res.status(201).json({
      message: "School lead created",
      data: finalData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL SCHOOLS (ADMIN)
export const getSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        images: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SCHOOLS FOR ONE EMPLOYEE
export const getEmployeeSchools = async (req, res) => {
  try {
    const { userId } = req.params;

    const schools = await prisma.school.findMany({
      where: {
        employeeId: userId,
      },

      include: {
        images: true,
        employee: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(schools);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE SCHOOL
export const getSingleSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await prisma.school.findUnique({
      where: {
        id,
      },

      include: {
        images: true,
        employee: true,
      },
    });

    if (!school) {
      return res.status(404).json({
        message: "School not found",
      });
    }

    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE SCHOOL
export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      schoolName,
      contactPerson,
      designation,
      phoneNumber,
      email,
      address,
      city,
      district,
      state,
      latitude,
      longitude,
      responseStatus,
      followUpDate,
      notes,
    } = req.body;

    // Build a partial update payload so quick-edits (e.g. only
    // responseStatus + followUpDate from the list page) don't
    // overwrite other fields with undefined.
    const data = {};

    if (schoolName !== undefined) data.schoolName = schoolName;
    if (contactPerson !== undefined) data.contactPerson = contactPerson;
    if (designation !== undefined) data.designation = designation;
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;
    if (email !== undefined) data.email = email;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (district !== undefined) data.district = district;
    if (state !== undefined) data.state = state;

    if (latitude !== undefined) {
      data.latitude = latitude !== null && latitude !== "" ? parseFloat(latitude) : null;
    }
    if (longitude !== undefined) {
      data.longitude = longitude !== null && longitude !== "" ? parseFloat(longitude) : null;
    }

    if (responseStatus !== undefined) data.responseStatus = responseStatus;

    if (followUpDate !== undefined) {
      data.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    if (notes !== undefined) data.notes = notes;

    const updatedSchool = await prisma.school.update({
      where: {
        id,
      },

      data,

      include: {
        images: true,
        employee: true,
      },
    });

    res.status(200).json({
      message: "School updated successfully",
      data: updatedSchool,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET TODAY'S FOLLOW UPS FOR AN EMPLOYEE
export const getEmployeeTodaySchoolFollowUps = async (req, res) => {
  try {
    const { userId } = req.params;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const followUps = await prisma.school.findMany({
      where: {
        employeeId: userId,
        followUpDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        images: true,
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(followUps);
  } catch (error) {
    console.error("Error fetching today's school follow-ups:", error);
    res.status(500).json({ message: error.message });
  }
};