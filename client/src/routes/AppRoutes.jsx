// client\src\routes\AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminReports from "../pages/admin/AdminReports";
import AdminSettings from "../pages/admin/AdminSettings";
import AddEmployee from "../pages/admin/AddEmployee";
import AdminAttendance from "../pages/admin/AdminAttendance";
import AdminGarageVisits from "../pages/admin/AdminGarageVisits";
// ADDED: School module (admin)
import AdminSchools from "../pages/admin/AdminSchools";
// ADDED: Vehicle tracking (admin)
import AdminVehicles from "../pages/admin/AdminVehicles";

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeLeads from "../pages/employee/EmployeeLeads";
import EmployeeVisits from "../pages/employee/EmployeeVisits";
import AddGarageVisit from "../pages/employee/AddGarageVisit";
import EmployeeAttendance from "../pages/employee/EmployeeAttendance";
// ADDED: Import your new Follow Ups component
import EmployeeFollowUps from "../pages/employee/EmployeeFollowUps"; 
// ADDED: School module (employee)
import AddSchool from "../pages/employee/AddSchool";
import EmployeeSchools from "../pages/employee/EmployeeSchools";
// ADDED: School Details (shared by both roles)
import SchoolDetails from "../pages/shared/SchoolDetails";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route
          path="add-employee"
          element={<AddEmployee />}
        />
        <Route
          path="attendance"
          element={<AdminAttendance />}
        />
        <Route
          path="garage-visits"
          element={
            <AdminGarageVisits />
          }
        />
        {/* ADDED: School routes (admin) */}
        <Route path="schools" element={<AdminSchools />} />
        <Route path="schools/:id" element={<SchoolDetails />} />
        {/* ADDED: Vehicle tracking (admin) */}
        <Route path="vehicles" element={<AdminVehicles />} />
      </Route>

      {/* EMPLOYEE */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="leads" element={<EmployeeLeads />} />
        
        {/* ADDED: Route matching your sidebar path configuration */}
        <Route path="followups" element={<EmployeeFollowUps />} /> 
        
        <Route path="visits" element={<EmployeeVisits />} />
        <Route
          path="add-garage"
          element={<AddGarageVisit />}
        />
        <Route
          path="attendance"
          element={
            <EmployeeAttendance />
          }
        />
        {/* ADDED: School routes (employee) */}
        <Route path="add-school" element={<AddSchool />} />
        <Route path="schools" element={<EmployeeSchools />} />
        <Route path="schools/:id" element={<SchoolDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;