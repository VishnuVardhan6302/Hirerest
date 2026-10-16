import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Plus,
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import "./index.css";

const API_BASE_URL = "http://localhost:8080";

function EmployeeList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("hirenestToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("token");

  // Fetch employees from the backend
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setEmployees([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        setEmployees([]);
        return;
      }

      if (response.status === 403) {
        setError("You are not authorized to access Employees.");
        setEmployees([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Employee API failed: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Employee List API Error:", err);
      setError("Unable to load employees from the server.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, location.pathname]);

  // Search employees
  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      employee.employeeId?.toLowerCase().includes(searchText) ||
      employee.fullName?.toLowerCase().includes(searchText) ||
      employee.email?.toLowerCase().includes(searchText) ||
      employee.phone?.toLowerCase().includes(searchText) ||
      employee.domainName?.toLowerCase().includes(searchText) ||
      employee.domain?.toLowerCase().includes(searchText)
    );
  });

  // Move an employee to Former Employees instead of permanently deleting
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to move this employee to Former Employees?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const getResponse = await fetch(
        `${API_BASE_URL}/api/employees/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error(
          `Failed to fetch employee details: ${getResponse.status}`
        );
      }

      const data = await getResponse.json();

      const employee = Array.isArray(data)
        ? data.find((item) => String(item.id) === String(id))
        : data;

      if (!employee || String(employee.id) !== String(id)) {
        throw new Error("Employee not found.");
      }

      const updatePayload = {
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        dateOfBirth: employee.dateOfBirth || null,
        residentialAddress: employee.residentialAddress || "",
        permanentAddress: employee.permanentAddress || "",
        emergencyContactName: employee.emergencyContactName || "",
        emergencyContactPhone: employee.emergencyContactPhone || "",
        domainName: employee.domainName || employee.domain || "",
        employmentType: employee.employmentType,
        joiningDate: employee.joiningDate || null,
        status: "FORMER",
      };

      const updateResponse = await fetch(
        `${API_BASE_URL}/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!updateResponse.ok) {
        const message = await updateResponse.text();

        throw new Error(
          message || `Failed to update employee: ${updateResponse.status}`
        );
      }

      await fetchEmployees();
      window.alert("Employee moved to Former Employees successfully.");
    } catch (err) {
      console.error("Move employee error:", err);
      setError(err.message || "Unable to move employee.");
    }
  };

  return (
    <div className="employee-page-content">
      <section className="employee-content">
        {/* Back navigation */}
        <button
          type="button"
          className="back-dashboard"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Page heading and actions */}
        <div className="employee-page-heading">
          <div>
            <h1>Employees</h1>
            <p>Manage and view all current employees</p>
          </div>

          <div className="employee-page-actions">
            <button
              type="button"
              className="secondary-action intern-action"
              onClick={() => navigate("/employees/interns")}
            >
              <Users size={16} />
              Interns
            </button>

            <button
              type="button"
              className="secondary-action former-action"
              onClick={() => navigate("/former-employees")}
            >
              Former Employees
            </button>

            <button
              type="button"
              className="primary-action"
              onClick={() => navigate("/employees/add")}
            >
              <Plus size={17} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee list card */}
        <div className="employee-card">
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
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="employee-error" role="alert">
              {error}
              <button type="button" onClick={fetchEmployees}>
                Retry
              </button>
            </div>
          )}

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
                              <span>{employee.phone || "-"}</span>
                            </div>
                          </div>
                        </td>

                        <td>{employee.email || "-"}</td>

                        <td>
                          {employee.domainName || employee.domain || "-"}
                        </td>

                        <td>{employee.employmentType || "-"}</td>

                        <td>{employee.joiningDate || "-"}</td>

                        <td>
                          <span
                            className={`status-pill ${
                              employee.status?.toLowerCase() === "active"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <span className="status-dot" />
                            {employee.status || "Active"}
                          </span>
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              className="row-action view"
                              title="View"
                              aria-label={`View ${employee.fullName}`}
                              onClick={() =>
                                navigate(`/employees/${employee.id}`)
                              }
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="row-action edit"
                              title="Edit"
                              aria-label={`Edit ${employee.fullName}`}
                              onClick={() =>
                                navigate(`/employees/${employee.id}/edit`)
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="row-action delete"
                              title="Move to Former Employees"
                              aria-label={`Move ${employee.fullName} to Former Employees`}
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-employees">
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
    </div>
  );
}

export default EmployeeList;