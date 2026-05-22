import prisma from "../config/prisma.js";

export const saveLocation =
  async (req, res) => {

    try {

      const {
        userId,
        attendanceId,
        latitude,
        longitude,
        address,
      } = req.body;

      const location =
        await prisma.employeeLocation.create({
          data: {
            userId,
            attendanceId,
            latitude,
            longitude,
            address:
              address ||
              "Unknown Location",
          },
        });

      res.status(201).json(
        location
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };