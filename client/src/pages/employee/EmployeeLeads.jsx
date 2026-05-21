import { useEffect, useState } from "react";

import API from "../../api/axios";

const EmployeeLeads = () => {

  const [leads, setLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchLeads = async () => {
    try {

      const response =
        await API.get(
          "/api/garage"
        );

      // Only active leads
      const filtered =
        response.data.filter(
          (lead) =>
            lead.leadStatus !==
            "CONVERTED"
        );

      setLeads(filtered);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusLabel = (
    status
  ) => {
    switch (status) {

      case "INTERESTED":
        return "Interested";

      case "FOLLOW_UP":
        return "Follow Up Needed";

      case "PENDING":
        return "Pending";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-6 sm:p-10 font-sans antialiased relative">

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-neutral-200">

        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold block mb-2">
          — PROSPECTING REGISTRY —
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-normal tracking-tight text-neutral-900 font-serif">
              Field Visitation Leads
            </h1>

            <p className="text-neutral-500 text-xs mt-1">
              Active garage leads and follow-up tracking.
            </p>

          </div>

          {/* Stats */}
          <div className="flex gap-6 border-l border-neutral-200 pl-0 sm:pl-6 pt-2 sm:pt-0">

            <div>

              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                Active Leads
              </span>

              <span className="text-xl font-normal text-neutral-900">
                {leads.length}
              </span>

            </div>

            <div>

              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                Interested
              </span>

              <span className="text-xl font-normal text-neutral-900">
                {
                  leads.filter(
                    (l) =>
                      l.leadStatus ===
                      "INTERESTED"
                  ).length
                }
              </span>

            </div>

          </div>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center text-neutral-400">
          Loading leads...
        </div>
      )}

      {/* Empty */}
      {!loading &&
        leads.length === 0 && (
          <div className="py-20 text-center text-neutral-400">
            No active leads found
          </div>
        )}

      {/* Table */}
      {!loading &&
        leads.length > 0 && (

        <div className="bg-white border border-[#D9D9D9] shadow-[0_12px_40px_rgba(0,0,0,0.01)] overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              {/* Table Head */}
              <thead>

                <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-widest text-neutral-500 font-bold">

                  <th className="py-4 px-6 font-bold">
                    Garage Details
                  </th>

                  <th className="py-4 px-6 font-bold">
                    Contact
                  </th>

                  <th className="py-4 px-6 font-bold">
                    Status
                  </th>

                  <th className="py-4 px-6 font-bold">
                    Notes
                  </th>

                </tr>

              </thead>

              {/* Body */}
              <tbody className="divide-y divide-neutral-100 text-sm">

                {leads.map((lead) => (

                  <tr
                    key={lead.id}
                    className="hover:bg-neutral-50/50 transition-colors group"
                  >

                    {/* Garage */}
                    <td className="py-5 px-6 align-top max-w-[240px]">

                      <div className="font-bold text-neutral-900">
                        {lead.shopName}
                      </div>

                      <div className="text-neutral-500 text-xs mt-1">
                        {lead.address}
                      </div>

                    </td>

                    {/* Contact */}
                    <td className="py-5 px-6 text-neutral-600 text-xs align-middle">

                      <div>
                        {lead.phoneNumber}
                      </div>

                      {lead.location && (
                        <div className="mt-1 text-neutral-400">
                          {lead.location}
                        </div>
                      )}

                    </td>

                    {/* Status */}
                    <td className="py-5 px-6 align-middle">

                      <div className="flex items-center gap-2">

                        <span
                          className={`h-1.5 w-1.5 rounded-full block shrink-0 ${
                            lead.leadStatus ===
                            "INTERESTED"
                              ? "bg-blue-500"
                              : lead.leadStatus ===
                                "FOLLOW_UP"
                              ? "bg-amber-500"
                              : lead.leadStatus ===
                                "PENDING"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        />

                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                          {getStatusLabel(
                            lead.leadStatus
                          )}
                        </span>

                      </div>

                    </td>

                    {/* Notes */}
                    <td className="py-5 px-6 text-neutral-500 text-xs leading-relaxed max-w-sm align-middle">

                      {lead.notes ||
                        "No notes available"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default EmployeeLeads;