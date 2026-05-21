import { useState } from "react";

const EmployeeLeads = () => {
  // Dummy data mapping garage onboarding acquisition metrics
  const [leads] = useState([
    {
      id: "LD-9021",
      garageName: "Apex Performance Tuning",
      owner: "Marcus Vance",
      visitedDate: "2026-05-18",
      currentSystem: "None (Pen & Paper)",
      status: "CONVERTED",
      feedback: "Highly interested in the digital bay scheduling. Subscribed to our standard tier immediately."
    },
    {
      id: "LD-8842",
      garageName: "Downtown Auto Care",
      owner: "Sarah Jenkins",
      visitedDate: "2026-05-19",
      currentSystem: "Existing Competitor",
      status: "COMPETITOR_ACTIVE",
      feedback: "Currently locked into a 12-month contract with a legacy CRM. Asked for a follow-up demo in November."
    },
    {
      id: "LD-8711",
      garageName: "Prestige Collision Center",
      owner: "Robert Chen",
      visitedDate: "2026-05-20",
      currentSystem: "None (Excel Sheets)",
      status: "CONSIDERING",
      feedback: "Likes the real-time vehicle status tracker feature. Reviewing pricing metrics with their business partner."
    },
    {
      id: "LD-8690",
      garageName: "Precision Brake & Alignment",
      owner: "Gary Thomas",
      visitedDate: "2026-05-20",
      currentSystem: "Unwilling to Change",
      status: "NOT_INTERESTED",
      feedback: "Owner is old-school and flatly refused to adopt digital operations. Does not see a need for workflow software."
    },
    {
      id: "LD-8544",
      garageName: "Elite Custom Bodyworks",
      owner: "Elena Rostova",
      visitedDate: "2026-05-21",
      currentSystem: "None (Pen & Paper)",
      status: "CONSIDERING",
      feedback: "Impressive feedback on parts management module. Requested a customized quote for a 5-bay workshop infrastructure."
    }
  ]);

  // Pure monochrome text status formatting map
  const getStatusLabel = (status) => {
    switch (status) {
      case "CONVERTED": return "Will Onboard / Subscribed";
      case "COMPETITOR_ACTIVE": return "Already Using Competitor";
      case "CONSIDERING": return "Evaluating / Thinking";
      case "NOT_INTERESTED": return "Declined / No Interest";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-6 pt- sm:pt-10 sm:p-10 font-sans antialiased relative">
      
      {/* Upper Ledger Context Header */}
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
              Log book recording physical garage site visits, technical presentations, and retention updates.
            </p>
          </div>
          
          {/* Decorative Minimal Statistics Indicators */}
          <div className="flex gap-6 border-l border-neutral-200 pl-0 sm:pl-6 pt-2 sm:pt-0">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">Total Runs</span>
              <span className="text-xl font-normal text-neutral-900">{leads.length} Bays</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">Conversions</span>
              <span className="text-xl font-normal text-neutral-900">
                {leads.filter(l => l.status === "CONVERTED").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Structural Data Grid Block */}
      <div className="bg-white border border-[#D9D9D9] rounded-none shadow-[0_12px_40px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table structural column heads */}
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-widest text-neutral-500 font-bold">
                <th className="py-4 px-6 font-bold">Garage Details</th>
                <th className="py-4 px-6 font-bold">Current Infrastructure</th>
                <th className="py-4 px-6 font-bold">Operation Status</th>
                <th className="py-4 px-6 font-bold">Technician Evaluation Feedback</th>
              </tr>
            </thead>
            
            {/* Table data body rows */}
            <tbody className="divide-y divide-neutral-100 text-sm">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors group">
                  
                  {/* Column 1: Primary Target Meta */}
                  <td className="py-5 px-6 vertical-align-top max-w-[240px]">
                    <div className="text-xs font-mono text-neutral-400 mb-1">{lead.id}</div>
                    <div className="font-bold text-neutral-900 group-hover:text-black transition-colors">
                      {lead.garageName}
                    </div>
                    <div className="text-neutral-500 text-xs mt-0.5">
                      Contact: {lead.owner} • <span className="text-[11px] font-mono">{lead.visitedDate}</span>
                    </div>
                  </td>
                  
                  {/* Column 2: Tech Setup profile */}
                  <td className="py-5 px-6 text-neutral-600 text-xs align-middle">
                    <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-none border border-neutral-200 font-mono text-[11px]">
                      {lead.currentSystem}
                    </span>
                  </td>
                  
                  {/* Column 3: Intent/Status Badge flags */}
                  <td className="py-5 px-6 align-middle">
                    <div className="flex items-center gap-2">
                      {/* Architectural custom color dot signals to retain clean look */}
                      <span className={`h-1.5 w-1.5 rounded-full block shrink-0 ${
                        lead.status === "CONVERTED" ? "bg-neutral-900 shadow-sm" :
                        lead.status === "CONSIDERING" ? "bg-neutral-400" : 
                        lead.status === "COMPETITOR_ACTIVE" ? "bg-amber-500" : "bg-neutral-200"
                      }`} />
                      <span className={`text-xs font-medium uppercase tracking-wider ${
                        lead.status === "CONVERTED" ? "text-neutral-900 font-bold" : "text-neutral-500"
                      }`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Column 4: Qualitative Review Text field */}
                  <td className="py-5 px-6 text-neutral-500 text-xs leading-relaxed max-w-sm align-middle">
                    {lead.feedback}
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

export default EmployeeLeads;