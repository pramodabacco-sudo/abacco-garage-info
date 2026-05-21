import prisma from "../config/prisma.js";

export const saveLocation =
  async (req, res) => {

    try {

      const {
        userId,
        attendanceId,
        latitude,
        longitude,
      } = req.body;

      let address =
        "Unknown Location";

      try {

      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "User-Agent":
                "abacco-garage-app",
            },
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (data?.display_name) {

        address =
          data.display_name;
      }

      } catch (error) {

        console.log(
          "Address fetch failed"
        );
      }

      const location =
        await prisma.employeeLocation.create({
          data: {
            userId,
            attendanceId,
            latitude,
            longitude,
            address,
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