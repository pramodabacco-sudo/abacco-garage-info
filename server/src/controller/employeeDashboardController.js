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

      res.status(200).json({
        totalVisits,
        interestedLeads,
        followUps,
        convertedLeads,
        recentVisits,

        isWorking:
          !!activeAttendance,
      });

} catch (error) {

  console.log(error);

  res.status(500).json({
    message: error.message,
  });
}
  };