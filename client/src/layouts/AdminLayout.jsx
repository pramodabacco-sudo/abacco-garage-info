//client\src\layouts\AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const ADMIN_LINKS = [
  { path: "/admin-dashboard", label: "Overview Dashboard" },

  {
    path: "/admin-dashboard/employees",
    label: "Employee Roster",
  },

  {
    path: "/admin-dashboard/add-employee",
    label: "Add Employee",
  },
  {
    path: "/admin-dashboard/attendance",
    label: "Attendance",
  },
  {
  path: "/admin-dashboard/garage-visits",
  label: "Garage Visits",
},
  {
    path: "/admin-dashboard/reports",
    label: "Performance Reports",
  },

  {
    path: "/admin-dashboard/settings",
    label: "Console Settings",
  },
];

const AdminLayout = () => {
  return (
    <div className="lg:flex min-h-screen">
      {/* ↑ flex only on lg+, block on mobile */}
      <Sidebar role="ADMIN" links={ADMIN_LINKS} />
      <div className="flex-1 bg-[#F8F9FA] min-h-screen overflow-y-auto min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;