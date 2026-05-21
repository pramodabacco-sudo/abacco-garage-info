import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  createGarageVisit,
  getGarageVisits,
  getSingleGarageVisit,
  updateGarageVisit,
} from "../controller/garageController.js";

const router = express.Router();


// CREATE
router.post(
  "/create",
  upload.array("images", 10),
  createGarageVisit
);


// GET ALL
router.get("/", getGarageVisits);


// GET SINGLE
router.get("/:id", getSingleGarageVisit);

// UPDATE
router.put(
  "/:id",
  updateGarageVisit
);

export default router;