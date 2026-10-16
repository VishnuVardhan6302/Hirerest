import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import "../Dashboard/index.css";
import "./index.css";

export default function Layout() {
  return (
    <div className="shared-layout">
      <Sidebar />

      <main className="shared-layout-content">
        <Outlet />
      </main>
    </div>
  );
}