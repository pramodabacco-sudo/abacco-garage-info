import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="w-64 bg-black text-white p-5 flex flex-col justify-between min-h-screen">
      
      <div>
        <h2 className="text-2xl font-bold mb-8">
          {role} Panel
        </h2>

        {/* ADMIN MENU */}
        {role === "Admin" && (
          <ul className="space-y-4">
            <li>
              <Link to="/admin-dashboard">
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/admin-dashboard/employees">
                Employees
              </Link>
            </li>

            <li>
              <Link to="/admin-dashboard/reports">
                Reports
              </Link>
            </li>

            <li>
              <Link to="/admin-dashboard/settings">
                Settings
              </Link>
            </li>
          </ul>
        )}

        {/* EMPLOYEE MENU */}
        {role === "Employee" && (
          <ul className="space-y-4">
            <li>
              <Link to="/employee-dashboard">
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/employee-dashboard/leads">
                Leads
              </Link>
            </li>

            <li>
              <Link to="/employee-dashboard/visits">
                Visits
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;