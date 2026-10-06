import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Home,
  Users,
  Layers3,
  Clock3,
  FileText,
  BarChart3,
  UserCircle,
  Settings,
  Search,
  Plus,
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import "./index.css";

/* =========================================================
   EMPLOYEE LIST
   MOCK DATA VERSION
   ========================================================= */

function EmployeeList() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     STATE
     ======================================================= */

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     GET MOCK EMPLOYEES
     ======================================================= */

  const fetchEmployees = () => {
    try {
      setLoading(true);
      setError("");

      const storedEmployees =
        localStorage.getItem("mockEmployees");

      console.log(
        "Stored mockEmployees:",
        storedEmployees
      );

      if (!storedEmployees) {
        setEmployees([]);
        return;
      }

      const mockEmployees =
        JSON.parse(storedEmployees);

      console.log(
        "Employee List - Mock Employees:",
        mockEmployees
      );

      if (Array.isArray(mockEmployees)) {
        setEmployees(mockEmployees);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error(
        "Employee List Error:",
        err
      );

      setError("Unable to load employees.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD EMPLOYEES WHEN PAGE OPENS
     ======================================================= */

  useEffect(() => {
    if (location.pathname === "/employees") {
      fetchEmployees();
    }
  }, [location.pathname]);

  /* =======================================================
     REFRESH WHEN LOCAL STORAGE CHANGES
     ======================================================= */

  useEffect(() => {
    const handleStorageChange = () => {
      fetchEmployees();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /* =======================================================
     SEARCH
     ======================================================= */

  const filteredEmployees =
    employees.filter((employee) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

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

  /* =======================================================
     DELETE / MOVE TO FORMER EMPLOYEE
     ======================================================= */

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to move this employee to Former Employees?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      /* -----------------------------------------------
         Get current employees
         ----------------------------------------------- */

      const employees =
        JSON.parse(
          localStorage.getItem("mockEmployees")
        ) || [];

      /* -----------------------------------------------
         Find employee
         ----------------------------------------------- */

      const employeeToMove =
        employees.find(
          (employee) =>
            employee.id === id
        );

      if (!employeeToMove) {
        alert("Employee not found.");
        return;
      }

      /* -----------------------------------------------
         Remove from current employees
         ----------------------------------------------- */

      const updatedEmployees =
        employees.filter(
          (employee) =>
            employee.id !== id
        );

      /* -----------------------------------------------
         Get former employees
         ----------------------------------------------- */

      const formerEmployees =
        JSON.parse(
          localStorage.getItem(
            "mockFormerEmployees"
          )
        ) || [];

      /* -----------------------------------------------
         Add employee to former employees
         ----------------------------------------------- */

      const updatedFormerEmployees = [
        ...formerEmployees,
        {
          ...employeeToMove,
          status: "FORMER",
        },
      ];

      /* -----------------------------------------------
         Save current employees
         ----------------------------------------------- */

      localStorage.setItem(
        "mockEmployees",
        JSON.stringify(updatedEmployees)
      );

      /* -----------------------------------------------
         Save former employees
         ----------------------------------------------- */

      localStorage.setItem(
        "mockFormerEmployees",
        JSON.stringify(
          updatedFormerEmployees
        )
      );

      /* -----------------------------------------------
         Update screen
         ----------------------------------------------- */

      setEmployees(updatedEmployees);

      alert(
        "Employee moved to Former Employees."
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to move employee."
      );
    }
  };

  /* =======================================================
     SIDEBAR NAVIGATION
     ======================================================= */

  const navigationItems = [
    {
      label: "Dashboard",
      icon: Home,
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
      icon: UserCircle,
      path: "/users",
    },
    {
      label: "Profile",
      icon: UserCircle,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  /* =======================================================
     NAVIGATION
     ======================================================= */

  const handleNavigation = (path) => {
    navigate(path);
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="employee-layout">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-logo">
            H
          </div>

          <div className="brand-text">

            <h2>HireNest</h2>

            <span>
              EMPLOYEE MANAGEMENT
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname ===
                item.path ||
              (item.path === "/employees" &&
                location.pathname.startsWith(
                  "/employees"
                ));

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
              >

                <Icon
                  size={19}
                  strokeWidth={2}
                />

                <span>
                  {item.label}
                </span>

              </button>
            );
          })}

        </nav>

        {/* BOTTOM CARD */}

        <div className="sidebar-bottom-card">

          <div className="plant-decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <h3>
            Build a Better Workplace
          </h3>

          <p>
            Manage your team efficiently
            with Hirenest.
          </p>

        </div>

      </aside>

      {/* =================================================
          MAIN
          ================================================= */}

      <main className="employee-main">

        {/* =================================================
            TOP BAR
            ================================================= */}

        <header className="employee-topbar">

          <div className="topbar-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <div className="topbar-profile">

            <div className="profile-avatar">
              G
            </div>

            <div>

              <strong>
                Gomathi
              </strong>

              <span>
                HR
              </span>

            </div>

          </div>

        </header>

        {/* =================================================
            CONTENT
            ================================================= */}

        <section className="employee-content">

          {/* BACK TO DASHBOARD */}

          <button
            className="back-dashboard"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={17} />

            Back to Dashboard
          </button>

          {/* PAGE HEADING */}

          <div className="employee-page-heading">

            <div>

              <h1>
                Employees
              </h1>

              <p>
                Manage and view all current
                employees
              </p>

            </div>

            {/* ACTION BUTTONS */}

            <div className="employee-page-actions">

              <button
                className="secondary-action intern-action"
                onClick={() =>
                  navigate(
                    "/employees/interns"
                  )
                }
              >
                <Users size={16} />

                Interns
              </button>

              <button
                className="secondary-action former-action"
                onClick={() =>
                  navigate(
                    "/former-employees"
                  )
                }
              >
                Former Employees
              </button>

              <button
                className="primary-action"
                onClick={() =>
                  navigate(
                    "/employees/add"
                  )
                }
              >
                <Plus size={17} />

                Add Employee
              </button>

            </div>

          </div>

          {/* =================================================
              EMPLOYEE CARD
              ================================================= */}

          <div className="employee-card">

            {/* CARD HEADER */}

            <div className="employee-card-header">

              <div>

                <h2>
                  Employee List
                </h2>

                <p>
                  {filteredEmployees.length}{" "}
                  current employees
                </p>

              </div>

              <div className="employee-table-search">

                <Search size={16} />

                <input
                  type="text"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="employee-error">
                {error}
              </div>
            )}

            {/* =================================================
                LOADING
                ================================================= */}

            {loading ? (

              <div className="employee-loading">
                Loading employees...
              </div>

            ) : (

              <div className="employee-table-wrapper">

                <table className="employee-table">

                  <thead>

                    <tr>

                      <th>
                        Employee ID
                      </th>

                      <th>
                        Employee
                      </th>

                      <th>
                        Email
                      </th>

                      <th>
                        Domain
                      </th>

                      <th>
                        Employment Type
                      </th>

                      <th>
                        Joining Date
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredEmployees.length >
                    0 ? (

                      filteredEmployees.map(
                        (employee) => (

                          <tr
                            key={
                              employee.id
                            }
                          >

                            {/* EMPLOYEE ID */}

                            <td>

                              <span className="employee-id">
                                {employee.employeeId ||
                                  "-"}
                              </span>

                            </td>

                            {/* EMPLOYEE */}

                            <td>

                              <div className="employee-person">

                                <div className="employee-avatar">

                                  {employee.fullName
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase() ||
                                    "E"}

                                </div>

                                <div>

                                  <strong>
                                    {employee.fullName ||
                                      "-"}
                                  </strong>

                                  <span>
                                    {employee.phone ||
                                      "-"}
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* EMAIL */}

                            <td>

                              {employee.email ||
                                "-"}

                            </td>

                            {/* DOMAIN */}

                            <td>

                              {employee.domainName ||
                                employee.domain ||
                                "-"}

                            </td>

                            {/* EMPLOYMENT TYPE */}

                            <td>

                              {employee.employmentType ||
                                "-"}

                            </td>

                            {/* JOINING DATE */}

                            <td>

                              {employee.joiningDate ||
                                "-"}

                            </td>

                            {/* STATUS */}

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

                            {/* ACTIONS */}

                            <td>

                              <div className="row-actions">

                                {/* VIEW */}

                                <button
                                  className="row-action view"
                                  title="View"
                                  onClick={() =>
                                    navigate(
                                      `/employees/${employee.id}`
                                    )
                                  }
                                >

                                  <Eye
                                    size={16}
                                  />

                                </button>

                                {/* EDIT */}

                                <button
                                  className="row-action edit"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(
                                      `/employees/${employee.id}/edit`
                                    )
                                  }
                                >

                                  <Pencil
                                    size={16}
                                  />

                                </button>

                                {/* DELETE */}

                                <button
                                  className="row-action delete"
                                  title="Move to Former Employees"
                                  onClick={() =>
                                    handleDelete(
                                      employee.id
                                    )
                                  }
                                >

                                  <Trash2
                                    size={16}
                                  />

                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )

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