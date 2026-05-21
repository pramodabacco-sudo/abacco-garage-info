//client\src\routes\AppRoutes.jsx
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

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeLeads from "../pages/employee/EmployeeLeads";
import EmployeeVisits from "../pages/employee/EmployeeVisits";
import AddGarageVisit from "../pages/employee/AddGarageVisit";
import EmployeeAttendance from "../pages/employee/EmployeeAttendance";
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
      </Route>
    </Routes>
  );
};

export default AppRoutes;