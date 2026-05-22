import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import employeeDashboardRoutes from "./src/routes/employeeDashboardRoutes.js";
import garageRoutes from "./src/routes/garageRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import locationRoutes from "./src/routes/locationRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/employee-dashboard",
  employeeDashboardRoutes
);
app.use("/api/garage", garageRoutes);
app.use( "/api/attendance", attendanceRoutes);
app.use(
  "/api/location",
  locationRoutes
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});