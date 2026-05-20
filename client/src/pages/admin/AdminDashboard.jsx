const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded shadow">
          Total Employees
        </div>

        <div className="bg-white p-5 rounded shadow">
          Total Reports
        </div>

        <div className="bg-white p-5 rounded shadow">
          Pending Tasks
        </div>

        <div className="bg-white p-5 rounded shadow">
          Revenue
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;