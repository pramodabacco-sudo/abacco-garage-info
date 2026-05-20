import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Safe normalization of user roles to handle inconsistencies (e.g., "ADMIN" vs "Admin")
  const normalizedRole = role?.toUpperCase();

  // Helper function to handle pure, minimalist active links
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white text-[#1A1A1A] p-6 flex flex-col justify-between min-h-screen border-r border-[#D9D9D9] font-sans antialiased relative z-20">
      
      <div>
        {/* Workspace Brand / Header */}
        <div className="mb-10 pb-6 border-b border-neutral-100">
          <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-bold block mb-1">
            — WORKSTATION —
          </span>
          <h2 className="text-xl font-normal tracking-tight text-neutral-900 capitalize">
            {role?.toLowerCase()} console
          </h2>
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="space-y-1">
          
          {/* ADMIN INTERFACE */}
          {normalizedRole === "ADMIN" && (
            <ul className="space-y-1.5">
              {[
                { path: "/admin-dashboard", label: "Overview Dashboard" },
                { path: "/admin-dashboard/employees", label: "Employee Roster" },
                { path: "/admin-dashboard/reports", label: "Performance Reports" },
                { path: "/admin-dashboard/settings", label: "Console Settings" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block w-full px-4 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    {/* Minimal architectural left-border marker for active states */}
                    {isActive(item.path) && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-neutral-900" />
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* EMPLOYEE INTERFACE */}
          {normalizedRole === "EMPLOYEE" && (
            <ul className="space-y-1.5">
              {[
                { path: "/employee-dashboard", label: "Overview Dashboard" },
                { path: "/employee-dashboard/leads", label: "Active Leads" },
                { path: "/employee-dashboard/visits", label: "Garage Visits" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block w-full px-4 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    {isActive(item.path) && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-neutral-900" />
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          
        </nav>
      </div>

      {/* SYSTEM OPERATIONS (LOGOUT) */}
      <div className="pt-6 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="w-full bg-transparent border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/30 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 rounded-none shadow-sm flex items-center justify-center gap-2"
        >
          {/* Subtle Logout Icon Integration */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0 2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Exit Console
        </button>
      </div>

    </div>
  );
};

export default Sidebar;