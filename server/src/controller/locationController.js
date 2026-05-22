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

      // check attendance exists
      const attendance =
        await prisma.employeeAttendance.findUnique({
          where: {
            id: attendanceId,
          },
        });

      if (!attendance) {

        return res.status(400).json({
          message:
            "Invalid attendance session",
        });
      }

      const location =
        await prisma.employeeLocation.create({
          data: {
            userId,
            attendanceId,
            latitude,
            longitude,

            address:
              typeof address ===
                "string" &&
              address.trim() !== ""
                ? address
                : "Unknown Location",
          },
        });

      res.status(201).json(
        location
      );

    } catch (error) {

      console.log(
        "SAVE LOCATION ERROR:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };