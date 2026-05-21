import prisma from "../config/prisma.js";


// CHECK IN
export const checkIn =
  async (req, res) => {
    try {

      const { userId } =
        req.body;

      const existing =
        await prisma.employeeAttendance.findFirst({
          where: {
            userId,
            status:
              "CHECKED_IN",
          },
        });

      if (existing) {
        return res.status(400).json({
          message:
            "Already checked in",
        });
      }

      const attendance =
        await prisma.employeeAttendance.create({
          data: {
            userId,

            checkInTime:
              new Date(),

            status:
              "CHECKED_IN",
          },
        });

      res.status(201).json({
        message:
          "Checked in successfully",

        attendance,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


// CHECK OUT
export const checkOut =
  async (req, res) => {
    try {

      const { userId } =
        req.body;

      const attendance =
        await prisma.employeeAttendance.findFirst({
          where: {
            userId,

            status:
              "CHECKED_IN",
          },

          orderBy: {
            createdAt:
              "desc",
          },
        });

      if (!attendance) {
        return res.status(404).json({
          message:
            "No active check-in found",
        });
      }

      const updated =
        await prisma.employeeAttendance.update({
          where: {
            id:
              attendance.id,
          },

          data: {
            checkOutTime:
              new Date(),

            status:
              "CHECKED_OUT",
          },
        });

      res.status(200).json({
        message:
          "Checked out successfully",

        attendance:
          updated,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


// GET ALL ATTENDANCE
export const getAttendance =
  async (req, res) => {
    try {

      const data =
        await prisma.employeeAttendance.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },

          orderBy: {
            createdAt:
              "desc",
          },
        });

      res.status(200).json(
        data
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };