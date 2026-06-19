// server/src/services/vehicleTracking.cron.js
// ═══════════════════════════════════════════════════════════════════════════════
// GPS VEHICLE TRACKING CRON
//
// Runs every 2 minutes:
//   1. Calls GPS API → gets current location of ALL vehicles on that account
//   2. For each vehicle in the response → lookup our Vehicle table by regNo
//   3. If found (and isActive) → store a VehicleLocation row + update the
//      Vehicle's "latest*" snapshot fields
//   4. If not found → skip (vehicle not registered in our system)
//
// Token and email are in .env — never exposed to the frontend
// ═══════════════════════════════════════════════════════════════════════════════

import prisma from "../config/prisma.js";

const GPS_API_BASE = process.env.GPS_API_BASE;
const GPS_API_TOKEN = process.env.GPS_API_TOKEN;
const GPS_API_EMAIL = process.env.GPS_API_EMAIL;

let isRunning = false; // prevent overlapping runs

// ─────────────────────────────────────────────────────────────────────────────
// FETCH from GPS API
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGPSData() {
  const url = `${GPS_API_BASE}/get_current_data?token=${GPS_API_TOKEN}&email=${GPS_API_EMAIL}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(10000), // 10 second timeout
  });

  if (!res.ok) {
    throw new Error(`GPS API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // API returns an array of vehicle objects
  if (!Array.isArray(data)) {
    throw new Error(`GPS API unexpected response: ${JSON.stringify(data)}`);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS ONE VEHICLE from the API response
// ─────────────────────────────────────────────────────────────────────────────
async function processVehicle(apiVehicle) {
  const regNo = apiVehicle.regNo?.toUpperCase()?.trim();
  if (!regNo) return;

  // Match regNo to our Vehicle table — only store data for registered vehicles
  const vehicle = await prisma.vehicle.findFirst({
    where: { regNo, isActive: true },
    select: { id: true, regNo: true },
  });

  if (!vehicle) {
    // Vehicle not registered in our system (or inactive) — skip
    return;
  }

  const gpsTimestamp = apiVehicle.isoDate ? new Date(apiVehicle.isoDate) : null;

  // Store location history snapshot
  await prisma.vehicleLocation.create({
    data: {
      vehicleId: vehicle.id,
      regNo: vehicle.regNo,

      latitude: apiVehicle.latitude ?? null,
      longitude: apiVehicle.longitude ?? null,
      speed: apiVehicle.speed ?? null,
      bearing: apiVehicle.bearing ?? null,

      status: apiVehicle.status ?? null,
      ignitionStatus: apiVehicle.ignitionStatus ?? null,
      vehicleStatus: apiVehicle.vehicleStatus ?? null,

      address: apiVehicle.address ?? null,
      odoDistance: apiVehicle.odoDistance ?? null,
      fuelLitre: apiVehicle.fuelLitre ?? null,

      gpsTimestamp,

      rawData: apiVehicle, // full API response for debugging
    },
  });

  // Update the Vehicle's "latest known location" snapshot for fast list view
  await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: {
      latestLatitude: apiVehicle.latitude ?? null,
      latestLongitude: apiVehicle.longitude ?? null,
      latestSpeed: apiVehicle.speed ?? null,
      latestAddress: apiVehicle.address ?? null,
      latestStatus: apiVehicle.vehicleStatus ?? null,
      latestIgnition: apiVehicle.ignitionStatus ?? null,
      lastSeenAt: gpsTimestamp || new Date(),
    },
  });

  console.log(
    `[GPS] Stored: ${regNo} | status=${apiVehicle.status} | speed=${apiVehicle.speed}km/h | ${apiVehicle.address?.slice(0, 50)}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN POLL FUNCTION — called every 2 minutes
// ─────────────────────────────────────────────────────────────────────────────
async function pollGPS() {
  if (isRunning) {
    console.log("[GPS] Previous poll still running — skipping this tick");
    return;
  }

  isRunning = true;

  try {
    if (!GPS_API_BASE || !GPS_API_TOKEN || !GPS_API_EMAIL) {
      console.warn(
        "[GPS] Missing GPS_API_BASE / GPS_API_TOKEN / GPS_API_EMAIL in .env — skipping poll"
      );
      return;
    }

    const vehicles = await fetchGPSData();
    console.log(`[GPS] Poll: ${vehicles.length} vehicle(s) from API`);

    // Process all vehicles in parallel; only ones matching our Vehicle table get stored
    await Promise.allSettled(vehicles.map(processVehicle));
  } catch (err) {
    console.error("[GPS] Poll failed:", err.message);
  } finally {
    isRunning = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// START CRON — call this once from server.js
// ─────────────────────────────────────────────────────────────────────────────
export function startVehicleTrackingCron() {
  if (!GPS_API_TOKEN || !GPS_API_EMAIL) {
    console.warn("[GPS] GPS env vars not set — vehicle tracking cron NOT started");
    return;
  }

  console.log("[GPS] Vehicle tracking cron started — polling every 2 minutes");

  // Run immediately on startup
  pollGPS();

  // Then every 2 minutes
  setInterval(pollGPS, 2 * 60 * 1000);
}