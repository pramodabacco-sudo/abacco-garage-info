import { useEffect, useRef, useState } from "react";
import {
  Plus,
  MapPin,
  Navigation,
  Clock,
  Zap,
  Loader2,
  RefreshCw,
  Trash2,
  X,
  User as UserIcon,
} from "lucide-react";
import API from "../../api/axios";

const STATUS_STYLES = {
  MOVING: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Moving" },
  PARKED: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400", label: "Parked" },
  IDLE: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "Idle" },
  OFF: { bg: "bg-neutral-100", text: "text-neutral-600", dot: "bg-neutral-400", label: "Off" },
  NODATA: { bg: "bg-neutral-50", text: "text-neutral-400", dot: "bg-neutral-300", label: "No Data" },
};

const timeAgo = (dt) => {
  if (!dt) return "—";
  const secs = Math.floor((Date.now() - new Date(dt)) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const [employeeFilter, setEmployeeFilter] = useState("ALL");

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", regNo: "", employeeId: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchVehicles = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const response = await API.get("/api/vehicles");
      setVehicles(response.data);
      setErrorMsg("");
      setCountdown(120);
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to load vehicles.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await API.get("/api/auth/employees");
      setEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchEmployees();

    // Auto-refresh every 2 minutes, in sync with backend cron interval
    pollRef.current = setInterval(() => fetchVehicles(true), 2 * 60 * 1000);

    // Countdown ticker for the UI
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 120 : c - 1));
    }, 1000);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.regNo.trim() || !form.employeeId) {
      setFormError("Vehicle name, registration number, and employee are all required.");
      return;
    }

    try {
      setSaving(true);
      const response = await API.post("/api/vehicles/create", {
        name: form.name.trim(),
        regNo: form.regNo.trim().toUpperCase(),
        employeeId: form.employeeId,
      });

      setVehicles((prev) => [response.data.data, ...prev]);
      setForm({ name: "", regNo: "", employeeId: "" });
      setShowAddModal(false);
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to add vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this vehicle from tracking?")) return;

    try {
      await API.delete(`/api/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to remove vehicle.");
    }
  };

  const filteredVehicles =
    employeeFilter === "ALL"
      ? vehicles
      : vehicles.filter((v) => v.employeeId === employeeFilter);

  const moving = filteredVehicles.filter((v) => v.latestStatus === "MOVING");
  const parked = filteredVehicles.filter((v) => v.latestStatus === "PARKED");
  const noData = filteredVehicles.filter((v) => !v.lastSeenAt);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-4 sm:p-10 font-sans antialiased">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
            — LIVE GPS TRACKING —
          </p>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            Vehicle Tracking
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Live location of employee vehicles, updated every 2 minutes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVehicles(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : `Refresh (${countdown}s)`}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Employee Filter */}
      <div className="mb-6">
        <select
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="bg-white border border-neutral-200 rounded px-3 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors w-full sm:w-72"
        >
          <option value="ALL">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">Total</p>
          <h2 className="text-3xl font-light text-neutral-900">{filteredVehicles.length}</h2>
        </div>
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">Moving</p>
          <h2 className="text-3xl font-light text-green-600">{moving.length}</h2>
        </div>
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">Parked</p>
          <h2 className="text-3xl font-light text-indigo-600">{parked.length}</h2>
        </div>
        <div className="bg-white border border-neutral-200 p-5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">No Data</p>
          <h2 className="text-3xl font-light text-neutral-400">{noData.length}</h2>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 text-xs border-l-4 border-red-500">
          {errorMsg}
        </div>
      )}

      {loading && (
        <div className="py-20 text-center text-neutral-400">Loading vehicles...</div>
      )}

      {!loading && filteredVehicles.length === 0 && (
        <div className="py-20 text-center border border-dashed border-neutral-200 bg-white">
          <p className="text-neutral-400 text-sm">
            {vehicles.length === 0
              ? "No vehicles added yet."
              : "No vehicles match this employee filter."}
          </p>
          {vehicles.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 text-xs uppercase tracking-wider text-neutral-900 font-bold border-b border-neutral-900 pb-0.5"
            >
              Add your first vehicle
            </button>
          )}
        </div>
      )}

      {/* Vehicle Cards */}
      {!loading && filteredVehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            const style = STATUS_STYLES[vehicle.latestStatus] || STATUS_STYLES.NODATA;
            const hasCoords = vehicle.latestLatitude != null && vehicle.latestLongitude != null;

            return (
              <div
                key={vehicle.id}
                className="bg-white border border-neutral-200 p-5 flex flex-col gap-3"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono font-bold text-base tracking-wide text-neutral-900">
                      {vehicle.regNo}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{vehicle.name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {style.label}
                    </span>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-neutral-300 hover:text-red-500 transition-colors"
                      title="Remove vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Assigned employee */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 bg-neutral-50 px-2.5 py-1.5 rounded w-fit">
                  <UserIcon className="w-3 h-3 text-neutral-400" />
                  {vehicle.employee?.name || "Unassigned"}
                </div>

                <p className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Clock className="w-3 h-3" /> {timeAgo(vehicle.lastSeenAt)}
                </p>

                {vehicle.lastSeenAt ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-50 rounded p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Speed</p>
                        <p className="text-lg font-semibold text-neutral-900">
                          {vehicle.latestSpeed ?? 0}{" "}
                          <span className="text-[11px] font-normal text-neutral-500">km/h</span>
                        </p>
                      </div>
                      <div className="bg-neutral-50 rounded p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Ignition</p>
                        <p className="text-sm font-semibold text-neutral-900 flex items-center gap-1 mt-0.5">
                          <Zap className="w-3.5 h-3.5" />
                          {vehicle.latestIgnition || "—"}
                        </p>
                      </div>
                    </div>

                    {vehicle.latestAddress && (
                      <div className="flex items-start gap-2 bg-green-50 px-3 py-2 rounded text-xs text-green-700 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {vehicle.latestAddress}
                      </div>
                    )}

                    {hasCoords && (
                      <a
                        href={`https://www.google.com/maps?q=${vehicle.latestLatitude},${vehicle.latestLongitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
                      </a>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-400 bg-neutral-50">
                    No GPS signal received yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200 p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                  Add Vehicle
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Assign this vehicle to an employee for location tracking.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs border-l-4 border-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 font-bold">
                  Assign to Employee
                </label>
                <select
                  value={form.employeeId}
                  onChange={(e) => setForm((prev) => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
                {employees.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1.5">
                    No employees found. Add an employee first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 font-bold">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Delivery Scooty 1"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 font-bold">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={form.regNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, regNo: e.target.value.toUpperCase() }))}
                  placeholder="e.g. KA50EL0766"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm font-mono tracking-wide outline-none focus:border-zinc-900 transition-colors"
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  Must exactly match the reg no on the GPS device feed.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Adding..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;