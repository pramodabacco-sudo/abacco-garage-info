import prisma from "../config/prisma.js";

export const getDashboardStats =
  async (req, res) => {
    try {

      const totalEmployees =
        await prisma.user.count({
          where: {
            role:
              "EMPLOYEE",
          },
        });

      const activeEmployees =
        await prisma.user.count({
          where: {
            role:
              "EMPLOYEE",

            isActive: true,
          },
        });

      const totalGarages =
        await prisma.garageVisit.count();

      const interestedLeads =
        await prisma.garageVisit.count({
          where: {
            leadStatus:
              "INTERESTED",
          },
        });

      const followUps =
        await prisma.garageVisit.count({
          where: {
            leadStatus:
              "FOLLOW_UP",
          },
        });

      const convertedLeads =
        await prisma.garageVisit.count({
          where: {
            leadStatus:
              "CONVERTED",
          },
        });

      const checkedInEmployees =
        await prisma.employeeAttendance.count({
          where: {
            status:
              "CHECKED_IN",
          },
        });

      const recentGarages =
        await prisma.garageVisit.findMany({
          take: 5,

          orderBy: {
            createdAt:
              "desc",
          },

          include: {
            employee: true,
            images: true,
          },
        });

      res.status(200).json({
        totalEmployees,
        activeEmployees,
        totalGarages,
        interestedLeads,
        followUps,
        convertedLeads,
        checkedInEmployees,
        recentGarages,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };