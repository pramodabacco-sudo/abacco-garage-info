import { Link, Outlet, useNavigate } from "react-router-dom";

const EmployeeLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between">

        <div>
          <h2 className="text-2xl font-bold mb-8">
            Employee Panel
          </h2>

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
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-10"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;