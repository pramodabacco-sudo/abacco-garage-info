const VISITS = [
  {
    id: "VS-3041",
    garage: "Apex Performance Tuning",
    contact: "Marcus Vance",
    date: "2026-05-18",
    duration: "45 min",
    purpose: "Product Demo",
    outcome: "SUBSCRIBED",
    notes: "Walked through bay scheduling module. Owner signed up for standard tier on the spot.",
  },
  {
    id: "VS-3038",
    garage: "Downtown Auto Care",
    contact: "Sarah Jenkins",
    date: "2026-05-19",
    duration: "30 min",
    purpose: "Follow-up Visit",
    outcome: "FOLLOW-UP NEEDED",
    notes: "Currently on a 12-month legacy CRM contract. Requested a demo revisit in November.",
  },
  {
    id: "VS-3035",
    garage: "Prestige Collision Center",
    contact: "Robert Chen",
    date: "2026-05-20",
    duration: "60 min",
    purpose: "Technical Walkthrough",
    outcome: "EVALUATING",
    notes: "Strong interest in vehicle status tracker. Reviewing pricing with business partner.",
  },
  {
    id: "VS-3031",
    garage: "Precision Brake & Alignment",
    contact: "Gary Thomas",
    date: "2026-05-20",
    duration: "20 min",
    purpose: "Cold Visit",
    outcome: "DECLINED",
    notes: "Owner not open to digital tools. No follow-up required at this time.",
  },
  {
    id: "VS-3028",
    garage: "Elite Custom Bodyworks",
    contact: "Diana Patel",
    date: "2026-05-21",
    duration: "50 min",
    purpose: "Pricing Discussion",
    outcome: "EVALUATING",
    notes: "Requested a custom quote for a 5-bay workshop setup. Very interested in parts management.",
  },
  {
    id: "VS-3022",
    garage: "Motofix Express",
    contact: "Leon Okafor",
    date: "2026-05-15",
    duration: "35 min",
    purpose: "Product Demo",
    outcome: "SUBSCRIBED",
    notes: "Fast decision-maker. Onboarded to pro tier. Needs onboarding call next week.",
  },
  {
    id: "VS-3019",
    garage: "Redline Auto Workshop",
    contact: "Tanya Mirza",
    date: "2026-05-14",
    duration: "25 min",
    purpose: "Cold Visit",
    outcome: "NOT INTERESTED",
    notes: "Recently invested in a competitor solution. May revisit in Q4.",
  },
];

const OUTCOME_STYLES = {
  SUBSCRIBED:        { dot: "bg-neutral-900",  text: "text-neutral-900" },
  "FOLLOW-UP NEEDED":{ dot: "bg-amber-400",    text: "text-amber-600"   },
  EVALUATING:        { dot: "bg-blue-400",      text: "text-blue-600"    },
  DECLINED:          { dot: "bg-red-400",        text: "text-red-600"    },
  "NOT INTERESTED":  { dot: "bg-neutral-300",   text: "text-neutral-400" },
};

const EmployeeVisits = () => {
  return (
    <div className="p-6 md:p-10 max-w-screen-xl mx-auto">

      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
            — FIELD ACTIVITY LOG —
          </p>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            Garage Visits
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Physical site visits, demos, and on-site assessments logged by field rep.
          </p>
        </div>

        {/* Summary Chips */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Total Visits</p>
            <p className="text-2xl font-light text-neutral-900">{VISITS.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Converted</p>
            <p className="text-2xl font-light text-neutral-900">
              {VISITS.filter((v) => v.outcome === "SUBSCRIBED").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden">

        {/* Table Head */}
        <div className="hidden md:grid grid-cols-[160px_1fr_130px_120px_1fr] gap-4 px-6 py-3 border-b border-neutral-100 bg-neutral-50">
          {["Visit ID / Garage", "Contact & Date", "Purpose", "Outcome", "Field Notes"].map((h) => (
            <span key={h} className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {VISITS.map((v, i) => {
          const style = OUTCOME_STYLES[v.outcome] ?? { dot: "bg-neutral-300", text: "text-neutral-500" };
          return (
            <div
              key={v.id}
              className={`grid md:grid-cols-[160px_1fr_130px_120px_1fr] gap-4 px-6 py-5 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60 transition-colors duration-100 items-start`}
            >
              {/* Garage */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 mb-0.5">{v.id}</p>
                <p className="text-sm font-semibold text-neutral-900 leading-snug">{v.garage}</p>
              </div>

              {/* Contact + Date */}
              <div>
                <p className="text-sm text-neutral-700">{v.contact}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {v.date} &nbsp;·&nbsp; {v.duration}
                </p>
              </div>

              {/* Purpose */}
              <div>
                <span className="inline-block text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-200 px-2 py-1 bg-neutral-50">
                  {v.purpose}
                </span>
              </div>

              {/* Outcome */}
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                <span className={`text-[10px] uppercase tracking-wider font-medium ${style.text}`}>
                  {v.outcome}
                </span>
              </div>

              {/* Notes */}
              <p className="text-xs text-neutral-500 leading-relaxed">{v.notes}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default EmployeeVisits;