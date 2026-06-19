import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
  Calendar,
  Loader2,
} from "lucide-react";
import API from "../../api/axios";
import ImagePopup from "../../components/ImagePopup";

const STATUS_STYLES = {
  NOT_CONTACTED: { bg: "bg-neutral-100", text: "text-neutral-600", label: "Not Contacted" },
  VISITED: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Visited" },
  INTERESTED: { bg: "bg-blue-100", text: "text-blue-700", label: "Interested" },
  DEMO_SCHEDULED: { bg: "bg-purple-100", text: "text-purple-700", label: "Demo Scheduled" },
  FOLLOW_UP: { bg: "bg-orange-100", text: "text-orange-700", label: "Follow Up" },
  NOT_INTERESTED: { bg: "bg-red-100", text: "text-red-700", label: "Not Interested" },
  CUSTOMER: { bg: "bg-green-100", text: "text-green-700", label: "Customer" },
};

const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [popupImages, setPopupImages] = useState([]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/school/${id}`);
      setSchool(response.data);
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to load school details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openPopup = (images, imageUrl) => {
    setPopupImages(images);
    setSelectedImage(imageUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (errorMsg || !school) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-3">
        <p className="text-red-600 text-sm">{errorMsg || "School not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const style = STATUS_STYLES[school.responseStatus] || STATUS_STYLES.NOT_CONTACTED;
  const hasCoords = school.latitude != null && school.longitude != null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-4 sm:p-10 font-sans antialiased">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to List
      </button>

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${style.bg} ${style.text}`}>
                {style.label}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 mt-3">
                {school.schoolName}
              </h1>
              {school.employee && (
                <p className="text-xs text-neutral-400 mt-1">
                  Added by {school.employee.name} on{" "}
                  {new Date(school.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Info */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <UserIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-neutral-900 font-medium">
                      {school.contactPerson || "—"}
                    </p>
                    {school.designation && (
                      <p className="text-xs text-neutral-500">{school.designation}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <p className="text-neutral-700">{school.phoneNumber || "—"}</p>
                </div>
                <div className="flex items-start gap-2 sm:col-span-2">
                  <Mail className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <p className="text-neutral-700">{school.email || "—"}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold mb-4">
                Location
              </h2>
              <div className="flex items-start gap-2 text-sm mb-3">
                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-neutral-700">{school.address || "No address recorded"}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {[school.city, school.district, school.state].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </div>

              {hasCoords ? (
                <a
                  href={`https://www.google.com/maps?q=${school.latitude},${school.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <iframe
                    title="School location"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${school.latitude},${school.longitude}&z=15&output=embed`}
                  />
                  <p className="text-[11px] text-neutral-400 mt-2">
                    {school.latitude.toFixed(5)}, {school.longitude.toFixed(5)} · Tap to open in Google Maps
                  </p>
                </a>
              ) : (
                <div className="h-24 flex items-center justify-center bg-neutral-50 border border-neutral-200 text-xs text-neutral-400">
                  No GPS coordinates captured for this school
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold mb-3">
                Notes / Remarks
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {school.notes || "No notes recorded."}
              </p>
            </div>

          </div>

          {/* Right: Status + Photos */}
          <div className="space-y-6">

            {/* Follow up */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold mb-3">
                Follow-Up
              </h2>
              {school.followUpDate ? (
                <div className="flex items-center gap-2 text-sm text-neutral-800">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  {new Date(school.followUpDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">No follow-up scheduled</p>
              )}
            </div>

            {/* Photos */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold mb-3">
                Photos ({school.images?.length || 0})
              </h2>
              {school.images && school.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {school.images.map((img) => (
                    <div
                      key={img.id}
                      className="aspect-square bg-neutral-100 overflow-hidden cursor-pointer group"
                      onClick={() => openPopup(school.images, img.imageUrl)}
                    >
                      <img
                        src={img.imageUrl}
                        alt="School"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center bg-neutral-50 border border-neutral-200 text-xs text-neutral-400">
                  No photos uploaded
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <ImagePopup
        images={popupImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default SchoolDetails;