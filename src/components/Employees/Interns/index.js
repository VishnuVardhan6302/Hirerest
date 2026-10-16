import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import "./index.css";

const API_BASE_URL = "http://localhost:8080";

const Interns = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get authentication token
  const getToken = () =>
    localStorage.getItem("hirenestToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("token");

  // Load interns from backend
  const loadInterns = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setInterns([]);
        setError("Please log in again to view interns.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employees/interns`,
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
          `Failed to load interns. Status: ${response.status}`
        );
      }

      const data = await response.json();

      const employees = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.content)
        ? data.content
        : [];

      const internEmployees = employees.filter(
        (employee) =>
          String(employee.employmentType || "").toUpperCase() ===
            "INTERN" &&
          String(employee.status || "ACTIVE").toUpperCase() !==
            "FORMER"
      );

      setInterns(internEmployees);
    } catch (err) {
      console.error("Error loading interns:", err);
      setError(err.message || "Unable to load interns.");
      setInterns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterns();
  }, [loadInterns, location.pathname]);

  // Search interns
  const filteredInterns = interns.filter((employee) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

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

  // View intern
  const handleView = (employee) => {
    navigate(`/employees/${employee.id}`, {
      state: {
        employee,
        fromInterns: true,
      },
    });
  };

  // Edit intern
  const handleEdit = (employee) => {
    navigate(`/employees/${employee.id}/edit`);
  };

  // Move intern to Former Employees
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to move this intern to Former Employees?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }

      // Fetch current employee details
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
          `Failed to fetch intern details: ${getResponse.status}`
        );
      }

      const data = await getResponse.json();

      const employee = Array.isArray(data)
        ? data.find((item) => String(item.id) === String(id))
        : data;

      if (!employee || String(employee.id) !== String(id)) {
        throw new Error("Intern not found.");
      }

      // Preserve existing employee details
      const updatePayload = {
        employeeId: employee.employeeId || "",
        fullName: employee.fullName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        dateOfBirth: employee.dateOfBirth || null,
        residentialAddress: employee.residentialAddress || "",
        permanentAddress: employee.permanentAddress || "",
        emergencyContactName: employee.emergencyContactName || "",
        emergencyContactPhone: employee.emergencyContactPhone || "",
        domainName: employee.domainName || employee.domain || "",
        employmentType: employee.employmentType || "INTERN",
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
          message || `Failed to update intern: ${updateResponse.status}`
        );
      }

      setInterns((currentInterns) =>
        currentInterns.filter(
          (item) => String(item.id) !== String(id)
        )
      );

      window.alert("Intern moved to Former Employees successfully.");
    } catch (err) {
      console.error("Move intern error:", err);
      window.alert(err.message || "Unable to move intern.");
    }
  };

  return (
    <div className="interns-page-content">
      <main className="interns-content">
        {/* Back navigation */}
        <button
          type="button"
          className="back-dashboard"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft size={17} />
          Back to Employees
        </button>

        {/* Page heading and actions */}
        <div className="page-heading">
          <div>
            <h1>Interns</h1>
            <p>Manage and view all current interns</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => navigate("/employees")}
            >
              <Users size={16} />
              All Employees
            </button>

            <button
              type="button"
              className="secondary-action"
              onClick={() => navigate("/former-employees")}
            >
              Former Employees
            </button>

            <button
              type="button"
              className="primary-action"
              onClick={() => navigate("/employees/add")}
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Intern table */}
        <section className="interns-card">
          <div className="card-header">
            <div>
              <h2>Intern List</h2>
              <p>
                {filteredInterns.length}{" "}
                {filteredInterns.length === 1 ? "intern" : "interns"}
              </p>
            </div>

            <div className="table-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search intern..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="interns-error" role="alert">
              <span>{error}</span>

              <button type="button" onClick={loadInterns}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="interns-loading">
              Loading interns...
            </div>
          ) : filteredInterns.length > 0 ? (
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
                            {(employee.fullName || "I")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {employee.fullName || "-"}
                            </strong>
                            <span>{employee.phone || "-"}</span>
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

                      <td>{employee.joiningDate || "-"}</td>

                      <td>
                        <span
                          className={`status-badge ${String(
                            employee.status || "ACTIVE"
                          ).toLowerCase()}`}
                        >
                          <span className="status-dot" />
                          {employee.status || "ACTIVE"}
                        </span>
                      </td>

                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="row-action view"
                            title="View Intern"
                            onClick={() => handleView(employee)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="row-action edit"
                            title="Edit Intern"
                            onClick={() => handleEdit(employee)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="row-action delete"
                            title="Move to Former Employees"
                            onClick={() => handleDelete(employee.id)}
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
            !error && (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={28} />
                </div>

                <h3>
                  {search ? "No interns found" : "No interns yet"}
                </h3>

                <p>
                  {search
                    ? "Try changing your search."
                    : "Employees added with employment type INTERN will appear here."}
                </p>

                {!search && (
                  <button
                    type="button"
                    className="primary-action empty-button"
                    onClick={() => navigate("/employees/add")}
                  >
                    <Plus size={16} />
                    Add Intern
                  </button>
                )}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
};

export default Interns;