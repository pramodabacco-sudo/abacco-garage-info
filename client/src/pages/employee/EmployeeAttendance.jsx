import { useEffect, useState } from "react";
import { 
  Play, 
  Square, 
  MapPin, 
  FileText, 
  CheckCircle, 
  MapPinOff, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import API from "../../api/axios";

const EmployeeAttendance = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updatingLocation, setUpdatingLocation] = useState(false);

  // Custom modal state configuration
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'IN' or 'OUT'
    title: "",
    message: ""
  });

  const fetchStatus = async () => {
    try {
      const response = await API.get("/api/attendance");
      const active = response.data.find(
        (item) => item.userId === user.id && item.status === "CHECKED_IN"
      );
      setIsCheckedIn(!!active);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const startTracking = async (attendanceId) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    let lastSavedTime = 0;
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const now = Date.now();
        if (now - lastSavedTime < 600000) return;
        lastSavedTime = now;

        try {
          let address = "Unknown Location";
          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
              { headers: { Accept: "application/json" } }
            );
            const geoData = await geoResponse.json();
            if (geoData?.display_name) {
              address = geoData.display_name;
            }
          } catch (error) {
            console.log("Address Fetch Error", error);
          }

          await API.post("/api/location/save", {
            userId: user.id,
            attendanceId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address,
          });
        } catch (error) {
          console.log(error);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const updateCurrentLocation = async () => {
    try {
      setUpdatingLocation(true);
      if (!navigator.geolocation) {
        alert("Location not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const active = await API.get(`/api/attendance/active/${user.id}`);
            let address = "Unknown Location";

            try {
              const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
              );
              const geoData = await geoResponse.json();
              if (geoData?.display_name) {
                address = geoData.display_name;
              }
            } catch {}

            await API.post("/api/location/save", {
              userId: user.id,
              attendanceId: active.data.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address,
            });
            alert("Location updated successfully");
          } catch (error) {
            alert("Failed to update location");
          }
          setUpdatingLocation(false);
        },
        (error) => {
          setUpdatingLocation(false);
          alert("Unable to get current location");
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      setUpdatingLocation(false);
    }
  };

  const saveManualLocation = async () => {
    try {
      if (!manualLocation.trim()) {
        return alert("Please enter location");
      }
      const active = await API.get(`/api/attendance/active/${user.id}`);
      await API.post("/api/location/manual-save", {
        userId: user.id,
        attendanceId: active.data.id,
        manualLocation,
        remarks,
      });

      alert("Manual location saved");
      setManualLocation("");
      setRemarks("");
      setShowManualForm(false);
    } catch (error) {
      alert("Failed to save location");
    }
  };

  // Triggers the custom UI confirmation modal
  const triggerConfirmation = (type) => {
    if (type === "IN") {
      setConfirmModal({
        isOpen: true,
        type: "IN",
        title: "Start Work Session?",
        message: "Your automated real-time background coordinates tracking will begin immediately."
      });
    } else if (type === "OUT") {
      setConfirmModal({
        isOpen: true,
        type: "OUT",
        title: "End Work Session?",
        message: "Are you sure you want to check out? Your active background live tracking will completely stop."
      });
    }
  };

  // Handles execution based on confirmation choice
  const handleConfirmedAction = async () => {
    const activeType = confirmModal.type;
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    try {
      setLoading(true);
      if (activeType === "IN") {
        const response = await API.post("/api/attendance/check-in", { userId: user.id });
        const attendanceId = response.data.attendanceId;
        await startTracking(attendanceId);
      } else if (activeType === "OUT") {
        await API.post("/api/attendance/check-out", { userId: user.id });
        stopTracking();
      }
      await fetchStatus();
    } catch (error) {
      alert(error.response?.data?.message || "Operation execution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50/60 p-4 md:p-12 flex items-center justify-center font-sans">
      
      {/* Redesigned Custom Context-Driven Confirmation Modal Layer */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Backdrop */}
          <div 
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
          />
          
          {/* Modal Container Box */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200 p-6 transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full flex-shrink-0 ${
                confirmModal.type === "IN" ? "bg-zinc-100 text-zinc-800" : "bg-red-50 text-red-600"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                  {confirmModal.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            {/* Modal Action Controls Layout matrix */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-sm transition-all active:scale-[0.98] ${
                  confirmModal.type === "IN" 
                    ? "bg-zinc-900 hover:bg-zinc-800" 
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm Actions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Core Form Card Container */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-zinc-200/80 p-6 md:p-10 transition-all duration-300">
        
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 font-bold mb-1">
            Workstation Registry
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 tracking-tight">
            Employee Attendance
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage and track your active working sessions reliably.
          </p>
        </div>

        {/* Status Circular Panel */}
        <div className="flex flex-col items-center justify-center py-6 bg-zinc-50/50 rounded-xl border border-zinc-100 mb-8">
          <div className="relative flex items-center justify-center mb-4">
            <div className={`absolute inset-0 rounded-full animate-ping opacity-10 duration-1000 ${
              isCheckedIn ? "bg-emerald-500" : "bg-zinc-400"
            }`} />
            
            <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 bg-white shadow-sm ${
              isCheckedIn 
                ? "border-emerald-500 text-emerald-600 shadow-emerald-100" 
                : "border-zinc-300 text-zinc-400 shadow-zinc-100"
            }`}>
              {isCheckedIn ? (
                <CheckCircle className="w-8 h-8 mb-1 animate-pulse" />
              ) : (
                <MapPinOff className="w-8 h-8 mb-1" />
              )}
              <span className="text-[11px] font-bold tracking-widest uppercase">
                {isCheckedIn ? "Working" : "Offline"}
              </span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
            isCheckedIn 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-zinc-100 border-zinc-200 text-zinc-600"
          }`}>
            Status: {isCheckedIn ? "Active Tracking" : "Session Inactive"}
          </div>
        </div>

        {/* Primary Functional Control Area Matrix */}
        <div className="space-y-3">
          {!isCheckedIn ? (
            <button
              onClick={() => triggerConfirmation("IN")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white font-medium py-3.5 px-4 rounded-xl hover:bg-zinc-800 disabled:bg-zinc-400 transition-all duration-200 shadow-sm active:scale-[0.99]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {loading ? "Initializing..." : "Start Working Session"}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => triggerConfirmation("OUT")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-medium py-3.5 px-4 rounded-xl hover:bg-red-600 disabled:bg-red-300 transition-all duration-200 shadow-sm active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Square className="w-4 h-4 fill-current" />
                )}
                {loading ? "Processing..." : "End Session & Check Out"}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={updateCurrentLocation}
                  disabled={updatingLocation}
                  className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium py-3 px-4 rounded-xl hover:bg-indigo-100/80 disabled:opacity-50 transition-all duration-200 text-sm"
                >
                  {updatingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  Update Location
                </button>

                <button
                  onClick={() => setShowManualForm(!showManualForm)}
                  className={`flex items-center justify-center gap-2 border font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm ${
                    showManualForm
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-amber-50/60 text-amber-700 border-amber-200/60 hover:bg-amber-100/70"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Manual Registry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Manual Logging Segment Drawer */}
        {isCheckedIn && showManualForm && (
          <div className="mt-5 border border-zinc-200/80 bg-zinc-50/30 rounded-xl p-5 transition-all animate-fadeIn">
            <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              Log Manual Checkpoint
            </h3>
            
            <div className="space-y-3">
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Target Destination / Hub Name"
                className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />

              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Purpose or descriptive logs / remarks..."
                rows="3"
                className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />

              <button
                onClick={saveManualLocation}
                className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-emerald-700 transition-all shadow-sm active:scale-[0.99]"
              >
                Confirm Location Entry
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeAttendance;