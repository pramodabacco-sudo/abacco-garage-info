import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

const AdminAttendance = () => {

  const [data, setData] =
    useState([]);

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

          <table className="w-full min-w-[700px]">

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

              </tr>

            </thead>

            <tbody>

              {data.map((item) => (

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

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminAttendance;