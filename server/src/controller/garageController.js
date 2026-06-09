import prisma from "../config/prisma.js";
import { uploadToCloudflare } from "../utils/cloudflare.js";


// CREATE GARAGE VISIT
export const createGarageVisit = async (req, res) => {
  try {
    const {
      shopName,
      address,
      location,
      phoneNumber,
       garageType,
      leadStatus,
      followUpDate,
      notes,
      employeeId,
    } = req.body;

    if (
      !shopName ||
      !address ||
      !phoneNumber ||
      !employeeId ||
      !garageType  
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const garageVisit =
    await prisma.garageVisit.create({
        data: {
        shopName,
        address,
        location,
        phoneNumber,
        garageType,
        leadStatus:
           leadStatus || "FIRST_VISIT",

    followUpDate:
      followUpDate
        ? new Date(followUpDate)
        : null,

        notes,
        employeeId,
        },
    });

    // MULTIPLE IMAGE UPLOAD
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        const uploaded =
          await uploadToCloudflare(
            file,
            garageVisit.id
            )

        uploadedImages.push({
          imageUrl: uploaded.imageUrl,
          publicId: uploaded.publicId,
          garageVisitId: garageVisit.id,
        });
      }

      await prisma.garageImage.createMany({
        data: uploadedImages,
      });
    }

    const finalData =
      await prisma.garageVisit.findUnique({
        where: {
          id: garageVisit.id,
        },

        include: {
          images: true,
          employee: true,
        },
      });

    res.status(201).json({
      message: "Garage visit created",
      data: finalData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};



// GET ALL GARAGE VISITS
export const getGarageVisits = async (
  req,
  res
) => {
  try {
    const visits =
      await prisma.garageVisit.findMany({
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

    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEmployeeGarageVisits = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    console.log("userId:", userId);

    const visits =
      await prisma.garageVisit.findMany({
        where: {
          employeeId: userId,
        },

        include: {
          images: true,
          employee: true,
        },
      });

    console.log("visits:", visits);

    res.status(200).json(visits);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE GARAGE VISIT
export const getSingleGarageVisit = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const visit =
      await prisma.garageVisit.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
          employee: true,
        },
      });

    if (!visit) {
      return res.status(404).json({
        message: "Visit not found",
      });
    }

    res.status(200).json(visit);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE GARAGE VISIT
export const updateGarageVisit =
  async (req, res) => {
    try {

      const { id } = req.params;

      const {
        shopName,
        address,
        location,
        phoneNumber,
        garageType,
        leadStatus,
        followUpDate,
        notes,
      } = req.body;

      const updatedVisit =
        await prisma.garageVisit.update({
          where: {
            id,
          },

        data: {
          shopName,
          address,
          location,
          phoneNumber,
          garageType,
          leadStatus,

          followUpDate:
            followUpDate
              ? new Date(followUpDate)
              : null,

          notes,
        },

          include: {
            images: true,
            employee: true,
          },
        });

      res.status(200).json({
        message:
          "Garage updated successfully",

        data: updatedVisit,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

  // server/controller/garageController.js

export const getEmployeeTodayFollowUps = async (req, res) => {
  try {
    const { userId } = req.params;

    // Generate local start and end of "Today"
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 5, 59, 999);

    const followUps = await prisma.garageVisit.findMany({
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
    console.error("Error fetching today's follow-ups:", error);
    res.status(500).json({ message: error.message });
  }
};