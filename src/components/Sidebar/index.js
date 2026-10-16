import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Layers3,
  Clock3,
  FileText,
  BarChart3,
  UserCircle,
  Settings,
  Wallet,
} from "lucide-react";
import "./index.css";

const navigationItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Employees", icon: Users, path: "/employees" },
  {
    label: "Employee Finance",
    icon: Wallet,
    path: "/employee-finance",
  },
  { label: "Domains", icon: Layers3, path: "/domains" },
  { label: "Probation", icon: Clock3, path: "/probation" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Users", icon: UserCircle, path: "/users" },
  { label: "Profile", icon: UserCircle, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar shared-sidebar">
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
              location.pathname.startsWith("/employees/")) ||
            (item.path === "/employee-finance" &&
              location.pathname.startsWith("/employee-finance/"));

          return (
            <button
              type="button"
              key={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom-card">
        <div className="plant-decoration">
          <span />
          <span />
          <span />
        </div>
        <h3>Build a Better Workplace</h3>
        <p>Manage your team efficiently with Hirenest.</p>
      </div>
    </aside>
  );
}