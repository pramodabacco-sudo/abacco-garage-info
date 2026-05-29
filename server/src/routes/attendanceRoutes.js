import express from "express";

import {
  checkIn,
  checkOut,
  getAttendance,
  getActiveAttendance,
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
  "/active/:userId",
  getActiveAttendance
);

router.get(
  "/",
  getAttendance
);

export default router;