import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  createSchool,
  getSchools,
  getEmployeeSchools,
  getSingleSchool,
  updateSchool,
  getEmployeeTodaySchoolFollowUps,
} from "../controller/schoolController.js";

const router = express.Router();

// CREATE
router.post(
  "/create",
  upload.array("images", 10),
  createSchool
);

// GET ALL (ADMIN)
router.get("/", getSchools);

// EMPLOYEE ROUTES
router.get(
  "/employee/:userId/today-followups",
  getEmployeeTodaySchoolFollowUps
);

router.get(
  "/employee/:userId",
  getEmployeeSchools
);

// GET SINGLE
router.get("/:id", getSingleSchool);

// UPDATE (full edit or quick-edit)
router.put("/:id", updateSchool);

export default router;