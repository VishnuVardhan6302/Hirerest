import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building2,
  ShieldCheck,
  Pencil,
  AlertCircle,
} from "lucide-react";

import "./index.css";

function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD EMPLOYEE DETAILS
     ===================================================== */

  useEffect(() => {
    const loadEmployee = () => {
      try {
        setLoading(true);
        setError("");

        /* =================================================
           1. CHECK EMPLOYEE PASSED FROM FORMER EMPLOYEES
           ================================================= */

        if (
          location.state?.fromFormerEmployees &&
          location.state?.employee
        ) {
          setEmployee({
            ...location.state.employee,
            status: "FORMER",
          });

          setLoading(false);
          return;
        }

        /* =================================================
           2. LOAD CURRENT EMPLOYEES
           ================================================= */

        const currentEmployees =
          JSON.parse(
            localStorage.getItem(
              "mockEmployees"
            )
          ) || [];

        /* =================================================
           3. LOAD FORMER EMPLOYEES
           ================================================= */

        const formerEmployees =
          JSON.parse(
            localStorage.getItem(
              "mockFormerEmployees"
            )
          ) || [];

        /* =================================================
           4. SEARCH CURRENT EMPLOYEE
           ================================================= */

        let foundEmployee =
          currentEmployees.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        /* =================================================
           5. IF NOT FOUND, SEARCH FORMER EMPLOYEE
           ================================================= */

        if (!foundEmployee) {
          foundEmployee =
            formerEmployees.find(
              (item) =>
                String(item.id) ===
                String(id)
            );
        }

        /* =================================================
           6. EMPLOYEE NOT FOUND
           ================================================= */

        if (!foundEmployee) {
          setEmployee(null);
          setError(
            "Employee not found."
          );
          return;
        }

        /* =================================================
           7. CHECK WHETHER EMPLOYEE IS FORMER
           ================================================= */

        const isFormerEmployee =
          formerEmployees.some(
            (item) =>
              String(item.id) ===
              String(id)
          );

        /* =================================================
           8. SET FORMER STATUS
           ================================================= */

        if (isFormerEmployee) {
          foundEmployee = {
            ...foundEmployee,
            status: "FORMER",
          };
        }

        /* =================================================
           9. SET EMPLOYEE
           ================================================= */

        setEmployee(foundEmployee);

      } catch (error) {
        console.error(
          "Employee details error:",
          error
        );

        setEmployee(null);
        setError(
          "Unable to load employee details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id, location.state]);

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="employee-details-page">
        <div className="details-loading">
          Loading employee details...
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR / NOT FOUND
     ===================================================== */

  if (!employee) {
    return (
      <div className="employee-details-page">

        <div className="employee-not-found">

          <AlertCircle size={42} />

          <h2>
            {error || "Employee Not Found"}
          </h2>

          <p>
            The employee you're looking for
            does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/employees")
            }
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     MAIN UI
     ===================================================== */

  return (
    <div className="employee-details-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="details-header">

        <button
          className="details-back-button"
          onClick={() =>
            navigate(
              location.state?.fromFormerEmployees
                ? "/former-employees"
                : "/employees"
            )
          }
        >
          <ArrowLeft size={17} />

          {location.state?.fromFormerEmployees
            ? "Back to Former Employees"
            : "Back to Employees"}
        </button>

        <div className="details-heading">

          <div className="details-avatar">
            {employee.fullName
              ?.charAt(0)
              ?.toUpperCase() || "E"}
          </div>

          <div>

            <span className="details-eyebrow">
              {employee.status === "FORMER"
                ? "Former Employee Profile"
                : "Employee Profile"}
            </span>

            <h1>
              {employee.fullName}
            </h1>

            <p>
              {employee.employeeId}
            </p>

          </div>

        </div>

        {/* Don't show edit for former employees */}

        {employee.status !== "FORMER" && (
          <button
            className="edit-details-button"
            onClick={() =>
              navigate(
                `/employees/${employee.id}/edit`
              )
            }
          >
            <Pencil size={17} />
            Edit Employee
          </button>
        )}

      </div>

      {/* =================================================
          PROFILE SUMMARY
          ================================================= */}

      <div className="employee-summary-card">

        <div className="summary-item">

          <span className="summary-label">
            Employee ID
          </span>

          <strong>
            {employee.employeeId || "-"}
          </strong>

        </div>

        <div className="summary-item">

          <span className="summary-label">
            Domain
          </span>

          <strong>
            {employee.domainName ||
              employee.domain ||
              "-"}
          </strong>

        </div>

        <div className="summary-item">

          <span className="summary-label">
            Employment
          </span>

          <strong>
            {employee.employmentType ||
              "-"}
          </strong>

        </div>

        <div className="summary-item">

          <span className="summary-label">
            Status
          </span>

          <span
            className={`details-status ${
              employee.status
                ?.toLowerCase() ===
              "active"
                ? "active"
                : "inactive"
            }`}
          >
            {employee.status || "ACTIVE"}
          </span>

        </div>

      </div>

      {/* =================================================
          MAIN GRID
          ================================================= */}

      <div className="details-grid">

        {/* =================================================
            PERSONAL INFORMATION
            ================================================= */}

        <section className="details-card">

          <div className="details-card-heading">

            <div className="details-section-icon">
              <User size={19} />
            </div>

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Basic employee information
              </p>

            </div>

          </div>

          <div className="details-fields">

            <div className="detail-field">

              <span>
                <User size={16} />
                Full Name
              </span>

              <strong>
                {employee.fullName || "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <Mail size={16} />
                Email
              </span>

              <strong>
                {employee.email || "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <Phone size={16} />
                Phone
              </span>

              <strong>
                {employee.phone || "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <Calendar size={16} />
                Date of Birth
              </span>

              <strong>
                {employee.dateOfBirth || "-"}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            EMPLOYMENT INFORMATION
            ================================================= */}

        <section className="details-card">

          <div className="details-card-heading">

            <div className="details-section-icon">
              <Briefcase size={19} />
            </div>

            <div>

              <h2>
                Employment Information
              </h2>

              <p>
                Employee work details
              </p>

            </div>

          </div>

          <div className="details-fields">

            <div className="detail-field">

              <span>
                <Building2 size={16} />
                Domain
              </span>

              <strong>
                {employee.domainName ||
                  employee.domain ||
                  "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <Briefcase size={16} />
                Employment Type
              </span>

              <strong>
                {employee.employmentType ||
                  "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <Calendar size={16} />
                Joining Date
              </span>

              <strong>
                {employee.joiningDate ||
                  "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <ShieldCheck size={16} />
                Status
              </span>

              <strong>
                {employee.status ||
                  "ACTIVE"}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            ADDRESS
            ================================================= */}

        <section className="details-card full-details-card">

          <div className="details-card-heading">

            <div className="details-section-icon">
              <MapPin size={19} />
            </div>

            <div>

              <h2>
                Address Information
              </h2>

              <p>
                Residential and permanent address
              </p>

            </div>

          </div>

          <div className="address-details-grid">

            <div className="address-box">

              <span>
                Residential Address
              </span>

              <p>
                {employee.residentialAddress ||
                  "Not provided"}
              </p>

            </div>

            <div className="address-box">

              <span>
                Permanent Address
              </span>

              <p>
                {employee.permanentAddress ||
                  "Not provided"}
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            EMERGENCY CONTACT
            ================================================= */}

        <section className="details-card full-details-card">

          <div className="details-card-heading">

            <div className="details-section-icon emergency-details-icon">
              <Phone size={19} />
            </div>

            <div>

              <h2>
                Emergency Contact
              </h2>

              <p>
                Emergency contact information
              </p>

            </div>

          </div>

          <div className="details-fields emergency-fields">

            <div className="detail-field">

              <span>
                <User size={16} />
                Contact Name
              </span>

              <strong>
                {employee.emergencyContactName ||
                  "-"}
              </strong>

            </div>

            <div className="detail-field">

              <span>
                <Phone size={16} />
                Contact Phone
              </span>

              <strong>
                {employee.emergencyContactPhone ||
                  "-"}
              </strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default EmployeeDetails;