import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import API from "../../api/axios";

const RESPONSE_STATUS_OPTIONS = [
  { value: "NOT_CONTACTED", label: "Not Contacted" },
  { value: "VISITED", label: "Visited" },
  { value: "INTERESTED", label: "Interested" },
  { value: "DEMO_SCHEDULED", label: "Demo Scheduled" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
  { value: "CUSTOMER", label: "Customer" },
];

const DESIGNATION_OPTIONS = [
  "Principal",
  "Headmaster",
  "Administrator",
  "Trustee",
  "Other",
];

const initialFormState = {
  schoolName: "",
  contactPerson: "",
  designation: "",
  phoneNumber: "",
  email: "",
  address: "",
  city: "",
  district: "",
  state: "",
  latitude: "",
  longitude: "",
  responseStatus: "NOT_CONTACTED",
  followUpDate: "",
  notes: "",
};

const AddSchool = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState(initialFormState);

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

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
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // CAPTURE GPS LOCATION -> fills address, city, district, state, lat/lng
  const captureCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported on this device.");
      return;
    }

    setLocating(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          let address = "";
          let city = "";
          let district = "";
          let state = "";

          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { headers: { Accept: "application/json" } }
            );
            const geoData = await geoResponse.json();

            if (geoData?.display_name) {
              address = geoData.display_name;
            }

            const addr = geoData?.address || {};
            city = addr.city || addr.town || addr.village || "";
            district = addr.state_district || addr.county || "";
            state = addr.state || "";
          } catch (error) {
            console.log("Address Fetch Error", error);
          }

          setFormData((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
            address: address || prev.address,
            city: city || prev.city,
            district: district || prev.district,
            state: state || prev.state,
          }));

          setLocationCaptured(true);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.log(error);
        setLocating(false);
        setErrorMsg("Unable to get your current location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!formData.schoolName.trim()) {
      setErrorMsg("School Name is required.");
      return;
    }

    if (formData.responseStatus === "FOLLOW_UP" && !formData.followUpDate) {
      setErrorMsg("Please select a Follow-Up Date.");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("schoolName", formData.schoolName);
      submitData.append("contactPerson", formData.contactPerson);
      submitData.append("designation", formData.designation);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("email", formData.email);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city);
      submitData.append("district", formData.district);
      submitData.append("state", formData.state);
      submitData.append("latitude", formData.latitude);
      submitData.append("longitude", formData.longitude);
      submitData.append("responseStatus", formData.responseStatus);
      submitData.append("followUpDate", formData.followUpDate);
      submitData.append("notes", formData.notes);
      submitData.append("employeeId", user?.id || "");

      images.forEach((image) => {
        submitData.append("images", image);
      });

      const response = await API.post("/api/school/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(response.data.message || "School lead saved successfully.");

      // Reset
      setFormData(initialFormState);
      setImages([]);
      setPreviewImages([]);
      setLocationCaptured(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to save school lead.");
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
            — SCHOOL LEAD INTAKE —
          </span>
          <h1 className="text-3xl font-normal tracking-tight text-neutral-900 font-serif">
            Add School
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            Capture school visit details, contact information, and photo evidence from the field.
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

          {/* Section 1: School & Contact Info */}
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">01 / School &amp; Contact Info</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {/* SCHOOL NAME */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Greenwood Public School"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

              {/* CONTACT PERSON */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Mrs. Sharma"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

              {/* DESIGNATION */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none focus:border-neutral-900"
                >
                  <option value="">Select Designation</option>
                  {DESIGNATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

              {/* EMAIL */}
              <div className="md:col-span-2">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="school@example.com"
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block">02 / Location</span>
              <button
                type="button"
                onClick={captureCurrentLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {locating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5" />
                )}
                {locating ? "Locating..." : "Capture Current Location"}
              </button>
            </div>

            {locationCaptured && (
              <div className="mb-4 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 flex items-center gap-2">
                <LocateFixed className="w-3.5 h-3.5 shrink-0" />
                GPS coordinates captured ({Number(formData.latitude).toFixed(5)}, {Number(formData.longitude).toFixed(5)})
              </div>
            )}

            <div className="grid grid-cols-1 gap-y-6">

              {/* ADDRESS */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter school address, or tap 'Capture Current Location'..."
                  className="w-full bg-transparent border-b border-neutral-200 py-2 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">

                {/* CITY */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Belagavi"
                    className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                  />
                </div>

                {/* DISTRICT */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Belagavi"
                    className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                  />
                </div>

                {/* STATE */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Karnataka"
                    className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Section 3: Lead Response */}
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">03 / Lead Response</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {/* RESPONSE STATUS */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                  Response Status
                </label>
                <div className="relative">
                  <select
                    name="responseStatus"
                    value={formData.responseStatus}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 rounded-none cursor-pointer appearance-none text-neutral-800 font-medium"
                  >
                    {RESPONSE_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-neutral-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* FOLLOW UP DATE */}
              {formData.responseStatus === "FOLLOW_UP" && (
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                    Follow-Up Date <span className="text-red-500">*</span>
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

            </div>

            {/* NOTES / REMARKS */}
            <div className="mt-6">
              <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-2 font-bold">
                Notes / Employee Remarks
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Log meeting outcomes, objections, decision-maker availability, or other remarks..."
                className="w-full bg-transparent border-b border-neutral-200 py-2 text-sm outline-none transition-colors focus:border-neutral-900 placeholder-neutral-300 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Photos */}
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">04 / School Photos</span>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-neutral-900 mb-3 font-bold">
                Upload Building, Meeting, Visiting Card, or Other Photos
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
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-[10px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
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
              {loading ? "Saving School Lead..." : "Save School Lead"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddSchool;