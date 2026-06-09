import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminGarageDetailsPopup from "./AdminGarageDetailsPopup";

const AdminGarageVisits = () => {

  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchGarages = async () => {
    try {
      const response = await API.get("/api/garage");
      setGarages(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarages();
  }, []);

  // FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // FILTER
  const filteredGarages =
    filterStatus === "ALL"
      ? garages
      : garages.filter((g) => g.leadStatus === filterStatus);

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-10">

      <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-start sm:items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
              — FIELD VISITS —
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900">
              Garage Visits
            </h1>
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-neutral-200 bg-white text-sm text-neutral-700 px-4 py-2 outline-none focus:border-neutral-900 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="FIRST_VISIT">First Visit</option>
            <option value="INTERESTED">Interested</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="DEAL">Deal Closed</option>
            <option value="NOT_INTERESTED">Not Interested</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center text-neutral-400">
            Loading garage visits...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredGarages.length === 0 && (
          <div className="p-10 text-center text-neutral-400">
            No garage visits found
          </div>
        )}

        {/* Table */}
        {!loading && filteredGarages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">

              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Garage
                  </th>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Employee
                  </th>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-neutral-500">
                    Images
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredGarages.map((garage) => (
                  <tr
                    key={garage.id}
                    onClick={() => setSelectedGarage(garage)}
                    className="border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-all"
                  >

                    {/* Garage */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-neutral-900">
                        {garage.shopName}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {garage.address}
                      </div>
                    </td>

                    {/* Employee */}
                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {garage.employee?.name}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {garage.phoneNumber}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {garage.location || "-"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          garage.leadStatus === "INTERESTED"
                            ? "bg-green-100 text-green-700"
                            : garage.leadStatus === "FOLLOW_UP"
                            ? "bg-yellow-100 text-yellow-700"
                            : garage.leadStatus === "DEAL"
                            ? "bg-blue-100 text-blue-700"
                            : garage.leadStatus === "NOT_INTERESTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {garage.leadStatus.replace("_", " ")}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-4">
                      <div className="text-sm text-neutral-700">
                        {formatDate(garage.createdAt).split(",")[0]}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {formatDate(garage.createdAt).split(",")[1]}
                      </div>
                    </td>

                    {/* Images */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {garage.images?.slice(0, 3).map((img) => (
                          <img
                            key={img.id}
                            src={img.imageUrl}
                            alt=""
                            className="w-14 h-14 object-cover rounded border border-neutral-200"
                          />
                        ))}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

      <AdminGarageDetailsPopup
        selectedGarage={selectedGarage}
        setSelectedGarage={setSelectedGarage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default AdminGarageVisits;