import { useEffect, useState } from "react";

import API from "../../api/axios";
import ImagePopup from "../../components/ImagePopup";

const STATUS_STYLES = {
  PENDING: {
    dot: "bg-yellow-400",
    text: "text-yellow-600",
  },

  INTERESTED: {
    dot: "bg-blue-400",
    text: "text-blue-600",
  },

  FOLLOW_UP: {
    dot: "bg-orange-400",
    text: "text-orange-600",
  },

  CONVERTED: {
    dot: "bg-green-500",
    text: "text-green-600",
  },

  REJECTED: {
    dot: "bg-red-400",
    text: "text-red-600",
  },
};

const EmployeeVisits = () => {

  const [visits, setVisits] =
    useState([]);

const [loading, setLoading] =
  useState(true);

const [updatingId, setUpdatingId] =
  useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [popupImages, setPopupImages] = useState([]);

  const fetchVisits = async () => {
    try {

      const response =
        await API.get(
           "/api/garage"
        );

      setVisits(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };
  const updateStatus = async (
  id,
  leadStatus
) => {
  try {

    setUpdatingId(id);

    await API.put(
      `/api/garage/${id}`,
      {
        leadStatus,
      }
    );

    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === id
          ? {
              ...visit,
              leadStatus,
            }
          : visit
      )
    );

  } catch (error) {

    console.log(error);

  } finally {

    setUpdatingId(null);
  }
};
const openPopup = (
  images,
  imageUrl
) => {

  setPopupImages(images);

  setSelectedImage(imageUrl);
};
  useEffect(() => {
    fetchVisits();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
            — FIELD ACTIVITY LOG —
          </p>

          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            Garage Visits
          </h1>

          <p className="text-sm text-neutral-400 mt-1">
            Garage visits with uploaded images.
          </p>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-6 shrink-0">

          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">
              Total Visits
            </p>

            <p className="text-2xl font-light text-neutral-900">
              {visits.length}
            </p>
          </div>

          <div className="w-px h-8 bg-neutral-200" />

          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">
              Converted
            </p>

            <p className="text-2xl font-light text-neutral-900">
              {
                visits.filter(
                  (v) =>
                    v.leadStatus ===
                    "CONVERTED"
                ).length
              }
            </p>
          </div>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center text-neutral-400">
          Loading garage visits...
        </div>
      )}

      {/* Empty */}
      {!loading &&
        visits.length === 0 && (
          <div className="py-20 text-center text-neutral-400">
            No garage visits found
          </div>
        )}

      {/* Garage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {visits.map((visit) => {

          const style =
            STATUS_STYLES[
              visit.leadStatus
            ] || {
              dot: "bg-neutral-300",
              text: "text-neutral-500",
            };

          return (
            <div
              key={visit.id}
              className="bg-white border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-200"
            >

              {/* Garage Image */}
              <div className="h-56 bg-neutral-100 overflow-hidden">

                {visit.images &&
                visit.images.length > 0 ? (

                <img
                  src={
                    visit.images[0]
                      .imageUrl
                  }
                  alt={visit.shopName}
                  onClick={() =>
                    openPopup(
                      visit.images,
                      visit.images[0]
                        .imageUrl
                    )
                  }
                  className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-all duration-300"
                />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                    No Image
                  </div>

                )}
              </div>

              {/* Content */}
              <div className="p-5">

                <div className="flex items-center justify-between mb-3">

                  <h2 className="text-lg font-semibold text-neutral-900">
                    {visit.shopName}
                  </h2>

            <div className="flex flex-col gap-2">

              <div className="flex items-center gap-2">

                <span
                  className={`w-2 h-2 rounded-full ${style.dot}`}
                />

                <span
                  className={`text-xs font-medium uppercase tracking-wider ${style.text}`}
                >
                  {visit.leadStatus}
                </span>

              </div>

              <select
                value={visit.leadStatus}
                disabled={
                  updatingId === visit.id
                }
                onChange={(e) =>
                  updateStatus(
                    visit.id,
                    e.target.value
                  )
                }
                className="border border-neutral-300 px-2 py-1 text-xs outline-none"
              >
                <option value="PENDING">
                  PENDING
                </option>

                <option value="INTERESTED">
                  INTERESTED
                </option>

                <option value="FOLLOW_UP">
                  FOLLOW UP
                </option>

                <option value="CONVERTED">
                  CONVERTED
                </option>

                <option value="REJECTED">
                  REJECTED
                </option>

              </select>

            </div>

                </div>

                <div className="space-y-2 text-sm">

                  <p className="text-neutral-600">
                    <span className="font-medium">
                      Address:
                    </span>{" "}
                    {visit.address}
                  </p>

                  <p className="text-neutral-600">
                    <span className="font-medium">
                      Phone:
                    </span>{" "}
                    {visit.phoneNumber}
                  </p>

                  {visit.location && (
                    <p className="text-neutral-600">
                      <span className="font-medium">
                        Location:
                      </span>{" "}
                      {visit.location}
                    </p>
                  )}

                  {visit.employee && (
                    <p className="text-neutral-600">
                      <span className="font-medium">
                        Employee:
                      </span>{" "}
                      {visit.employee.name}
                    </p>
                  )}

                  {visit.notes && (
                    <p className="text-neutral-500 text-sm leading-relaxed pt-2 border-t border-neutral-100">
                      {visit.notes}
                    </p>
                  )}

                </div>

                {/* Multiple Images */}
                {visit.images &&
                  visit.images.length >
                    1 && (

                    <div className="flex gap-2 mt-4 overflow-x-auto">

                      {visit.images
                        .slice(1)
                        .map((img) => (
                          <img
                            key={img.id}
                            src={
                              img.imageUrl
                            }
                            alt="Garage"
                            onClick={() =>
                              openPopup(
                                visit.images,
                                img.imageUrl
                              )
                            }
                            className="w-16 h-16 object-cover border border-neutral-200 shrink-0 cursor-pointer hover:opacity-80"
                          />
                        ))}
                    </div>

                  )}

              </div>
            </div>
          );
        })}
      </div>
      <ImagePopup
  images={popupImages}
  selectedImage={selectedImage}
  setSelectedImage={setSelectedImage}
/>
    </div>
  );
};

export default EmployeeVisits;