const STATS = [
  {
    label: "My Leads",
    value: 12,
    sub: "3 new this week",
    trend: "+3",
    trendUp: true,
  },
  {
    label: "Completed Visits",
    value: 28,
    sub: "Last visit May 21",
    trend: "+5",
    trendUp: true,
  },
  {
    label: "Pending Visits",
    value: 4,
    sub: "Next: May 22",
    trend: "-2",
    trendUp: false,
  },
  {
    label: "Today's Tasks",
    value: 3,
    sub: "2 visits · 1 follow-up",
    trend: "0",
    trendUp: null,
  },
];

const RECENT_LEADS = [
  { id: "LD-9021", garage: "Apex Performance Tuning",   status: "SUBSCRIBED",        date: "2026-05-18" },
  { id: "LD-8842", garage: "Downtown Auto Care",         status: "FOLLOW-UP NEEDED",  date: "2026-05-19" },
  { id: "LD-8711", garage: "Prestige Collision Center",  status: "EVALUATING",        date: "2026-05-20" },
  { id: "LD-8690", garage: "Precision Brake & Alignment",status: "DECLINED",          date: "2026-05-20" },
];

const TODAY = [
  { time: "10:00 AM", task: "Site visit — Elite Custom Bodyworks",     type: "VISIT"     },
  { time: "01:30 PM", task: "Follow-up call — Downtown Auto Care",     type: "FOLLOW-UP" },
  { time: "04:00 PM", task: "Demo walkthrough — Motofix Express",      type: "DEMO"      },
];

const STATUS_STYLES = {
  "SUBSCRIBED":        { dot: "bg-neutral-900", text: "text-neutral-900" },
  "FOLLOW-UP NEEDED":  { dot: "bg-amber-400",   text: "text-amber-600"  },
  "EVALUATING":        { dot: "bg-blue-400",     text: "text-blue-600"   },
  "DECLINED":          { dot: "bg-red-400",       text: "text-red-500"   },
};

const TASK_STYLES = {
  "VISIT":      "bg-neutral-900 text-white",
  "FOLLOW-UP":  "bg-amber-100 text-amber-700",
  "DEMO":       "bg-blue-100 text-blue-700",
};

const EmployeeDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-6 md:p-10 bg-[#F8F9FA] min-h-screen max-w-screen-xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
          — WORKSTATION —
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">
            Overview Dashboard
          </h1>
          <p className="text-xs text-neutral-400 font-mono">{today}</p>
        </div>
        <div className="mt-3 h-px bg-neutral-200 w-full" />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-neutral-200 p-5 flex flex-col justify-between min-h-[120px] hover:border-neutral-400 transition-colors duration-150"
          >
            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
              {s.label}
            </p>
            <div>
              <p className="text-4xl font-light text-neutral-900 leading-none mb-1">
                {s.value}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-neutral-400">{s.sub}</p>
                {s.trendUp !== null && (
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      s.trendUp ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {s.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-col lower section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Leads */}
        <div className="bg-white border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
                Recent Leads
              </p>
              <p className="text-sm font-medium text-neutral-900 mt-0.5">Active Pipeline</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 border border-neutral-200 px-2 py-1">
              {RECENT_LEADS.length} entries
            </span>
          </div>

          <div>
            {RECENT_LEADS.map((lead, i) => {
              const s = STATUS_STYLES[lead.status] ?? { dot: "bg-neutral-300", text: "text-neutral-400" };
              return (
                <div
                  key={lead.id}
                  className="flex items-start gap-4 px-6 py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors duration-100"
                >
                  <p className="text-[10px] font-mono text-neutral-400 mt-0.5 shrink-0 w-16">
                    {lead.id}
                  </p>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 font-medium truncate">{lead.garage}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{lead.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-[9px] uppercase tracking-wider font-semibold ${s.text}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
                Today's Work
              </p>
              <p className="text-sm font-medium text-neutral-900 mt-0.5">Scheduled Activity</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 border border-neutral-200 px-2 py-1">
              {TODAY.length} tasks
            </span>
          </div>

          <div>
            {TODAY.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-6 py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors duration-100"
              >
                {/* Time */}
                <p className="text-[10px] font-mono text-neutral-400 mt-0.5 shrink-0 w-16">
                  {item.time}
                </p>

                {/* Vertical line + dot */}
                <div className="flex flex-col items-center shrink-0 mt-1">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 shrink-0" />
                  {i < TODAY.length - 1 && (
                    <span className="w-px flex-1 bg-neutral-200 mt-1" style={{ minHeight: 28 }} />
                  )}
                </div>

                {/* Task */}
                <div className="flex-1 min-w-0 pb-1">
                  <p className="text-sm text-neutral-800 leading-snug">{item.task}</p>
                  <span
                    className={`inline-block mt-1.5 text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 ${TASK_STYLES[item.type]}`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
              All times local &nbsp;·&nbsp; Updates sync every 5 min
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;