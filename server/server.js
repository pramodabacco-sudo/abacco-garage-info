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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_MOBILE_URL,
  process.env.CLIENT_ANDROID_URL,
  "http://localhost",
  "http://localhost:5173",
  "capacitor://localhost",
];

app.use(
  cors({
    origin: (origin, callback) => {

      // mobile apps / postman
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin =
        origin.replace(/\/$/, "");

      const isAllowed =
        allowedOrigins.some(
          (allowedOrigin) =>
            allowedOrigin &&
            normalizedOrigin ===
              allowedOrigin.replace(
                /\/$/,
                ""
              )
        );

      if (isAllowed) {
        return callback(null, true);
      }

      console.log(
        "Blocked Origin:",
        origin
      );

      return callback(
        new Error(
          `CORS blocked for origin: ${origin}`
        )
      );
    },

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