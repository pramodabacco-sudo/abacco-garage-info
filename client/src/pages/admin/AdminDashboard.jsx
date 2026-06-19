import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

const AdminDashboard = () => {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchDashboard =
    async () => {
      try {

        const response =
          await API.get(
            "/api/dashboard"
          );

        setStats(
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-10">

      {/* Header */}
      <div className="mb-10">

        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-2">
          — ADMIN OVERVIEW —
        </p>

        <h1 className="text-3xl md:text-4xl font-light text-neutral-900">
          CRM Dashboard
        </h1>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Total Employees
          </p>

          <h2 className="text-3xl font-light">
            {
              stats.totalEmployees
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Active Employees
          </p>

          <h2 className="text-3xl font-light">
            {
              stats.activeEmployees
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Garage Visits
          </p>

          <h2 className="text-3xl font-light">
            {
              stats.totalGarages
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Employees Working
          </p>

          <h2 className="text-3xl font-light">
            {
              stats.checkedInEmployees
            }
          </h2>

        </div>

      </div>

      {/* Garage Leads */}
      <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
        Garage Leads
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Interested Leads
          </p>

          <h2 className="text-3xl font-light text-green-600">
            {
              stats.interestedLeads
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Follow Ups
          </p>

          <h2 className="text-3xl font-light text-yellow-600">
            {
              stats.followUps
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400  mb-2">
            Converted Leads
          </p>

          <h2 className="text-3xl font-light text-blue-600">
            {
              stats.convertedLeads
            }
          </h2>

        </div>

      </div>

      {/* School Stats */}
      <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
        School Leads
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Total Schools
          </p>

          <h2 className="text-3xl font-light">
            {
              stats.totalSchools
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Schools Visited
          </p>

          <h2 className="text-3xl font-light text-yellow-600">
            {
              stats.schoolsVisited
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Interested Schools
          </p>

          <h2 className="text-3xl font-light text-green-600">
            {
              stats.interestedSchools
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Demo Scheduled
          </p>

          <h2 className="text-3xl font-light text-purple-600">
            {
              stats.demoScheduledSchools
            }
          </h2>

        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Customers
          </p>

          <h2 className="text-3xl font-light text-blue-600">
            {
              stats.customerSchools
            }
          </h2>

        </div>

        <div className="bg-white border border-neutral-200 p-6">

          <p className="text-xs uppercase text-neutral-400 mb-2">
            Follow-Ups Pending
          </p>

          <h2 className="text-3xl font-light text-orange-600">
            {
              stats.schoolFollowUpsPending
            }
          </h2>

        </div>

      </div>

      {/* Recent Garage Visits */}
      <div className="bg-white border border-neutral-200 overflow-hidden mb-10">

        <div className="p-5 border-b border-neutral-200">

          <h2 className="text-xl font-light">
            Recent Garage Visits
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-neutral-50 border-b border-neutral-200">

              <tr>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Garage
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Employee
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

              {stats.recentGarages.map(
                (garage) => (

                <tr
                  key={garage.id}
                  className="border-b border-neutral-100"
                >

                  <td className="px-5 py-4">

                    <div className="font-medium">
                      {
                        garage.shopName
                      }
                    </div>

                    <div className="text-xs text-neutral-500">
                      {
                        garage.address
                      }
                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      garage.employee
                        ?.name
                    }
                  </td>

                  <td className="px-5 py-4">

                    <span className="text-xs px-3 py-1 bg-neutral-100 rounded-full">
                      {
                        garage.leadStatus
                      }
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {garage.images
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

      {/* Recent School Visits */}
      <div className="bg-white border border-neutral-200 overflow-hidden">

        <div className="p-5 border-b border-neutral-200">

          <h2 className="text-xl font-light">
            Recent School Visits
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-neutral-50 border-b border-neutral-200">

              <tr>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  School
                </th>

                <th className="px-5 py-4 text-left text-xs uppercase">
                  Employee
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

              {stats.recentSchools?.map(
                (school) => (

                <tr
                  key={school.id}
                  className="border-b border-neutral-100"
                >

                  <td className="px-5 py-4">

                    <div className="font-medium">
                      {
                        school.schoolName
                      }
                    </div>

                    <div className="text-xs text-neutral-500">
                      {[school.city, school.district].filter(Boolean).join(", ") || "—"}
                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm">
                    {
                      school.employee
                        ?.name
                    }
                  </td>

                  <td className="px-5 py-4">

                    <span className="text-xs px-3 py-1 bg-neutral-100 rounded-full">
                      {
                        school.responseStatus
                      }
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {school.images
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

              {(!stats.recentSchools || stats.recentSchools.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-neutral-400">
                    No school visits logged yet
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;