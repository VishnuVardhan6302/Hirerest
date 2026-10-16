
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

// Authentication
import Login from "./components/Authentication/Login";
import ForgotPassword from "./components/Authentication/ForgotPassword";

// Application components
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";

// Employee modules
import EmployeeList from "./components/Employees/EmployeeList";
import AddEmployee from "./components/Employees/AddEmployee";
import EmployeeDetails from "./components/Employees/EmployeeDetails";
import EditEmployee from "./components/Employees/EditEmployee";
import FormerEmployees from "./components/Employees/FormerEmployees";
import Interns from "./components/Employees/Interns";

// Finance modules
import EmployeeFinance from "./components/EmployeeFinance";
import Salary from "./components/EmployeeFinance/Salary";
import Stipend from "./components/EmployeeFinance/Stipend";
import BankDetails from "./components/EmployeeFinance/BankDetails";

import PFUAN from "./components/EmployeeFinance/PFUAN";

// Use the same storage keys as Login.jsx
function getToken() {
  return (
    localStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("hirenestToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

// Protect application pages
function RequireAuth() {
  const location = useLocation();

  if (!getToken()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

// Simple placeholder for modules not implemented yet
function ModulePage({ title }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f4f8f7",
        color: "#073f34",
      }}
    >
      <h1>{title}</h1>
      <p>This module is under development.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate
              to={getToken() ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* Public authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Protected application pages */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Employee management */}
            <Route
              path="/employees"
              element={<EmployeeList />}
            />
            <Route
              path="/employees/add"
              element={<AddEmployee />}
            />
            <Route
              path="/employees/:id/edit"
              element={<EditEmployee />}
            />
            <Route
              path="/employees/:id"
              element={<EmployeeDetails />}
            />
            <Route
              path="/employees/interns"
              element={<Interns />}
            />
            <Route
              path="/former-employees"
              element={<FormerEmployees />}
            />

            {/* Other modules */}
            <Route
              path="/domains"
              element={<ModulePage title="Domains" />}
            />
            <Route
              path="/probation"
              element={<ModulePage title="Probation" />}
            />
            <Route
              path="/documents"
              element={<ModulePage title="Documents" />}
            />
            <Route
              path="/reports"
              element={<ModulePage title="Reports" />}
            />
            <Route
              path="/users"
              element={<ModulePage title="Users" />}
            />
            <Route
              path="/profile"
              element={<ModulePage title="Profile" />}
            />
            <Route
              path="/settings"
              element={<ModulePage title="Settings" />}
            />

            {/* Employee finance */}
            <Route
              path="/employee-finance"
              element={<EmployeeFinance />}
            />
            <Route
              path="/employee-finance/salary"
              element={<Salary />}
            />
            <Route
              path="/employee-finance/stipend"
              element={<Stipend />}
            />
            <Route
              path="/employee-finance/bank-details"
              element={<BankDetails />}
            />
               <Route
  path="/employee-finance/pf-uan"
  element={<PFUAN />}
/>
      
          </Route>
          


        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to={getToken() ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;