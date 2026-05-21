import express from "express";

import {
  saveLocation,
} from "../controller/locationController.js";

const router =
  express.Router();

router.post(
  "/save",
  saveLocation
);

export default router;