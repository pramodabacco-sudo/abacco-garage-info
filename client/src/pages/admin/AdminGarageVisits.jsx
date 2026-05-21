import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminGarageDetailsPopup from "./AdminGarageDetailsPopup";

const AdminGarageVisits = () => {

  const [garages, setGarages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [selectedGarage, setSelectedGarage] =
    useState(null);

    const [selectedImage, setSelectedImage] =
    useState(null);

  const fetchGarages =
    async () => {
      try {

        const response =
          await API.get(
            "/api/garage"
          );

        setGarages(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    fetchGarages();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-10">

      <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-neutral-200">

          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
            — FIELD VISITS —
          </p>

          <h1 className="text-2xl sm:text-3xl font-light text-neutral-900">
            Garage Visits
          </h1>

        </div>

        {/* Loading */}
        {loading && (

          <div className="p-10 text-center text-neutral-400">
            Loading garage visits...
          </div>

        )}

        {/* Empty */}
        {!loading &&
          garages.length === 0 && (

          <div className="p-10 text-center text-neutral-400">
            No garage visits found
          </div>

        )}

        {/* Table */}
        {!loading &&
          garages.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

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
                    Images
                  </th>

                </tr>

              </thead>

              <tbody>

                {garages.map(
                  (garage) => (

                    <tr
                    key={garage.id}
                    onClick={() =>
                        setSelectedGarage(
                        garage
                        )
                    }
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
                          garage.leadStatus ===
                          "INTERESTED"
                            ? "bg-green-100 text-green-700"

                            : garage.leadStatus ===
                              "FOLLOW_UP"
                            ? "bg-yellow-100 text-yellow-700"

                            : garage.leadStatus ===
                              "CONVERTED"
                            ? "bg-blue-100 text-blue-700"

                            : garage.leadStatus ===
                              "REJECTED"
                            ? "bg-red-100 text-red-700"

                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {garage.leadStatus}
                      </span>

                    </td>

                    {/* Images */}
                    <td className="px-5 py-4">

                      <div className="flex gap-2">

                        {garage.images
                          ?.slice(0, 3)
                          .map(
                            (img) => (

                            <img
                              key={img.id}
                              src={
                                img.imageUrl
                              }
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
        selectedGarage={
          selectedGarage
        }
        setSelectedGarage={
          setSelectedGarage
        }
        selectedImage={
          selectedImage
        }
        setSelectedImage={
          setSelectedImage
        }
      />
    </div>
    
  );
};

export default AdminGarageVisits;