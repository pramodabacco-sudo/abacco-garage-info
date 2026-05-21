import express from "express";

import {
  getEmployeeDashboard,
} from "../controller/employeeDashboardController.js";

const router =
  express.Router();

router.get(
  "/:userId",
  getEmployeeDashboard
);

export default router;