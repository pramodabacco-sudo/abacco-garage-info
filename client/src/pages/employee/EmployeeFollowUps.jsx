// client\src\pages\employee\EmployeeFollowUps.jsx
import { useEffect, useState } from "react";
import API from "../../api/axios";

const EmployeeFollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowUps = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      const response = await API.get(`/api/garage/employee/${userId}/today-followups`);
      setFollowUps(response.data);
    } catch (error) {
      console.error("Error pulling follow ups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-6 sm:p-10 font-sans antialiased">
      
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-neutral-200">
        <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-bold block mb-2">
          — ACTION REQUIRED TODAY —
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-normal tracking-tight text-neutral-900 font-serif">
              Today's Scheduled Follow-Ups
            </h1>
            <p className="text-neutral-500 text-xs mt-1">
              Garages requiring a callback or re-visit today: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold block">Pending Actions</span>
            <span className="text-2xl font-semibold text-amber-900">{followUps.length}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center text-neutral-400 tracking-wider text-sm">
          Securing schedule registry...
        </div>
      )}

      {/* Empty State */}
      {!loading && followUps.length === 0 && (
        <div className="py-20 text-center border border-dashed border-neutral-200 bg-white rounded-lg max-w-xl mx-auto p-8">
          <p className="text-neutral-400 font-serif italic text-lg">Clear Slate</p>
          <p className="text-neutral-500 text-xs mt-2"> No garage visitations or follow-ups are marked for today.</p>
        </div>
      )}

      {/* Complete Information Grid Cards */}
      {!loading && followUps.length > 0 && (
        <div className="space-y-6 max-w-5xl">
          {followUps.map((visit) => (
            <div key={visit.id} className="bg-white border border-[#D9D9D9] shadow-sm rounded-none overflow-hidden transition-all hover:shadow-md">
              <div className="p-6 sm:p-8">
                
                {/* Top Details Metadata Banner */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold tracking-widest uppercase">
                      {visit.garageType}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase">
                      Status: {visit.leadStatus}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Registered: {new Date(visit.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Core Split Context */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Column 1: Core Identification */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900 font-serif tracking-tight">{visit.shopName}</h2>
                      <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{visit.address}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 font-bold block">Contact Line</span>
                        <span className="text-sm font-medium text-neutral-800">{visit.phoneNumber}</span>
                      </div>
                      {visit.location && (
                        <div>
                          <span className="text-[10px] uppercase text-neutral-400 font-bold block">Coordinates</span>
                          <span className="text-sm font-mono text-neutral-600 break-all">{visit.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Complete Notes Section */}
                    <div className="pt-4 border-t border-neutral-100">
                      <span className="text-[10px] uppercase text-neutral-400 font-bold block mb-1">Visitation Logs / Historical Notes</span>
                      <p className="text-xs text-neutral-700 bg-neutral-50 p-3 border border-neutral-200 leading-relaxed italic whitespace-pre-wrap">
                        "{visit.notes || "No chronological remarks archived for this lead."}"
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Uploaded Verification Media */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase text-neutral-400 font-bold block">Visual Attachments ({visit.images?.length || 0})</span>
                    {visit.images && visit.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {visit.images.map((img) => (
                          <a href={img.imageUrl} target="_blank" rel="noreferrer" key={img.id} className="block group relative overflow-hidden bg-neutral-100 border border-neutral-200 ratio-square">
                            <img 
                              src={img.imageUrl} 
                              alt="Garage attachment" 
                              className="object-cover w-full h-20 group-hover:scale-105 transition-transform duration-300" 
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="h-24 flex items-center justify-center bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-400 italic">
                        No field imagery uploaded
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeFollowUps;