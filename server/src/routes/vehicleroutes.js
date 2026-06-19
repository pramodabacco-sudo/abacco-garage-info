import express from "express";

import {
  createVehicle,
  getVehicles,
  getEmployeeVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controller/vehicleController.js";

const router = express.Router();

// CREATE (admin adds: name + reg no + assigned employee)
router.post("/create", createVehicle);

// GET ALL (ADMIN — with latest location snapshot + employee)
router.get("/", getVehicles);

// GET VEHICLES FOR ONE EMPLOYEE (must come before "/:id")
router.get("/employee/:userId", getEmployeeVehicles);

// GET SINGLE (with location history)
router.get("/:id", getSingleVehicle);

// UPDATE (name / active status / reassign employee)
router.put("/:id", updateVehicle);

// DELETE
router.delete("/:id", deleteVehicle);

export default router;