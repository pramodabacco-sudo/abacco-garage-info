import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const EMPLOYEE_LINKS = [
  {
    path: "/employee-dashboard",
    label: "Overview Dashboard",
  },
      {
      path:
        "/employee-dashboard/attendance",

      label:
        "Attendance",
    },
  {
    path: "/employee-dashboard/add-garage",
    label: "Add Garage",
  },

  {
    path: "/employee-dashboard/leads",
    label: "Active Leads",
  },

  {
    path: "/employee-dashboard/visits",
    label: "Garage Visits",
  },

  // NEW
];

const EmployeeLayout = () => {
  return (
    <div className="lg:flex min-h-screen">

      <Sidebar
        role="EMPLOYEE"
        links={EMPLOYEE_LINKS}
      />

      <div className="flex-1 bg-[#F8F9FA] min-h-screen overflow-y-auto min-w-0">
        <Outlet />
      </div>

    </div>
  );
};

export default EmployeeLayout;