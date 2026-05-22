import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const AdminAttendance = () => {

  const [data, setData] =
    useState([]);

    const [
  selectedAttendance,
  setSelectedAttendance,
] = useState(null);

  const fetchAttendance =
    async () => {
      try {

        const response =
          await API.get(
            "/api/attendance"
          );

        setData(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {
    fetchAttendance();

    const interval =
      setInterval(() => {
        fetchAttendance();
      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-10">

      <div className="bg-white border border-neutral-200 overflow-hidden">

        <div className="p-5 border-b border-neutral-200">

          <h1 className="text-2xl font-light">
            Employee Attendance
          </h1>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-neutral-50 border-b border-neutral-200">

              <tr>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Employee
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Check In
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Check Out
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Live Location
                </th>
                <th className="px-5 py-4 text-left text-xs uppercase">
                Address
              </th>
              <th className="px-5 py-4 text-left text-xs uppercase">
              Route
            </th>

              </tr>

            </thead>

            <tbody>

              {data.map((item) => {

              const locations =
                item.locations || [];

              const location =
                locations[
                  locations.length - 1
                ];

                return (

                  <tr
                    key={item.id}
                    className="border-b border-neutral-100"
                  >

                    <td className="px-5 py-4">
                      {item.user.name}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          item.status ===
                          "CHECKED_IN"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.checkInTime
                        ? new Date(
                            item.checkInTime
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.checkOutTime
                        ? new Date(
                            item.checkOutTime
                          ).toLocaleString()
                        : "-"}
                    </td>

                    {/* <td className="px-5 py-4">

                      {location ? (

                        <div className="w-[300px] h-[200px] rounded overflow-hidden">

                          <MapContainer
                            center={[
                              location.latitude,
                              location.longitude,
                            ]}
                            zoom={15}
                            scrollWheelZoom={false}
                            className="w-full h-full"
                          >

                            <TileLayer
                              attribution='&copy; OpenStreetMap contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker
                              position={[
                                location.latitude,
                                location.longitude,
                              ]}
                            >

                              <Popup>
                                {item.user.name}
                              </Popup>

                            </Marker>

                          </MapContainer>

                        </div>

                      ) : (

                        <span className="text-sm text-neutral-400">
                          No Location
                        </span>

                      )}

                    </td> */}
                    <td className="px-5 py-4 text-sm">

  {location ? (

    <div className="space-y-1">

      <p>
        Lat:
        {" "}
        {location.latitude.toFixed(5)}
      </p>

      <p>
        Lng:
        {" "}
        {location.longitude.toFixed(5)}
      </p>

    </div>

  ) : (

    <span className="text-neutral-400">
      No Location
    </span>

  )}

</td>
                    <td className="px-5 py-4 text-sm max-w-[300px]">

                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />

                    <span className="text-sm text-neutral-700">

                      {location?.address &&
                      location.address !==
                        "Unknown Location"
                        ? location.address
                        : "Live Location Available"}

                    </span>

                  </div>

                  </td>
                  <td className="px-5 py-4">

                {locations.length > 0 && (

                  <button
                    onClick={() =>
                      setSelectedAttendance(
                        item
                      )
                    }
                    className="px-4 py-2 bg-black text-white text-xs"
                  >
                    View Route
                  </button>

                )}

              </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>
    {selectedAttendance && (

      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

        <div className="bg-white w-full max-w-5xl rounded-lg overflow-hidden">

          <div className="flex items-center justify-between p-5 border-b">

            <div>

              <h2 className="text-xl font-semibold">
                Route History
              </h2>

              <p className="text-sm text-neutral-500">
                {
                  selectedAttendance.user.name
                }
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedAttendance(
                  null
                )
              }
              className="text-sm px-4 py-2 bg-black text-white"
            >
              Close
            </button>

          </div>

          <div className="p-5">

            <MapContainer
              center={[
                selectedAttendance
                  .locations[0]
                  .latitude,

                selectedAttendance
                  .locations[0]
                  .longitude,
              ]}
              zoom={13}
              className="w-full h-[500px]"
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline
                positions={
                  selectedAttendance.locations.map(
                    (loc) => [
                      loc.latitude,
                      loc.longitude,
                    ]
                  )
                }
              />

              {selectedAttendance.locations.map(
                (loc, index) => (

                  <Marker
                    key={loc.id}
                    position={[
                      loc.latitude,
                      loc.longitude,
                    ]}
                  >

                    <Popup>

                    <div className="space-y-1">

                      <p className="font-semibold">

                        {index === 0
                          ? "START LOCATION"
                          : index ===
                            selectedAttendance
                              .locations.length - 1
                          ? "CURRENT LOCATION"
                          : `STOP ${index}`}

                      </p>

                      <p className="text-xs font-medium">
                        {
                          selectedAttendance
                            .user.name
                        }
                      </p>

            <p className="text-xs">

              {loc.address &&
              loc.address !==
                "Unknown Location"

                ? loc.address

                : `Lat: ${loc.latitude.toFixed(5)}, Lng: ${loc.longitude.toFixed(5)}`}

            </p>



                      <p className="text-xs text-neutral-500">
                        {new Date(
                          loc.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    </Popup>

                  </Marker>
                )
              )}

            </MapContainer>

          </div>

        </div>

      </div>

    )}
    </div>
  );
};

export default AdminAttendance;