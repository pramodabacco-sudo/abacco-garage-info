import { useEffect, useMemo, useState } from "react";
import { Search, X, Loader2, MapPin, Phone, Mail } from "lucide-react";
import API from "../../api/axios";
import ImagePopup from "../../components/ImagePopup";

const STATUS_STYLES = {
  NOT_CONTACTED: { dot: "bg-neutral-300", text: "text-neutral-500", label: "Not Contacted" },
  VISITED: { dot: "bg-yellow-400", text: "text-yellow-600", label: "Visited" },
  INTERESTED: { dot: "bg-blue-400", text: "text-blue-600", label: "Interested" },
  DEMO_SCHEDULED: { dot: "bg-purple-400", text: "text-purple-600", label: "Demo Scheduled" },
  FOLLOW_UP: { dot: "bg-orange-400", text: "text-orange-600", label: "Follow Up" },
  NOT_INTERESTED: { dot: "bg-red-400", text: "text-red-600", label: "Not Interested" },
  CUSTOMER: { dot: "bg-green-500", text: "text-green-600", label: "Customer" },
};

const STATUS_OPTIONS = Object.keys(STATUS_STYLES);

const SchoolList = ({ scope = "employee" }) => {
  // scope: "employee" -> only logged-in employee's own schools
  //        "admin"    -> all schools across employees

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [popupImages, setPopupImages] = useState([]);

  // Quick-edit modal state
  const [editModal, setEditModal] = useState({ isOpen: false, school: null });
  const [editForm, setEditForm] = useState({
    responseStatus: "NOT_CONTACTED",
    followUpDate: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      let response;
      if (scope === "admin") {
        response = await API.get("/api/school");
      } else {
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.id;
        response = await API.get(`/api/school/employee/${userId}`);
      }

      setSchools(response.data);
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to load schools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const openPopup = (images, imageUrl) => {
    setPopupImages(images);
    setSelectedImage(imageUrl);
  };

  const openEditModal = (school) => {
    setEditModal({ isOpen: true, school });
    setEditForm({
      responseStatus: school.responseStatus || "NOT_CONTACTED",
      followUpDate: school.followUpDate
        ? new Date(school.followUpDate).toISOString().split("T")[0]
        : "",
      notes: school.notes || "",
    });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, school: null });
  };

  const saveEdit = async () => {
    if (!editModal.school) return;

    if (editForm.responseStatus === "FOLLOW_UP" && !editForm.followUpDate) {
      alert("Please select a follow-up date.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        responseStatus: editForm.responseStatus,
        followUpDate:
          editForm.responseStatus === "FOLLOW_UP" ? editForm.followUpDate : null,
        notes: editForm.notes,
      };

      const response = await API.put(`/api/school/${editModal.school.id}`, payload);

      setSchools((prev) =>
        prev.map((s) => (s.id === editModal.school.id ? response.data.data : s))
      );

      closeEditModal();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update school.");
    } finally {
      setSaving(false);
    }
  };

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesSearch =
        !searchTerm.trim() ||
        school.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || school.responseStatus === statusFilter;

      const matchesCity =
        !cityFilter.trim() ||
        school.city?.toLowerCase().includes(cityFilter.toLowerCase()) ||
        school.district?.toLowerCase().includes(cityFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [schools, searchTerm, statusFilter, cityFilter]);

  const stats = useMemo(() => {
    return {
      total: schools.length,
      interested: schools.filter((s) => s.responseStatus === "INTERESTED").length,
      followUp: schools.filter((s) => s.responseStatus === "FOLLOW_UP").length,
      customers: schools.filter((s) => s.responseStatus === "CUSTOMER").length,
    };
  }, [schools]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-4 sm:p-10 font-sans antialiased">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
            — {scope === "admin" ? "ALL SCHOOL LEADS" : "MY SCHOOL LEADS"} —
          </p>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            School Visits
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {scope === "admin"
              ? "All school leads logged by the field sales team."
              : "Schools you've visited, with status and follow-up tracking."}
          </p>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-5 shrink-0 flex-wrap">
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Total</p>
            <p className="text-2xl font-light text-neutral-900">{stats.total}</p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Interested</p>
            <p className="text-2xl font-light text-blue-600">{stats.interested}</p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Follow-Up</p>
            <p className="text-2xl font-light text-orange-600">{stats.followUp}</p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Customers</p>
            <p className="text-2xl font-light text-green-600">{stats.customers}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-neutral-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by school name, contact, or phone..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        <input
          type="text"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          placeholder="Filter by city / district"
          className="bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors sm:w-56"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors sm:w-52"
        >
          <option value="ALL">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_STYLES[status].label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 text-xs border-l-4 border-red-500">
          {errorMsg}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center text-neutral-400">Loading schools...</div>
      )}

      {/* Empty */}
      {!loading && filteredSchools.length === 0 && (
        <div className="py-20 text-center text-neutral-400">
          {schools.length === 0
            ? "No schools added yet."
            : "No schools match your search or filters."}
        </div>
      )}

      {/* School Cards */}
      {!loading && filteredSchools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            const style = STATUS_STYLES[school.responseStatus] || STATUS_STYLES.NOT_CONTACTED;

            return (
              <div
                key={school.id}
                className="bg-white border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                {/* Image */}
                <div className="h-44 bg-neutral-100 overflow-hidden shrink-0">
                  {school.images && school.images.length > 0 ? (
                    <img
                      src={school.images[0].imageUrl}
                      alt={school.schoolName}
                      onClick={() => openPopup(school.images, school.images[0].imageUrl)}
                      className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-neutral-900 leading-tight">
                      {school.schoolName}
                    </h2>
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-[11px] font-medium uppercase tracking-wider ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm text-neutral-600 mb-3">
                    {school.contactPerson && (
                      <p>
                        {school.contactPerson}
                        {school.designation ? ` · ${school.designation}` : ""}
                      </p>
                    )}
                    {school.phoneNumber && (
                      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Phone className="w-3 h-3" /> {school.phoneNumber}
                      </p>
                    )}
                    {school.email && (
                      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Mail className="w-3 h-3" /> {school.email}
                      </p>
                    )}
                    {(school.city || school.district || school.state) && (
                      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <MapPin className="w-3 h-3" />
                        {[school.city, school.district, school.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>

                  {school.followUpDate && (
                    <p className="text-xs text-neutral-600 mb-2">
                      <span className="font-medium">Next Follow-Up:</span>{" "}
                      {new Date(school.followUpDate).toLocaleDateString()}
                    </p>
                  )}

                  {school.notes && (
                    <p className="text-xs text-neutral-500 leading-relaxed pt-2 mt-auto border-t border-neutral-100 line-clamp-2">
                      {school.notes}
                    </p>
                  )}

                  {scope === "admin" && school.employee && (
                    <p className="text-[11px] text-neutral-400 mt-2">
                      Added by {school.employee.name}
                    </p>
                  )}

                  {/* Additional images strip */}
                  {school.images && school.images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {school.images.slice(1).map((img) => (
                        <img
                          key={img.id}
                          src={img.imageUrl}
                          alt="School"
                          onClick={() => openPopup(school.images, img.imageUrl)}
                          className="w-12 h-12 object-cover border border-neutral-200 shrink-0 cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => openEditModal(school)}
                    className="mt-4 w-full bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider py-2.5 hover:bg-neutral-800 transition-colors"
                  >
                    Update Status / Follow-Up
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            onClick={closeEditModal}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200 p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                  {editModal.school?.schoolName}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Update response status and follow-up details
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 font-bold">
                  Response Status
                </label>
                <select
                  value={editForm.responseStatus}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, responseStatus: e.target.value }))
                  }
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_STYLES[status].label}
                    </option>
                  ))}
                </select>
              </div>

              {editForm.responseStatus === "FOLLOW_UP" && (
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 font-bold">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={editForm.followUpDate}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, followUpDate: e.target.value }))
                    }
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-zinc-700 mb-1.5 font-bold">
                  Notes / Remarks
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows="3"
                  placeholder="Add remarks about this visit or call..."
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ImagePopup
        images={popupImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default SchoolList;