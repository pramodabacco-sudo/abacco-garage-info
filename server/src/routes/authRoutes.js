import express from "express";

import {
  registerUser,
  loginUser,
  getEmployees,
  toggleEmployeeStatus,
} from "../controller/authController.js";

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/employees",
  getEmployees
);

router.put(
  "/toggle/:id",
  toggleEmployeeStatus
);

export default router;