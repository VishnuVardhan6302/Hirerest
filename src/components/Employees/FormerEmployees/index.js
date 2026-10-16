import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  UserRound,
  Users,
 
} from "lucide-react";
import "./index.css";

const API_BASE_URL = "http://localhost:8080";

function FormerEmployees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  // Get JWT token
  const getToken = () =>
    localStorage.getItem("hirenestToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("token");

  // Load former employees from backend
  const loadFormerEmployees = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.error("Token not found. Please log in again.");
        setEmployees([]);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employees/former`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load former employees: ${response.status}`
        );
      }

      const data = await response.json();

      const formerEmployees = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.content)
        ? data.content
        : [];

      setEmployees(formerEmployees);
    } catch (error) {
      console.error("Former employee error:", error);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadFormerEmployees();
  }, []);

  // Search former employees
  const filteredEmployees = employees.filter((employee) => {
    const text = search.toLowerCase().trim();

    if (!text) return true;

    return (
      employee.employeeId?.toLowerCase().includes(text) ||
      employee.fullName?.toLowerCase().includes(text) ||
      employee.email?.toLowerCase().includes(text) ||
      employee.domainName?.toLowerCase().includes(text) ||
      employee.domain?.toLowerCase().includes(text) ||
      employee.phone?.toLowerCase().includes(text)
    );
  });

  // View former employee
  const handleView = (employee) => {
    navigate(`/employees/${employee.id}`, {
      state: {
        employee: {
          ...employee,
          status: "FORMER",
        },
        fromFormerEmployees: true,
      },
    });
  };

  // Permanently delete employee from backend
  const handlePermanentDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently remove this employee?"
    );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employees/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Failed to delete employee: ${response.status}`
        );
      }

      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (employee) => String(employee.id) !== String(id)
        )
      );

      window.alert("Employee permanently deleted.");
    } catch (error) {
      console.error("Permanent delete error:", error);
      window.alert(error.message || "Unable to delete employee.");
    }
  };

  return (
    <div className="former-employees-page">
      {/* HEADER */}
      <div className="former-header">
        <button
          className="former-back-button"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft size={17} />
          Back to Employees
        </button>

        <div className="former-title">
          <div className="former-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Employee Management</span>

            <h1>Former Employees</h1>

            <p>View employees who are no longer active</p>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="former-card">
        {/* CARD HEADER */}
        <div className="former-card-header">
          <div>
            <h2>Former Employee List</h2>

            <p>
              {filteredEmployees.length} former employees
            </p>
          </div>

          <div className="former-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search former employees..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="former-table-wrapper">
          <table className="former-table">
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
                    {/* EMPLOYEE ID */}
                    <td>
                      <span className="former-id">
                        {employee.employeeId || "-"}
                      </span>
                    </td>

                    {/* EMPLOYEE */}
                    <td>
                      <div className="former-person">
                        <div className="former-avatar">
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

                    {/* EMAIL */}
                    <td>{employee.email || "-"}</td>

                    {/* DOMAIN */}
                    <td>
                      {employee.domainName ||
                        employee.domain ||
                        "-"}
                    </td>

                    {/* EMPLOYMENT TYPE */}
                    <td>{employee.employmentType || "-"}</td>

                    {/* JOINING DATE */}
                    <td>{employee.joiningDate || "-"}</td>

                    {/* STATUS */}
                    <td>
                      <span className="former-status">
                        Former
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="former-actions">
                        {/* VIEW */}
                        <button
                          type="button"
                          className="former-view"
                          title="View Employee"
                          onClick={() => handleView(employee)}
                        >
                          <Eye size={16} />
                        </button>

                       
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="no-former-employees"
                  >
                    <UserRound size={35} />

                    <strong>No Former Employees</strong>

                    <span>
                      Employees moved from the current list
                      will appear here.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FormerEmployees;