import prisma from "../config/prisma.js";

// CREATE VEHICLE (admin adds: name + reg no + assigned employee)
export const createVehicle = async (req, res) => {
  try {
    const { name, regNo, employeeId } = req.body;

    if (!name || !regNo || !employeeId) {
      return res.status(400).json({
        message: "Vehicle name, registration number, and employee are required",
      });
    }

    const normalizedRegNo = regNo.toUpperCase().trim();

    const existing = await prisma.vehicle.findUnique({
      where: { regNo: normalizedRegNo },
    });

    if (existing) {
      return res.status(400).json({
        message: "A vehicle with this registration number already exists",
      });
    }

    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Selected employee not found",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        regNo: normalizedRegNo,
        employeeId,
      },

      include: {
        employee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      data: vehicle,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL VEHICLES (ADMIN — with latest known location + employee)
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        employee: {
          select: { id: true, name: true, email: true },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET VEHICLES FOR ONE EMPLOYEE
export const getEmployeeVehicles = async (req, res) => {
  try {
    const { userId } = req.params;

    const vehicles = await prisma.vehicle.findMany({
      where: {
        employeeId: userId,
      },

      include: {
        employee: {
          select: { id: true, name: true, email: true },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(vehicles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE VEHICLE WITH RECENT LOCATION HISTORY
export const getSingleVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },

      include: {
        employee: {
          select: { id: true, name: true, email: true },
        },
        locations: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE VEHICLE (name, active status, reassign employee)
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, employeeId } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (isActive !== undefined) data.isActive = isActive;
    if (employeeId !== undefined) data.employeeId = employeeId;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,

      include: {
        employee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE VEHICLE
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.vehicle.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Vehicle removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};