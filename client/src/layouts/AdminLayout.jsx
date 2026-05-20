import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const EmployeeLayout = () => {
  return (
    <div className="flex">
      <Sidebar role="Employee" />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;