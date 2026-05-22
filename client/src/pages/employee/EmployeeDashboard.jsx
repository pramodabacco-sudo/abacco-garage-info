import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

const EmployeeDashboard = () => {

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchDashboard =
    async () => {
      try {

        const response =
          await API.get(
            `/api/employee-dashboard/${user.id}`
          );

        setData(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboard();
  }, []);


  if (loading) {
    return (
      <div className="p-10">
        Loading dashboard...
      </div>
    );
  }
    if (!data) {
  return (
    <div className="p-10 text-red-500">
      Failed to load dashboard
    </div>
  );
}

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#F8F9FA] min-h-screen">

      {/* Header */}
      <div className="mb-10">

        <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
          — WORKSTATION —
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">

          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            Welcome,
            {" "}
            {user.name}
          </h1>

          <span
            className={`text-xs px-3 py-1 rounded-full w-fit ${
              data?.isWorking
                ? "bg-green-100 text-green-700"
                : "bg-neutral-200 text-neutral-700"
            }`}
          >
            {data?.isWorking
              ? "WORKING"
              : "OFFLINE"}
          </span>

        </div>

        <div className="mt-3 h-px bg-neutral-200 w-full" />

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">

        <div className="bg-white border border-neutral-200 p-5">

          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
            Total Visits
          </p>

          <h2 className="text-4xl font-light">
            {data.totalVisits || 0}
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-5">

          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
            Interested Leads
          </p>

          <h2 className="text-4xl font-light text-green-600">
            {data.interestedLeads || 0}
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-5">

          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
            Follow Ups
          </p>

          <h2 className="text-4xl font-light text-yellow-600">
            {data.followUps || 0}
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-5">

          <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
            Converted
          </p>

          <h2 className="text-4xl font-light text-blue-600">
            {data.convertedLeads || 0}
          </h2>

        </div>

      </div>

      {/* Recent Visits */}
      <div className="bg-white border border-neutral-200 overflow-hidden">

        <div className="p-5 border-b border-neutral-200">

          <h2 className="text-xl font-light">
            Recent Garage Visits
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead className="bg-neutral-50 border-b border-neutral-200">

              <tr>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Garage
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Address
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Images
                </th>

              </tr>

            </thead>

            <tbody>
{data?.recentVisits?.map((visit) => (

                <tr
                  key={visit.id}
                  className="border-b border-neutral-100"
                >

                  <td className="px-5 py-4">

                    <div className="font-medium">
                      {visit.shopName}
                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-neutral-600">

                    {visit.address}

                  </td>

                  <td className="px-5 py-4">

                    <span className="text-xs px-3 py-1 bg-neutral-100 rounded-full">
                      {visit.leadStatus}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {visit.images
                        ?.slice(0, 3)
                        .map((img) => (

                        <img
                          key={img.id}
                          src={
                            img.imageUrl
                          }
                          alt=""
                          className="w-14 h-14 rounded object-cover"
                        />

                      ))}

                    </div>

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

export default EmployeeDashboard;