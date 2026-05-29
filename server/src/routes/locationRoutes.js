import express from "express";

import {
  saveLocation,
  saveManualLocation,
  getEmployeeLocations,
} from "../controller/locationController.js";

const router =
  express.Router();

router.post(
  "/save",
  saveLocation
);

router.post(
  "/manual-save",
  saveManualLocation
);

router.get(
  "/employee/:userId",
  getEmployeeLocations
);

export default router;




// import express from "express";

// import {
//   saveLocation,
// } from "../controller/locationController.js";

// const router =
//   express.Router();

// router.post(
//   "/save",
//   saveLocation
// );

// export default router;