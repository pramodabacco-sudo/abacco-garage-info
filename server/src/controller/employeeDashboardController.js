import prisma from "../config/prisma.js";

export const getEmployeeDashboard =
  async (req, res) => {
    try {

      const { userId } =
        req.params;

      const totalVisits =
        await prisma.garageVisit.count({
          where: {
            employeeId:
              userId,
          },
        });

      const interestedLeads =
        await prisma.garageVisit.count({
          where: {
            employeeId:
              userId,

            leadStatus:
              "INTERESTED",
          },
        });

      const followUps =
        await prisma.garageVisit.count({
          where: {
            employeeId:
              userId,

            leadStatus:
              "FOLLOW_UP",
          },
        });

      const convertedLeads =
        await prisma.garageVisit.count({
          where: {
            employeeId:
              userId,

           leadStatus: "DEAL",
          },
        });

      const recentVisits =
        await prisma.garageVisit.findMany({
          where: {
            employeeId:
              userId,
          },

          include: {
            images: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },

          take: 5,
        });

      const activeAttendance =
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

      const totalSchools =
        await prisma.school.count({
          where: {
            employeeId: userId,
          },
        });

      const schoolsVisited =
        await prisma.school.count({
          where: {
            employeeId: userId,
            responseStatus: "VISITED",
          },
        });

      const interestedSchools =
        await prisma.school.count({
          where: {
            employeeId: userId,
            responseStatus: "INTERESTED",
          },
        });

      const demoScheduledSchools =
        await prisma.school.count({
          where: {
            employeeId: userId,
            responseStatus: "DEMO_SCHEDULED",
          },
        });

      const customerSchools =
        await prisma.school.count({
          where: {
            employeeId: userId,
            responseStatus: "CUSTOMER",
          },
        });

      const schoolFollowUpsPending =
        await prisma.school.count({
          where: {
            employeeId: userId,
            responseStatus: "FOLLOW_UP",
            followUpDate: {
              not: null,
            },
          },
        });

      const recentSchools =
        await prisma.school.findMany({
          where: {
            employeeId: userId,
          },

          include: {
            images: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 5,
        });

      res.status(200).json({
        totalVisits,
        interestedLeads,
        followUps,
        convertedLeads,
        recentVisits,

        isWorking:
          !!activeAttendance,

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