import express from "express";

import {
  checkIn,
  checkOut,
  getAttendance,
} from "../controller/attendanceController.js";

const router =
  express.Router();

router.post(
  "/check-in",
  checkIn
);

router.post(
  "/check-out",
  checkOut
);

router.get(
  "/",
  getAttendance
);

export default router;