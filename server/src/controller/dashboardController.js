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
  leadStatus: "DEAL"
          },
        });

      const checkedInEmployees =
        await prisma.employeeAttendance.count({
          where: {
            status:
              "CHECKED_IN",
          },
        });

      const totalSchools =
        await prisma.school.count();

      const schoolsVisited =
        await prisma.school.count({
          where: {
            responseStatus: "VISITED",
          },
        });

      const interestedSchools =
        await prisma.school.count({
          where: {
            responseStatus: "INTERESTED",
          },
        });

      const demoScheduledSchools =
        await prisma.school.count({
          where: {
            responseStatus: "DEMO_SCHEDULED",
          },
        });

      const customerSchools =
        await prisma.school.count({
          where: {
            responseStatus: "CUSTOMER",
          },
        });

      const schoolFollowUpsPending =
        await prisma.school.count({
          where: {
            responseStatus: "FOLLOW_UP",
            followUpDate: {
              not: null,
            },
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

      const recentSchools =
        await prisma.school.findMany({
          take: 5,

          orderBy: {
            createdAt: "desc",
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
        totalSchools,
        schoolsVisited,
        interestedSchools,
        demoScheduledSchools,
        customerSchools,
        schoolFollowUpsPending,
        recentSchools,
      });

} catch (error) {

  console.log(error);

  res.status(500).json({
    message: error.message,
  });
}
  };