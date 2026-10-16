
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

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

const API_BASE_URL = "http://localhost:8080";

function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEmployee = async () => {
      try {
        setLoading(true);
        setError("");
        setEmployee(null);

        // Preserve navigation from Former Employees.
        if (
          location.state?.fromFormerEmployees &&
          location.state?.employee
        ) {
          if (!cancelled) {
            setEmployee({
              ...location.state.employee,
              status: "FORMER",
            });
          }
          return;
        }

        const token =
          localStorage.getItem("hirenestToken") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("hirenestToken") ||
          sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/employees/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Your session has expired or you are not authorized. Please log in again."
          );
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load employee. Status: ${response.status}`
          );
        }

        const data = await response.json();

        // Support either a single employee object or an array.
        const foundEmployee = Array.isArray(data)
          ? data.find((item) => String(item.id) === String(id))
          : data;

        if (
          !foundEmployee ||
          String(foundEmployee.id) !== String(id)
        ) {
          throw new Error("Employee not found.");
        }

        if (!cancelled) {
          setEmployee(foundEmployee);
        }
      } catch (err) {
        console.error("Employee details error:", err);

        if (!cancelled) {
          setEmployee(null);
          setError(err.message || "Unable to load employee details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadEmployee();
    } else {
      setError("Employee ID is missing.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id, location.state]);

  const goBack = () => {
    navigate(
      location.state?.fromFormerEmployees
        ? "/former-employees"
        : "/employees"
    );
  };

  if (loading) {
    return (
      <div className="employee-details-page">
        <div className="details-loading">
          Loading employee details...
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="employee-details-page">
        <div className="employee-not-found">
          <AlertCircle size={42} />

          <h2>{error || "Employee Not Found"}</h2>

          <p>
            {error.includes("log in again")
              ? "Your session may have expired. Please log in to continue."
              : "The employee details could not be loaded."}
          </p>

          {error.includes("log in again") ? (
            <button onClick={() => navigate("/login")}>
              Go to Login
            </button>
          ) : (
            <button onClick={goBack}>
              <ArrowLeft size={17} />
              Back to Employees
            </button>
          )}
        </div>
      </div>
    );
  }

  const isFormer =
    String(employee.status || "").toUpperCase() === "FORMER" ||
    location.state?.fromFormerEmployees;

  const displayValue = (value) => value || "-";

  return (
    <div className="employee-details-page">
      {/* Header */}
      <div className="details-header">
        <button
          className="details-back-button"
          onClick={goBack}
        >
          <ArrowLeft size={17} />
          {isFormer
            ? "Back to Former Employees"
            : "Back to Employees"}
        </button>

        <div className="details-heading">
          <div className="details-avatar">
            {employee.fullName?.charAt(0)?.toUpperCase() || "E"}
          </div>

          <div>
            <span className="details-eyebrow">
              {isFormer
                ? "Former Employee Profile"
                : "Employee Profile"}
            </span>

            <h1>{employee.fullName || "Employee"}</h1>
            <p>{employee.employeeId || "-"}</p>
          </div>
        </div>

        {!isFormer && (
          <button
            className="edit-details-button"
            onClick={() =>
              navigate(`/employees/${employee.id}/edit`)
            }
          >
            <Pencil size={17} />
            Edit Employee
          </button>
        )}
      </div>

      {/* Profile Summary */}
      <div className="employee-summary-card">
        <div className="summary-item">
          <span className="summary-label">Employee ID</span>
          <strong>{displayValue(employee.employeeId)}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Domain</span>
          <strong>
            {displayValue(employee.domainName || employee.domain)}
          </strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Employment</span>
          <strong>{displayValue(employee.employmentType)}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Status</span>
          <span
            className={`details-status ${
              String(isFormer ? "former" : employee.status || "ACTIVE")
                .toLowerCase() === "active"
                ? "active"
                : "inactive"
            }`}
          >
            {isFormer ? "FORMER" : employee.status || "ACTIVE"}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="details-grid">
        {/* Personal Information */}
        <section className="details-card">
          <div className="details-card-heading">
            <div className="details-section-icon">
              <User size={19} />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Basic employee information</p>
            </div>
          </div>

          <div className="details-fields">
            <div className="detail-field">
              <span>
                <User size={16} />
                Full Name
              </span>
              <strong>{displayValue(employee.fullName)}</strong>
            </div>

            <div className="detail-field">
              <span>
                <Mail size={16} />
                Email
              </span>
              <strong>{displayValue(employee.email)}</strong>
            </div>

            <div className="detail-field">
              <span>
                <Phone size={16} />
                Phone
              </span>
              <strong>{displayValue(employee.phone)}</strong>
            </div>

            <div className="detail-field">
              <span>
                <Calendar size={16} />
                Date of Birth
              </span>
              <strong>{displayValue(employee.dateOfBirth)}</strong>
            </div>
          </div>
        </section>

        {/* Employment Information */}
        <section className="details-card">
          <div className="details-card-heading">
            <div className="details-section-icon">
              <Briefcase size={19} />
            </div>

            <div>
              <h2>Employment Information</h2>
              <p>Employee work details</p>
            </div>
          </div>

          <div className="details-fields">
            <div className="detail-field">
              <span>
                <Building2 size={16} />
                Domain
              </span>
              <strong>
                {displayValue(employee.domainName || employee.domain)}
              </strong>
            </div>

            <div className="detail-field">
              <span>
                <Briefcase size={16} />
                Employment Type
              </span>
              <strong>{displayValue(employee.employmentType)}</strong>
            </div>

            <div className="detail-field">
              <span>
                <Calendar size={16} />
                Joining Date
              </span>
              <strong>{displayValue(employee.joiningDate)}</strong>
            </div>

            <div className="detail-field">
              <span>
                <ShieldCheck size={16} />
                Status
              </span>
              <strong>
                {isFormer ? "FORMER" : employee.status || "ACTIVE"}
              </strong>
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="details-card full-details-card">
          <div className="details-card-heading">
            <div className="details-section-icon">
              <MapPin size={19} />
            </div>

            <div>
              <h2>Address Information</h2>
              <p>Residential and permanent address</p>
            </div>
          </div>

          <div className="address-details-grid">
            <div className="address-box">
              <span>Residential Address</span>
              <p>
                {displayValue(employee.residentialAddress)}
              </p>
            </div>

            <div className="address-box">
              <span>Permanent Address</span>
              <p>
                {displayValue(employee.permanentAddress)}
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="details-card full-details-card">
          <div className="details-card-heading">
            <div className="details-section-icon emergency-details-icon">
              <Phone size={19} />
            </div>

            <div>
              <h2>Emergency Contact</h2>
              <p>Emergency contact information</p>
            </div>
          </div>

          <div className="details-fields emergency-fields">
            <div className="detail-field">
              <span>
                <User size={16} />
                Contact Name
              </span>
              <strong>
                {displayValue(employee.emergencyContactName)}
              </strong>
            </div>

            <div className="detail-field">
              <span>
                <Phone size={16} />
                Contact Phone
              </span>
              <strong>
                {displayValue(employee.emergencyContactPhone)}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EmployeeDetails;
