import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers3,
  Clock3,
  FileText,
  BarChart3,
  User,
  Settings,
  Search,
  Plus,
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";

import "./index.css";

const API_URL = "http://localhost:8080/api/employees";

function EmployeeList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -----------------------------
     GET CURRENT EMPLOYEES
  ----------------------------- */

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Employee API Error:", err);
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* -----------------------------
     SEARCH
  ----------------------------- */

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      employee.employeeId
        ?.toLowerCase()
        .includes(searchText) ||
      employee.fullName
        ?.toLowerCase()
        .includes(searchText) ||
      employee.email
        ?.toLowerCase()
        .includes(searchText) ||
      employee.phone
        ?.toLowerCase()
        .includes(searchText) ||
      employee.domainName
        ?.toLowerCase()
        .includes(searchText) ||
      employee.domain
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  /* -----------------------------
     DELETE / FORMER EMPLOYEE
  ----------------------------- */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to move this employee to Former Employees?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees((previous) =>
        previous.filter((employee) => employee.id !== id)
      );
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Unable to move employee to Former Employees.");
    }
  };

  /* -----------------------------
     SIDEBAR
  ----------------------------- */

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Employees",
      icon: Users,
      path: "/employees",
    },
    {
      label: "Domains",
      icon: Layers3,
      path: "/domains",
    },
    {
      label: "Probation",
      icon: Clock3,
      path: "/probation",
    },
    {
      label: "Documents",
      icon: FileText,
      path: "/documents",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
    {
      label: "Users",
      icon: Users,
      path: "/users",
    },
  ];

  const bottomItems = [
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="employee-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="employee-sidebar">

        {/* Logo */}

        <div className="sidebar-brand">
          <div className="brand-mark">
            H
          </div>

          <span>HireNest</span>
        </div>

        {/* Main Navigation */}

        <div className="sidebar-section">

          <p className="sidebar-label">
            Main Menu
          </p>

          <nav className="sidebar-nav">

            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  className={`sidebar-item ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                >
                  <Icon size={18} />

                  <span>{item.label}</span>

                  {isActive && (
                    <ChevronRight
                      size={15}
                      className="sidebar-arrow"
                    />
                  )}
                </button>
              );
            })}

          </nav>

        </div>

        {/* Bottom Navigation */}

        <div className="sidebar-bottom">

          {bottomItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="sidebar-item"
                onClick={() =>
                  handleNavigation(item.path)
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </button>
            );
          })}

        </div>

        {/* User */}

        <div className="sidebar-user">

          <div className="user-avatar">
            G
          </div>

          <div className="user-info">
            <strong>Gomathi</strong>
            <span>HR</span>
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="employee-main">

        {/* Top Header */}

      

        
        {/* Content */}

        <section className="employee-content">

          {/* Back */}

          <button
            className="back-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          {/* Page Heading */}

          <div className="employee-page-heading">

            <div>
              <h1>Employees</h1>

              <p>
                Manage and view all current employees
              </p>
            </div>

            {/* Action Buttons */}

            <div className="employee-page-actions">

              <button
                className="secondary-action intern-action"
                onClick={() =>
                  navigate("/employees/interns")
                }
              >
                <Users size={16} />
                Interns
              </button>

              <button
                className="secondary-action former-action"
                onClick={() =>
                  navigate("/former-employees")
                }
              >
                Former Employees
              </button>

              <button
                className="primary-action"
                onClick={() =>
                  navigate("/employees/add")
                }
              >
                <Plus size={17} />
                Add Employee
              </button>

            </div>

          </div>

          {/* Table Card */}

          <div className="employee-card">

            {/* Table Header */}

            <div className="employee-card-header">

              <div>
                <h2>Employee List</h2>

                <p>
                  {filteredEmployees.length} current employees
                </p>
              </div>

              <div className="employee-table-search">

                <Search size={16} />

                <input
                  type="text"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="employee-error">
                {error}
              </div>
            )}

            {/* Loading */}

            {loading ? (

              <div className="employee-loading">
                Loading employees...
              </div>

            ) : (

              <div className="employee-table-wrapper">

                <table className="employee-table">

                  <thead>

                    <tr>
                      <th>Employee ID</th>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Domain</th>
                      <th>Employment Type</th>
                      <th>Joining Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredEmployees.length > 0 ? (

                      filteredEmployees.map((employee) => (

                        <tr key={employee.id}>

                          <td>
                            <span className="employee-id">
                              {employee.employeeId || "-"}
                            </span>
                          </td>

                          <td>

                            <div className="employee-person">

                              <div className="employee-avatar">
                                {employee.fullName
                                  ?.charAt(0)
                                  ?.toUpperCase() || "E"}
                              </div>

                              <div>
                                <strong>
                                  {employee.fullName || "-"}
                                </strong>

                                <span>
                                  {employee.phone || "-"}
                                </span>
                              </div>

                            </div>

                          </td>

                          <td>
                            {employee.email || "-"}
                          </td>

                          <td>
                            {employee.domainName ||
                              employee.domain ||
                              "-"}
                          </td>

                          <td>
                            {employee.employmentType || "-"}
                          </td>

                          <td>
                            {employee.joiningDate || "-"}
                          </td>

                          <td>

                            <span
                              className={`status-pill ${
                                employee.status
                                  ?.toLowerCase() ===
                                "active"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              <span className="status-dot" />

                              {employee.status ||
                                "Active"}
                            </span>

                          </td>

                          <td>

                            <div className="row-actions">

                              <button
                                className="row-action view"
                                title="View"
                                onClick={() =>
                                  navigate(
                                    `/employees/${employee.id}`
                                  )
                                }
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                className="row-action edit"
                                title="Edit"
                                onClick={() =>
                                  navigate(
                                    `/employees/${employee.id}/edit`
                                  )
                                }
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                className="row-action delete"
                                title="Move to Former Employees"
                                onClick={() =>
                                  handleDelete(
                                    employee.id
                                  )
                                }
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan="8"
                          className="no-employees"
                        >
                          No employees found
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default EmployeeList;