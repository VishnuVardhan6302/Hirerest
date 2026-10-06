import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  Home,
  Layers3,
  Clock3,
  FileText,
  BarChart3,
  UserCircle,
  Settings,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Interns = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");

  // Load interns from mock employee data
  const loadInterns = () => {
    try {
      const storedEmployees =
        JSON.parse(localStorage.getItem("mockEmployees")) || [];

      const internEmployees = storedEmployees.filter(
        (employee) =>
          String(employee.employmentType || "").toUpperCase() === "INTERN"
      );

      setInterns(internEmployees);
    } catch (error) {
      console.error("Error loading interns:", error);
      setInterns([]);
    }
  };

  useEffect(() => {
    loadInterns();

    const handleStorageChange = () => {
      loadInterns();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname]);

  // Search interns
  const filteredInterns = interns.filter((employee) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      String(employee.employeeId || "")
        .toLowerCase()
        .includes(searchText) ||
      String(employee.fullName || "")
        .toLowerCase()
        .includes(searchText) ||
      String(employee.email || "")
        .toLowerCase()
        .includes(searchText) ||
      String(employee.phone || "")
        .toLowerCase()
        .includes(searchText) ||
      String(employee.domainName || employee.domain || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const handleView = (employee) => {
    navigate(`/employees/${employee.id}`, {
      state: {
        employee,
        fromInterns: true,
      },
    });
  };

  const handleEdit = (employee) => {
    navigate(`/employees/${employee.id}/edit`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to move this intern to Former Employees?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const employees =
        JSON.parse(localStorage.getItem("mockEmployees")) || [];

      const employeeToMove = employees.find(
        (employee) => employee.id === id
      );

      if (!employeeToMove) {
        return;
      }

      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );

      const formerEmployees =
        JSON.parse(localStorage.getItem("mockFormerEmployees")) || [];

      const updatedFormerEmployees = [
        ...formerEmployees,
        {
          ...employeeToMove,
          status: "FORMER",
        },
      ];

      localStorage.setItem(
        "mockEmployees",
        JSON.stringify(updatedEmployees)
      );

      localStorage.setItem(
        "mockFormerEmployees",
        JSON.stringify(updatedFormerEmployees)
      );

      setInterns(
        updatedEmployees.filter(
          (employee) =>
            String(employee.employmentType || "").toUpperCase() === "INTERN"
        )
      );

      alert("Intern moved to Former Employees.");
    } catch (error) {
      console.error("Delete intern error:", error);
      alert("Unable to move intern.");
    }
  };

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
      icon: UserRound,
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
    <div className="interns-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">H</div>

          <div className="brand-text">
            <h2>HireNest</h2>
            <span>EMPLOYEE MANAGEMENT</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path ||
              (item.path === "/employees" &&
                location.pathname.startsWith("/employees"));

            return (
              <button
                key={item.label}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom-card">
          <div className="plant-decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <h3>Build a Better Workplace</h3>

          <p>Manage your team efficiently with Hirenest.</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="interns-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="top-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="profile-area">
            <div className="profile-avatar">G</div>

            <div className="profile-info">
              <strong>Gomathi</strong>
              <span>HR</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="interns-content">
          <button
            className="back-dashboard"
            onClick={() => navigate("/employees")}
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>

          <div className="page-heading">
            <div>
              <h1>Interns</h1>

              <p>
                Manage and view all current interns
              </p>
            </div>

            <div className="page-actions">
              <button
                className="secondary-action"
                onClick={() => navigate("/employees")}
              >
                <Users size={16} />
                All Employees
              </button>

              <button
                className="secondary-action"
                onClick={() => navigate("/former-employees")}
              >
                Former Employees
              </button>

              <button
                className="primary-action"
                onClick={() => navigate("/employees/add")}
              >
                <span className="plus-icon">+</span>
                Add Employee
              </button>
            </div>
          </div>

          {/* Table Card */}
          <section className="interns-card">
            <div className="card-header">
              <div>
                <h2>Intern List</h2>

                <p>
                  {filteredInterns.length}{" "}
                  {filteredInterns.length === 1
                    ? "intern"
                    : "interns"}
                </p>
              </div>

              <div className="table-search">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search intern..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredInterns.length > 0 ? (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Intern</th>
                      <th>Email</th>
                      <th>Domain</th>
                      <th>Employment Type</th>
                      <th>Joining Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInterns.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <strong className="employee-id">
                            {employee.employeeId || "-"}
                          </strong>
                        </td>

                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {(
                                employee.fullName || "I"
                              )
                                .charAt(0)
                                .toUpperCase()}
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
                          <span className="email-text">
                            {employee.email || "-"}
                          </span>
                        </td>

                        <td>
                          {employee.domainName ||
                            employee.domain ||
                            "-"}
                        </td>

                        <td>
                          <span className="intern-badge">
                            INTERN
                          </span>
                        </td>

                        <td>
                          {employee.joiningDate || "-"}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              String(
                                employee.status || "ACTIVE"
                              ).toLowerCase()
                            }`}
                          >
                            <span className="status-dot"></span>
                            {employee.status || "ACTIVE"}
                          </span>
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              className="row-action view"
                              title="View Intern"
                              onClick={() =>
                                handleView(employee)
                              }
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              className="row-action edit"
                              title="Edit Intern"
                              onClick={() =>
                                handleEdit(employee)
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              className="row-action delete"
                              title="Move to Former Employees"
                              onClick={() =>
                                handleDelete(employee.id)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={28} />
                </div>

                <h3>
                  {search
                    ? "No interns found"
                    : "No interns yet"}
                </h3>

                <p>
                  {search
                    ? "Try changing your search."
                    : "Employees added with employment type INTERN will appear here."}
                </p>

                {!search && (
                  <button
                    className="primary-action empty-button"
                    onClick={() =>
                      navigate("/employees/add")
                    }
                  >
                    <span className="plus-icon">+</span>
                    Add Intern
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Interns;