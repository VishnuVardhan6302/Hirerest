import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  UserRound,
  Users,
  Trash2,
} from "lucide-react";
import "./index.css";

function FormerEmployees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  /* =====================================================
     LOAD FORMER EMPLOYEES
     ===================================================== */

  const loadFormerEmployees = () => {
    try {
      const formerEmployees =
        JSON.parse(
          localStorage.getItem(
            "mockFormerEmployees"
          )
        ) || [];

      setEmployees(formerEmployees);
    } catch (error) {
      console.error(
        "Former employee error:",
        error
      );

      setEmployees([]);
    }
  };

  useEffect(() => {
    loadFormerEmployees();
  }, []);

  /* =====================================================
     SEARCH
     ===================================================== */

  const filteredEmployees =
    employees.filter((employee) => {
      const text =
        search.toLowerCase().trim();

      if (!text) {
        return true;
      }

      return (
        employee.employeeId
          ?.toLowerCase()
          .includes(text) ||

        employee.fullName
          ?.toLowerCase()
          .includes(text) ||

        employee.email
          ?.toLowerCase()
          .includes(text) ||

        employee.domainName
          ?.toLowerCase()
          .includes(text) ||

        employee.domain
          ?.toLowerCase()
          .includes(text) ||

        employee.phone
          ?.toLowerCase()
          .includes(text)
      );
    });

  /* =====================================================
     VIEW FORMER EMPLOYEE
     ===================================================== */

  const handleView = (employee) => {
    navigate(
      `/employees/${employee.id}`,
      {
        state: {
          employee: {
            ...employee,
            status: "FORMER",
          },
          fromFormerEmployees: true,
        },
      }
    );
  };

  /* =====================================================
     DELETE FROM FORMER EMPLOYEES
     ===================================================== */

  const handlePermanentDelete = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to permanently remove this employee?"
      );

    if (!confirmDelete) {
      return;
    }

    const updatedEmployees =
      employees.filter(
        (employee) =>
          employee.id !== id
      );

    localStorage.setItem(
      "mockFormerEmployees",
      JSON.stringify(updatedEmployees)
    );

    setEmployees(updatedEmployees);
  };

  return (
    <div className="former-employees-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="former-header">

        <button
          className="former-back-button"
          onClick={() =>
            navigate("/employees")
          }
        >
          <ArrowLeft size={17} />

          Back to Employees
        </button>

        <div className="former-title">

          <div className="former-icon">
            <Users size={22} />
          </div>

          <div>

            <span>
              Employee Management
            </span>

            <h1>
              Former Employees
            </h1>

            <p>
              View employees who are no longer active
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          MAIN CARD
          ================================================= */}

      <div className="former-card">

        {/* CARD HEADER */}

        <div className="former-card-header">

          <div>

            <h2>
              Former Employee List
            </h2>

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
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================================
            TABLE
            ================================================= */}

        <div className="former-table-wrapper">

          <table className="former-table">

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

              {filteredEmployees.length > 0 ? (

                filteredEmployees.map(
                  (employee) => (

                    <tr
                      key={employee.id}
                    >

                      {/* EMPLOYEE ID */}

                      <td>

                        <span className="former-id">
                          {employee.employeeId ||
                            "-"}
                        </span>

                      </td>

                      {/* EMPLOYEE */}

                      <td>

                        <div className="former-person">

                          <div className="former-avatar">
                            {employee.fullName
                              ?.charAt(0)
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
                            onClick={() =>
                              handleView(employee)
                            }
                          >
                            <Eye size={16} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="former-delete"
                            title="Delete Permanently"
                            onClick={() =>
                              handlePermanentDelete(
                                employee.id
                              )
                            }
                          >
                            <Trash2 size={16} />
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
                    className="no-former-employees"
                  >

                    <UserRound size={35} />

                    <strong>
                      No Former Employees
                    </strong>

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