import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";

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
  Bell,
  ChevronDown,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  Building2,
  UserPlus,
  FileEdit,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";

/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

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

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  title,
  value,
  change,
  subtitle,
  type,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>
        <Icon size={22} strokeWidth={2} />
      </div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>

        <div className="stat-value-row">
          <strong>{value}</strong>
        </div>

        <span className="stat-subtitle">
          {change ? `${change} ` : ""}
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${
        status === "Probation"
          ? "probation-badge"
          : "active-badge"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------------------------------
     DASHBOARD API STATE
  ------------------------------------------------------- */

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     UI STATE
  ------------------------------------------------------- */

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [period, setPeriod] = useState("This Month");

  /* =======================================================
     GET JWT TOKEN
  ======================================================= */

  const getAuthToken = () => {
    const localToken = localStorage.getItem("hirenestToken");

    const sessionToken = sessionStorage.getItem("hirenestToken");

    const oldLocalToken = localStorage.getItem("token");

    const oldSessionToken = sessionStorage.getItem("token");

    return (
      localToken ||
      sessionToken ||
      oldLocalToken ||
      oldSessionToken
    );
  };

  /* =======================================================
     FETCH DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        console.log(
          "Dashboard Token:",
          token ? "Token found" : "Token missing"
        );

        /* -----------------------------------------------
           TOKEN CHECK
        ------------------------------------------------ */

        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
        }

        /* -----------------------------------------------
           API REQUEST
        ------------------------------------------------ */

        const response = await fetch(
          "http://localhost:8080/api/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Dashboard API Status:",
          response.status
        );

        /* -----------------------------------------------
           UNAUTHORIZED
        ------------------------------------------------ */

        if (response.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );

          setLoading(false);

          return;
        }

        /* -----------------------------------------------
           FORBIDDEN
        ------------------------------------------------ */

        if (response.status === 403) {
          setError(
            "You are not authorized to access the Dashboard."
          );

          setLoading(false);

          return;
        }

        /* -----------------------------------------------
           OTHER API ERRORS
        ------------------------------------------------ */

        if (!response.ok) {
          throw new Error(
            `Dashboard API error: ${response.status}`
          );
        }

        /* -----------------------------------------------
           READ JSON
        ------------------------------------------------ */

        const data = await response.json();

        console.log(
          "Dashboard API Response:",
          data
        );

        setDashboardData(data);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleNavigation = (path) => {
    navigate(path);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    /* Remove authentication from localStorage */

    localStorage.removeItem("token");
    localStorage.removeItem("hirenestToken");
    localStorage.removeItem("hirenestEmail");
    localStorage.removeItem("hirenestRole");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    /* Remove authentication from sessionStorage */

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("hirenestToken");
    sessionStorage.removeItem("hirenestEmail");
    sessionStorage.removeItem("hirenestRole");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");

    navigate("/login");
  };

  /* =======================================================
     BACKEND DASHBOARD VALUES
  ======================================================= */

  const totalEmployees =
    dashboardData?.totalEmployees ?? 0;

  const totalInterns =
    dashboardData?.totalInterns ?? 0;

  const fullTimeEmployees =
    dashboardData?.totalFullTimeEmployees ?? 0;

  const totalDomains =
    dashboardData?.totalDomains ?? 0;

  const probationInProgress =
    dashboardData?.probationInProgress ?? 0;

  const probationCompleted =
    dashboardData?.probationCompleted ?? 0;

  const probationDueSoon =
    dashboardData?.probationDueSoon ?? 0;

  /* =======================================================
     EMPLOYEES BY DOMAIN
  ======================================================= */

  const backendDomainData =
    dashboardData?.employeesByDomain || [];

  const domainTotal = backendDomainData.reduce(
    (total, item) =>
      total + Number(item.employeeCount || 0),
    0
  );

  const domainData = backendDomainData.map(
    (domain, index) => {
      const count = Number(
        domain.employeeCount || 0
      );

      const percentage =
        domainTotal > 0
          ? Math.round(
              (count / domainTotal) * 100
            )
          : 0;

      const classNames = [
        "development",
        "testing",
        "design",
        "hr",
        "finance",
        "others",
      ];

      return {
        name: domain.domainName,
        value: count,
        percentage,
        className:
          classNames[index % classNames.length],
      };
    }
  );

  /* =======================================================
     PROBATION DATA
  ======================================================= */

  const probationData = [
    {
      label: "In Progress",
      value: probationInProgress,
      className: "progress",
    },
    {
      label: "Due Soon",
      value: probationDueSoon,
      className: "due",
    },
    {
      label: "Completed",
      value: probationCompleted,
      className: "completed",
    },
  ];

  const probationMaximum = Math.max(
    ...probationData.map(
      (item) => item.value
    ),
    1
  );

  /* =======================================================
     RECENTLY JOINED EMPLOYEES
  ======================================================= */

  const recentEmployees =
    dashboardData?.recentlyJoinedEmployees || [];

  /* =======================================================
     RECENT RECORDS
  ======================================================= */

  const backendRecentRecords =
    dashboardData?.recentRecords || [];

  const getRecordIcon = (recordType) => {
    const type = String(
      recordType || ""
    ).toLowerCase();

    if (type.includes("employment")) {
      return BriefcaseBusiness;
    }

    if (type.includes("document")) {
      return FileText;
    }

    if (type.includes("probation")) {
      return ShieldCheck;
    }

    if (type.includes("domain")) {
      return Layers3;
    }

    if (
      type.includes("profile") ||
      type.includes("employee")
    ) {
      return UserPlus;
    }

    return FileEdit;
  };

  const getRecordClass = (recordType) => {
    const type = String(
      recordType || ""
    ).toLowerCase();

    if (type.includes("employment")) {
      return "record-green";
    }

    if (type.includes("document")) {
      return "record-purple";
    }

    if (type.includes("probation")) {
      return "record-orange";
    }

    if (type.includes("domain")) {
      return "record-teal";
    }

    return "record-blue";
  };

  const recentRecords =
    backendRecentRecords.map(
      (record) => ({
        id: record.employeeCode,
        title:
          record.recordType ||
          "Employee Record",
        description:
          record.fullName ||
          "Employee record updated",
        time: formatDate(
          record.recordDate
        ),
        icon: getRecordIcon(
          record.recordType
        ),
        className:
          getRecordClass(
            record.recordType
          ),
      })
    );

  /* =======================================================
     CURRENT USER DETAILS
  ======================================================= */

  const userEmail =
    localStorage.getItem(
      "hirenestEmail"
    ) ||
    sessionStorage.getItem(
      "hirenestEmail"
    ) ||
    "User";

  const userRole =
    localStorage.getItem(
      "hirenestRole"
    ) ||
    sessionStorage.getItem(
      "hirenestRole"
    ) ||
    "User";

  const userInitial =
    userEmail.charAt(0).toUpperCase();

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

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

        <nav className="sidebar-nav">

          {navigationItems.map((item) => {

            const Icon = item.icon;

            const isActive =
              location.pathname === item.path ||
              (
                item.path === "/dashboard" &&
                location.pathname === "/"
              );

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  isActive
                    ? "active"
                    : ""
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
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="topbar">

          <div className="search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search employees, domains, documents..."
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />

            {searchText && (
              <button
                className="clear-search"
                onClick={() =>
                  setSearchText("")
                }
              >
                <X size={14} />
              </button>
            )}

          </div>

          <div className="topbar-right">

            <div className="profile-wrapper">

              <button
                className="profile-menu"
                onClick={() =>
                  setShowProfileMenu(
                    !showProfileMenu
                  )
                }
              >

                <div className="topbar-profile">

                  <div className="profile-avatar">

                    {userInitial}

                  </div>

                  <div>

                    <strong>
                      {userEmail}
                    </strong>

                    <span>
                      {userRole}
                    </span>

                  </div>

                </div>

                <ChevronDown size={17} />

              </button>

              {showProfileMenu && (

                <div className="profile-dropdown">

                  <button
                    onClick={() =>
                      navigate(
                        "/profile"
                      )
                    }
                  >
                    <UserRound
                      size={15}
                    />
                    My Profile
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        "/settings"
                      )
                    }
                  >
                    <Settings
                      size={15}
                    />
                    Settings
                  </button>

                  <div className="dropdown-divider"></div>

                  <button
                    className="logout-button"
                    onClick={
                      handleLogout
                    }
                  >
                    <LogOut
                      size={15}
                    />
                    Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <div className="dashboard-content">

          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="welcome-section">

            <div>

              <p className="welcome-small">
                Good morning,
              </p>

              <h1>
                {userEmail.split("@")[0]}{" "}
                <span>👋</span>
              </h1>

              <p className="welcome-description">
                Here's what's happening
                with your employees today.
              </p>

            </div>

            <div className="date-card">

              <div className="date-icon">
                <CalendarDays
                  size={22}
                />
              </div>

              <div>

                <strong>
                  {new Date().toLocaleDateString(
                    "en-GB",
                    {
                      weekday:
                        "long",
                      day: "2-digit",
                      month:
                        "short",
                      year:
                        "numeric",
                    }
                  )}
                </strong>

                <span>
                  Have a productive day!
                </span>

              </div>

            </div>

          </section>

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (

            <div
              style={{
                background:
                  "#fff1f2",
                color: "#b91c1c",
                border:
                  "1px solid #fecdd3",
                borderRadius:
                  "12px",
                padding:
                  "14px 18px",
                marginBottom:
                  "20px",
                fontSize:
                  "14px",
              }}
            >

              {error}

              <button
                onClick={() =>
                  window.location.reload()
                }
                style={{
                  marginLeft:
                    "15px",
                  border: "none",
                  background:
                    "#b91c1c",
                  color: "#fff",
                  padding:
                    "7px 12px",
                  borderRadius:
                    "7px",
                  cursor:
                    "pointer",
                }}
              >
                Retry
              </button>

            </div>

          )}

          {/* =================================================
              LOADING MESSAGE
          ================================================= */}

          {loading && (

            <div
              style={{
                padding:
                  "12px 0",
                color:
                  "#064e3b",
                fontSize:
                  "14px",
              }}
            >
              Loading dashboard data...
            </div>

          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="stats-grid">

            <StatCard
              icon={Users}
              title="Total Employees"
              value={totalEmployees}
              change=""
              subtitle="From backend"
              type="green"
            />

            <StatCard
              icon={UserRound}
              title="Total Interns"
              value={totalInterns}
              change=""
              subtitle="From backend"
              type="blue"
            />

            <StatCard
              icon={BriefcaseBusiness}
              title="Full-Time Employees"
              value={
                fullTimeEmployees
              }
              change=""
              subtitle="From backend"
              type="orange"
            />

            <StatCard
              icon={Building2}
              title="Total Domains"
              value={totalDomains}
              change=""
              subtitle="From backend"
              type="purple"
            />

          </section>

          {/* =================================================
              CHART SECTION
          ================================================= */}

          <section className="charts-grid">

            {/* EMPLOYEES BY DOMAIN */}

            <div className="dashboard-card domain-card">

              <div className="card-header">

                <h2>
                  Employees by Domain
                </h2>

                <select
                  className="period-button"
                  value={period}
                  onChange={(e) =>
                    setPeriod(
                      e.target.value
                    )
                  }
                >

                  <option>
                    This Month
                  </option>

                  <option>
                    This Week
                  </option>

                  <option>
                    Last Month
                  </option>

                  <option>
                    This Year
                  </option>

                </select>

              </div>

              <div className="domain-content">

                <div className="donut-wrapper">

                  <div className="donut-chart">

                    <div className="donut-center">

                      <strong>
                        {totalEmployees}
                      </strong>

                      <span>
                        Employees
                      </span>

                    </div>

                  </div>

                </div>

                <div className="domain-list">

                  {domainData.length > 0 ? (

                    domainData.map(
                      (domain) => (

                        <div
                          className="domain-row"
                          key={
                            domain.name
                          }
                        >

                          <div className="domain-name">

                            <span
                              className={`domain-dot ${domain.className}`}
                            ></span>

                            <span>
                              {
                                domain.name
                              }
                            </span>

                          </div>

                          <strong>
                            {
                              domain.value
                            }
                          </strong>

                          <span className="domain-percentage">
                            {
                              domain.percentage
                            }%
                          </span>

                        </div>

                      )
                    )

                  ) : (

                    <div
                      style={{
                        padding:
                          "20px",
                        color:
                          "#64748b",
                        fontSize:
                          "14px",
                      }}
                    >
                      No domain data
                      available.
                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* PROBATION */}

            <div className="dashboard-card probation-card">

              <div className="card-header">

                <h2>
                  Probation Status
                </h2>

                <button className="period-button">

                  This Month

                  <ChevronDown
                    size={14}
                  />

                </button>

              </div>

              <div className="bar-chart">

                {probationData.map(
                  (item) => (

                    <div
                      className="bar-column"
                      key={
                        item.label
                      }
                    >

                      <strong>
                        {
                          item.value
                        }
                      </strong>

                      <div className="bar-area">

                        <div
                          className={`bar ${item.className}`}
                          style={{
                            height: `${
                              (item.value /
                                probationMaximum) *
                              100
                            }%`,
                          }}
                        ></div>

                      </div>

                      <span>
                        {
                          item.label
                        }
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

          {/* =================================================
              TABLE SECTION
          ================================================= */}

          <section className="tables-grid">

            {/* RECENT EMPLOYEES */}

            <div className="dashboard-card table-card">

              <div className="card-header">

                <h2>
                  Recently Joined Employees
                </h2>

                <button
                  className="view-all"
                  onClick={() =>
                    navigate(
                      "/employees"
                    )
                  }
                >
                  View All
                </button>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>ID</th>
                      <th>Name</th>
                      <th>Domain</th>
                      <th>Join Date</th>
                      <th>Employment Type</th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentEmployees.length > 0 ? (

                      recentEmployees.map(
                        (employee) => (

                          <tr
                            key={
                              employee.employeeId
                            }
                          >

                            <td>

                              <div className="employee-id">

                                <span className="employee-avatar">
                                  {(
                                    employee.fullName ||
                                    "U"
                                  )
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </span>

                                {
                                  employee.employeeCode ||
                                  "-"
                                }

                              </div>

                            </td>

                            <td>
                              {
                                employee.fullName ||
                                "-"
                              }
                            </td>

                            <td>
                              {
                                employee.domainName ||
                                "-"
                              }
                            </td>

                            <td>
                              {formatDate(
                                employee.joiningDate
                              )}
                            </td>

                            <td>
                              <StatusBadge
                                status={
                                  employee.employmentType ||
                                  "-"
                                }
                              />
                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="5"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "30px",
                            color:
                              "#64748b",
                          }}
                        >
                          No recently
                          joined employees
                          found.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* RECENT RECORDS */}

            <div className="dashboard-card table-card records-card">

              <div className="card-header">

                <h2>
                  Recent Records
                </h2>

                <button
                  className="view-all"
                  onClick={() =>
                    navigate(
                      "/reports"
                    )
                  }
                >
                  View All
                </button>

              </div>

              <div className="records-list">

                {recentRecords.length > 0 ? (

                  recentRecords.map(
                    (record) => {

                      const Icon =
                        record.icon;

                      return (

                        <div
                          className="record-item"
                          key={`${record.id}-${record.time}`}
                        >

                          <div
                            className={`record-icon ${record.className}`}
                          >
                            <Icon
                              size={16}
                            />
                          </div>

                          <div className="record-info">

                            <strong>
                              {
                                record.title
                              }
                            </strong>

                            <span>
                              {
                                record.id
                              }{" "}
                              ·{" "}
                              {
                                record.description
                              }
                            </span>

                          </div>

                          <span className="record-time">
                            {
                              record.time
                            }
                          </span>

                        </div>

                      );
                    }
                  )

                ) : (

                  <div
                    style={{
                      padding:
                        "30px 20px",
                      textAlign:
                        "center",
                      color:
                        "#64748b",
                      fontSize:
                        "14px",
                    }}
                  >
                    No recent records
                    available.
                  </div>

                )}

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;