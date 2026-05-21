const EmployeeDashboard = () => {
  return (
<div className="p-6 pt-20 sm:pt-6 bg-[#F8F9FA] min-h-screen">
  <h1 className="text-3xl font-bold mb-6">
    Employee Dashboard
  </h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded shadow">
          My Leads
        </div>

        <div className="bg-white p-5 rounded shadow">
          Completed Visits
        </div>

        <div className="bg-white p-5 rounded shadow">
          Pending Visits
        </div>

        <div className="bg-white p-5 rounded shadow">
          Today's Work
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;