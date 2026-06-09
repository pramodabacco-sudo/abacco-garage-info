import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  createGarageVisit,
  getGarageVisits,
  getSingleGarageVisit,
  updateGarageVisit,
  getEmployeeGarageVisits,
  getEmployeeTodayFollowUps,
} from "../controller/garageController.js";

const router = express.Router();
// GET ALL
router.get("/", getGarageVisits);

// EMPLOYEE ROUTES
router.get(
  "/employee/:userId/today-followups",
  getEmployeeTodayFollowUps
);

router.get(
  "/employee/:userId",
  getEmployeeGarageVisits
);

// GET SINGLE
router.get("/:id", getSingleGarageVisit);

// UPDATE
router.put("/:id", updateGarageVisit);

export default router;