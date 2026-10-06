import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import EmployeeList from "./components/Employees/EmployeeList";
import AddEmployee from "./components/Employees/AddEmployee";
import EmployeeDetails from "./components/Employees/EmployeeDetails";
import EditEmployee from "./components/Employees/EditEmployee";
import FormerEmployees from "./components/Employees/FormerEmployees";

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
      <p>.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTHENTICATION */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* DOMAINS */}

        <Route
          path="/domains"
          element={<ModulePage title="Domains" />}
        />

        {/* PROBATION */}

        <Route
          path="/probation"
          element={<ModulePage title="Probation" />}
        />

        {/* DOCUMENTS */}

        <Route
          path="/documents"
          element={<ModulePage title="Documents" />}
        />

        {/* REPORTS */}

        <Route
          path="/reports"
          element={<ModulePage title="Reports" />}
        />

        {/* USERS */}

        <Route
          path="/users"
          element={<ModulePage title="Users" />}
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={<ModulePage title="Profile" />}
        />

        {/* SETTINGS */}

        <Route
          path="/settings"
          element={<ModulePage title="Settings" />}
        />
        
        <Route
  path="/employees/:id"
  element={<EmployeeDetails />}
/>


       
        <Route path="/employees" element={<EmployeeList />} />

        <Route
  path="/employees/add"
  element={<AddEmployee />}
/>
<Route
  path="/employees/:id/edit"
  element={<EditEmployee />}
/>

<Route
  path="/former-employees"
  element={<FormerEmployees />}
/>

 {/* UNKNOWN URL */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;