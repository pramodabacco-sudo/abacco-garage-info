import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import API from "../../api/axios";

const AddGarageVisit = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    location: "",
    phoneNumber: "",
    garageType: "",
    leadStatus: "FIRST_VISIT",
    followUpDate: "",
    notes: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [locatingAddress, setLocatingAddress] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    setSuccessMsg("");
    setErrorMsg("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // USE CURRENT LOCATION -> fills Garage Address field
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported on this device.");
      return;
    }

    setLocatingAddress(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let address = "";

          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { headers: { Accept: "application/json" } }
            );
            const geoData = await geoResponse.json();
            if (geoData?.display_name) {
              address = geoData.display_name;
            }
          } catch (error) {
            console.log("Address Fetch Error", error);
          }

          if (address) {
            setFormData((prev) => ({ ...prev, address }));
          } else {
            setErrorMsg("Could not resolve an address for your current location. Please enter it manually.");
          }
        } finally {
          setLocatingAddress(false);
        }
      },
      (error) => {
        console.log(error);
        setLocatingAddress(false);
        setErrorMsg("Unable to get your current location. Please allow location access or enter the address manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!formData.garageType) {
      setErrorMsg("Please select a Garage Type.");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("shopName", formData.shopName);
      submitData.append("address", formData.address);
      submitData.append("location", formData.location);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("garageType", formData.garageType);
      submitData.append("leadStatus", formData.leadStatus);
      submitData.append("followUpDate", formData.followUpDate);
      submitData.append("notes", formData.notes);
      submitData.append("employeeId", user?.id || "");

      images.forEach((image) => {
        submitData.append("images", image);
      });

      const response = await API.post("/api/garage/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(response.data.message || "Garage visit entry logged successfully.");

      // Reset
      setFormData({
        shopName: "",
        address: "",
        location: "",
        phoneNumber: "",
        garageType: "",
        leadStatus: "FIRST_VISIT",
        followUpDate: "",
        notes: "",
      });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to finalize garage session submission entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-4 sm:p-10 font-sans antialiased relative overflow-x-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.25] pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-none border border-[#D9D9D9] shadow-[0_24px_60px_rgba(15,23,42,0.02)] relative z-10">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-neutral-200">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold block mb-2">
            — DISPATCH INTAKE —
          </span>
          <h1 className="text-3xl font-normal tracking-tight text-neutral-900 font-serif">
            Add Garage Visit
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            Submit on-site presentation notes, business parameters, and diagnostic images directly to the ledger database network.
          </p>
        </div>

        {/* Notification Banners */}
        {successMsg && (
          <div className="mb-6 p-4 bg-neutral-900 text-white text-xs tracking-wider uppercase font-medium rounded-none border-l-4 border-emerald-500">
            ✓ SUCCESS: {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 text-xs tracking-wide font-mono rounded-none border-l-4 border-red-500">
            [ERROR]: {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* Section 1: Primary Coordinates */}
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">01 / Primary Coordinates</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {/* SHOP NAME */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Shop / Garage Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Apex Performance Tuning"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

              {/* GARAGE TYPE */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Garage Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="garageType"
                  value={formData.garageType}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none focus:border-neutral-900"
                >
                  <option value="">Select Garage Type</option>
                  <option value="CAR_GARAGE">Car Garage</option>
                  <option value="BIKE_GARAGE">Bike Garage</option>
                  <option value="WASHING_GARAGE">Washing Garage</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 2: Territory Metadata */}
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">02 / Territory Metadata</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {/* LOCATION */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Geographic Location / Zone
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Downtown Sector B"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

              {/* LEAD STATUS */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Visit Status
                </label>
                <div className="relative">
                  <select
                    name="leadStatus"
                    value={formData.leadStatus}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 rounded-none cursor-pointer appearance-none text-neutral-800 font-medium"
                  >
                    <option value="FIRST_VISIT">First Visit</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="DEAL">Deal Closed</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                  </select>

                  {formData.leadStatus === "FOLLOW_UP" && (
                    <div className="mt-6">
                      <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                        Next Contact Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900"
                        required
                      />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-neutral-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Qualitative Records */}
          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-2">03 / Qualitative Records</span>

            {/* ADDRESS */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 font-bold">
                  Garage Address <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={locatingAddress}
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {locatingAddress ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LocateFixed className="w-3.5 h-3.5" />
                  )}
                  {locatingAddress ? "Locating..." : "Use Current Location"}
                </button>
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                required
                placeholder="Enter shop street coordinates, or tap 'Use Current Location'..."
                className="w-full bg-transparent border-b border-neutral-200 py-2 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300 resize-none"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                Garage Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Log business platform reactions, current workspace systems used, or workflow change objections..."
                className="w-full bg-transparent border-b border-neutral-200 py-2 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Visual Evidence */}
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">04 / Visual Evidence Validation</span>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-3 font-bold">
                Upload Workshop Facade Images
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Upload Media */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors p-8 text-center">
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-neutral-800 block">Upload Media</span>
                      <span className="text-xs text-neutral-500 block">Gallery / Files</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>

                {/* Use Camera */}
                <label className="cursor-pointer">
                  <div className="border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors p-8 text-center">
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-neutral-800 block">Use Camera</span>
                      <span className="text-xs text-neutral-500 block">Capture Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>

              </div>

              {/* Image Preview */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-neutral-50/50 border border-neutral-100">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group overflow-hidden border border-neutral-200 aspect-video">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#1A1A1A] text-white py-4 px-10 tracking-widest text-xs uppercase font-medium hover:bg-black transition-colors duration-300 disabled:opacity-40 shadow-sm"
            >
              {loading ? "Transmitting Fields..." : "Commit Intake Logs"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGarageVisit;