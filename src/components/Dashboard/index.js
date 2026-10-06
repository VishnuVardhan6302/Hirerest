import React, { useState } from "react";
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

import "./index.css";

const domainData = [
  {
    name: "Development",
    value: 35,
    percentage: 27,
    className: "development",
  },
  {
    name: "Testing",
    value: 28,
    percentage: 22,
    className: "testing",
  },
  {
    name: "Design",
    value: 18,
    percentage: 14,
    className: "design",
  },
  {
    name: "HR",
    value: 16,
    percentage: 13,
    className: "hr",
  },
  {
    name: "Finance",
    value: 14,
    percentage: 11,
    className: "finance",
  },
  {
    name: "Others",
    value: 17,
    percentage: 13,
    className: "others",
  },
];

const probationData = [
  {
    label: "In Progress",
    value: 16,
    className: "progress",
  },
  {
    label: "Due Soon",
    value: 8,
    className: "due",
  },
  {
    label: "Completed",
    value: 32,
    className: "completed",
  },
  {
    label: "Extended",
    value: 6,
    className: "extended",
  },
];

const recentEmployees = [
  {
    id: "EMP001",
    name: "Rahul Kumar",
    domain: "Development",
    joiningDate: "12 Sep 2026",
    status: "Active",
    avatar: "R",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    domain: "Testing",
    joiningDate: "10 Sep 2026",
    status: "Active",
    avatar: "P",
  },
  {
    id: "EMP003",
    name: "Arun N",
    domain: "Design",
    joiningDate: "08 Sep 2026",
    status: "Probation",
    avatar: "A",
  },
  {
    id: "EMP004",
    name: "Sneha R",
    domain: "HR",
    joiningDate: "05 Sep 2026",
    status: "Active",
    avatar: "S",
  },
  {
    id: "EMP005",
    name: "Karthik M",
    domain: "Finance",
    joiningDate: "01 Sep 2026",
    status: "Active",
    avatar: "K",
  },
];

const recentRecords = [
  {
    id: "EMP012",
    title: "Employee Joined",
    description: "New employee added",
    time: "Today",
    icon: UserPlus,
    className: "record-green",
  },
  {
    id: "EMP018",
    title: "Profile Updated",
    description: "Employee details updated",
    time: "Today",
    icon: FileEdit,
    className: "record-blue",
  },
  {
    id: "EMP021",
    title: "Probation Updated",
    description: "Probation status changed",
    time: "Yesterday",
    icon: ShieldCheck,
    className: "record-orange",
  },
  {
    id: "EMP025",
    title: "Document Added",
    description: "Employee document uploaded",
    time: "Yesterday",
    icon: FileText,
    className: "record-purple",
  },
  {
    id: "EMP027",
    title: "Domain Changed",
    description: "Employee domain updated",
    time: "2 days ago",
    icon: Layers3,
    className: "record-teal",
  },
];

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
function StatCard({
  icon: Icon,
  title,
  value,
  change,
  subtitle,
  type,
  down,
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

        <span className="stat-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${
        status === "Probation" ? "probation-badge" : "active-badge"
      }`}
    >
      {status}
    </span>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [period, setPeriod] = useState("This Month");

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };
  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
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
      (item.path === "/dashboard" &&
        location.pathname === "/");

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

          <p>
            Manage your team efficiently with Hirenest.
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="search-box">
  <Search size={19} />

  <input
    type="text"
    placeholder="Search employees, domains, documents..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

  {searchText && (
    <button
      className="clear-search"
      onClick={() => setSearchText("")}
    >
      <X size={14} />
    </button>
  )}

          </div>

          <div className="topbar-right">
            

            <div className="profile-wrapper">
  <button
    className="profile-menu"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    <div className="topbar-profile">
  <div className="profile-avatar">
    {(
      localStorage.getItem("hirenestEmail") ||
      sessionStorage.getItem("hirenestEmail") ||
      "U"
    )
      .charAt(0)
      .toUpperCase()}
  </div>

  <div>
    <strong>
      {localStorage.getItem("hirenestEmail") ||
        sessionStorage.getItem("hirenestEmail") ||
        "User"}
    </strong>

    <span>
      {localStorage.getItem("hirenestRole") ||
        sessionStorage.getItem("hirenestRole") ||
        "User"}
    </span>
  </div>
</div>

    <ChevronDown size={17} />
  </button>

  {showProfileMenu && (
    <div className="profile-dropdown">
      <button onClick={() => navigate("/profile")}>
        <UserRound size={15} />
        My Profile
      </button>

      <button onClick={() => navigate("/settings")}>
        <Settings size={15} />
        Settings
      </button>

      <div className="dropdown-divider"></div>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        <LogOut size={15} />
        Logout
      </button>
    </div>
  )}
</div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="dashboard-content">
          {/* WELCOME */}
          <section className="welcome-section">
            <div>
              <p className="welcome-small">Good morning,</p>

              <h1>
                Gomathi <span>👋</span>
              </h1>

              <p className="welcome-description">
                Here's what's happening with your employees today.
              </p>
            </div>

            <div className="date-card">
              <div className="date-icon">
                <CalendarDays size={22} />
              </div>

              <div>
                <strong>Thursday, 01 Oct 2026</strong>
                <span>Have a productive day!</span>
              </div>
            </div>
          </section>

          {/* STAT CARDS */}
          <section className="stats-grid">
            <StatCard
              icon={Users}
              title="Total Employees"
              value="128"
              change="12%"
              subtitle="+14 from last month"
              type="green"
            />

            <StatCard
              icon={UserRound}
              title="Total Interns"
              value="16"
              change="8%"
              subtitle="+3 from last month"
              type="blue"
            />

            <StatCard
              icon={BriefcaseBusiness}
              title="Full-Time Employees"
              value="112"
              change="7%"
              subtitle="+8 from last month"
              type="orange"
            />

            <StatCard
              icon={Building2}
              title="Total Domains"
              value="8"
              change="0%"
              subtitle="No change"
              type="purple"
            />
          </section>

          {/* CHART SECTION */}
          <section className="charts-grid">
            {/* EMPLOYEES BY DOMAIN */}
            <div className="dashboard-card domain-card">
              <div className="card-header">
                <h2>Employees by Domain</h2>

                <select
  className="period-button"
  value={period}
  onChange={(e) => setPeriod(e.target.value)}
>
  <option>This Month</option>
  <option>This Week</option>
  <option>Last Month</option>
  <option>This Year</option>
</select>
              </div>

              <div className="domain-content">
                <div className="donut-wrapper">
                  <div className="donut-chart">
                    <div className="donut-center">
                      <strong>128</strong>
                      <span>Employees</span>
                    </div>
                  </div>
                </div>

                <div className="domain-list">
                  {domainData.map((domain) => (
                    <div className="domain-row" key={domain.name}>
                      <div className="domain-name">
                        <span
                          className={`domain-dot ${domain.className}`}
                        ></span>

                        <span>{domain.name}</span>
                      </div>

                      <strong>{domain.value}</strong>

                      <span className="domain-percentage">
                        {domain.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PROBATION */}
            <div className="dashboard-card probation-card">
              <div className="card-header">
                <h2>Probation Status</h2>

                <button className="period-button">
                  This Month
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="bar-chart">
                {probationData.map((item) => (
                  <div className="bar-column" key={item.label}>
                    <strong>{item.value}</strong>

                    <div className="bar-area">
                      <div
                        className={`bar ${item.className}`}
                        style={{
                          height: `${(item.value / 40) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TABLE SECTION */}
          <section className="tables-grid">
            {/* RECENT EMPLOYEES */}
            <div className="dashboard-card table-card">
              <div className="card-header">
                <h2>Recently Joined Employees</h2>

                <button
  className="view-all"
  onClick={() => navigate("/employees")}
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
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="employee-id">
                            <span className="employee-avatar">
                              {employee.avatar}
                            </span>

                            {employee.id}
                          </div>
                        </td>

                        <td>{employee.name}</td>

                        <td>{employee.domain}</td>

                        <td>{employee.joiningDate}</td>

                        <td>
                          <StatusBadge status={employee.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECENT RECORDS */}
            <div className="dashboard-card table-card records-card">
              <div className="card-header">
                <h2>Recent Records</h2>

                <button
  className="view-all"
  onClick={() => navigate("/reports")}
>
  View All
</button>
              </div>

              <div className="records-list">
                {recentRecords.map((record) => {
                  const Icon = record.icon;

                  return (
                    <div className="record-item" key={record.id}>
                      <div className={`record-icon ${record.className}`}>
                        <Icon size={16} />
                      </div>

                      <div className="record-info">
                        <strong>{record.title}</strong>
                        <span>
                          {record.id} · {record.description}
                        </span>
                      </div>

                      <span className="record-time">{record.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;