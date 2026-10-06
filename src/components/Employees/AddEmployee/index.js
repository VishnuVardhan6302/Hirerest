import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShieldCheck,
  Briefcase,
  Building2,
  Save,
  Loader2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import "./index.css";

/* =========================================================
   MOCK DOMAIN DATA
   ========================================================= */

const MOCK_DOMAINS = [
  { id: 1, name: "Data Science" },
  { id: 2, name: "Python Full Stack" },
  { id: 3, name: "Mern Stack" },
  { id: 4, name: "Data Analyst" },
  { id: 5, name: "UI/UX" },
  { id: 6, name: "DevOps" },
  { id: 7, name: "Testing" },
  { id: 8, name: "Java Full Stack" },
  { id: 9, name: "Data Analyst" },
];

/* =========================================================
   COMPONENT
   ========================================================= */

function AddEmployee() {
  const navigate = useNavigate();

  /* Mock domains */
  const domains = MOCK_DOMAINS;

  /* =======================================================
     FORM STATE
     ======================================================= */

  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    residentialAddress: "",
    permanentAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    domain: "",
    employmentType: "",
    joiningDate: "",
    status: "ACTIVE",
  });

  /* =======================================================
     UI STATE
     ======================================================= */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     HANDLE INPUT CHANGE
     ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =======================================================
     HANDLE SUBMIT
     ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* =====================================================
       VALIDATION
       ===================================================== */

    if (
      !formData.employeeId.trim() ||
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.joiningDate ||
      !formData.employmentType ||
      !formData.domain
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      /* ===================================================
         CREATE EMPLOYEE OBJECT
         =================================================== */

      const newEmployee = {
        id: Date.now(),

        employeeId: formData.employeeId.trim(),

        fullName: formData.fullName.trim(),

        email: formData.email.trim(),

        phone: formData.phone.trim(),

        dateOfBirth:
          formData.dateOfBirth || null,

        residentialAddress:
          formData.residentialAddress.trim(),

        permanentAddress:
          formData.permanentAddress.trim(),

        emergencyContactName:
          formData.emergencyContactName.trim(),

        emergencyContactPhone:
          formData.emergencyContactPhone.trim(),

        /* Backend-style field */
        domainName: formData.domain.trim(),

        employmentType:
          formData.employmentType,

        joiningDate:
          formData.joiningDate,

        status:
          formData.status,
      };

      console.log(
        "Creating MOCK employee:",
        newEmployee
      );

      /* ===================================================
         GET EXISTING MOCK EMPLOYEES
         =================================================== */

      const existingEmployees =
        JSON.parse(
          localStorage.getItem(
            "mockEmployees"
          )
        ) || [];

      /* ===================================================
         CHECK DUPLICATE EMPLOYEE ID
         =================================================== */

      const duplicateEmployeeId =
        existingEmployees.some(
          (employee) =>
            employee.employeeId.toLowerCase() ===
            newEmployee.employeeId.toLowerCase()
        );

      if (duplicateEmployeeId) {
        throw new Error(
          "Employee ID already exists."
        );
      }

      /* ===================================================
         CHECK DUPLICATE EMAIL
         =================================================== */

      const duplicateEmail =
        existingEmployees.some(
          (employee) =>
            employee.email.toLowerCase() ===
            newEmployee.email.toLowerCase()
        );

      if (duplicateEmail) {
        throw new Error(
          "Employee email already exists."
        );
      }

      /* ===================================================
         SAVE MOCK EMPLOYEE
         =================================================== */

      const updatedEmployees = [
        ...existingEmployees,
        newEmployee,
      ];

      localStorage.setItem(
        "mockEmployees",
        JSON.stringify(updatedEmployees)
      );

      console.log(
        "Mock employee saved successfully:",
        newEmployee
      );

      /* ===================================================
         SUCCESS MESSAGE
         =================================================== */

      setSuccess(
        "Employee added successfully."
      );

      /* ===================================================
         CLEAR FORM
         =================================================== */

      setFormData({
        employeeId: "",
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        residentialAddress: "",
        permanentAddress: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        domain: "",
        employmentType: "",
        joiningDate: "",
        status: "ACTIVE",
      });

      /* ===================================================
         REDIRECT
         =================================================== */

      setTimeout(() => {
        navigate("/employees");
      }, 1200);

    } catch (err) {
      console.error(
        "Create employee error:",
        err
      );

      setError(
        err.message ||
          "Unable to create employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="add-employee-page">

      <div className="page-glow page-glow-one" />
      <div className="page-glow page-glow-two" />

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="add-employee-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft size={17} />
          Back to Employees
        </button>

        <div className="page-heading">

          <div className="heading-icon">
            <UserPlus size={23} />
          </div>

          <div>

            <div className="eyebrow">
              <Sparkles size={13} />
              Employee Management
            </div>

            <h1>Add Employee</h1>

            <p>
              Create and register a new employee profile
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          MAIN CARD
          ================================================= */}

      <div className="add-employee-card">

        <div className="form-topbar">

          <div>

            <span className="topbar-label">
              Employee Profile
            </span>

            <span className="topbar-description">
              Complete the information below
            </span>

          </div>

          <div className="secure-badge">
            <ShieldCheck size={15} />
            Secure Form
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* =================================================
              EMPLOYEE INFORMATION
              ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <User size={18} />
              </div>

              <div>
                <h2>Employee Information</h2>

                <p>
                  Enter the employee's basic information.
                </p>
              </div>

            </div>

            <div className="form-grid">

              {/* Employee ID */}

              <div className="form-group">

                <label>
                  Employee ID <span>*</span>
                </label>

                <div className="input-wrapper">

                  <Briefcase size={17} />

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP001"
                    required
                  />

                </div>

              </div>

              {/* Full Name */}

              <div className="form-group">

                <label>
                  Full Name <span>*</span>
                </label>

                <div className="input-wrapper">

                  <User size={17} />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />

                </div>

              </div>

              {/* Email */}

              <div className="form-group">

                <label>
                  Email <span>*</span>
                </label>

                <div className="input-wrapper">

                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@example.com"
                    required
                  />

                </div>

              </div>

              {/* Phone */}

              <div className="form-group">

                <label>
                  Phone <span>*</span>
                </label>

                <div className="input-wrapper">

                  <Phone size={17} />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />

                </div>

              </div>

              {/* DOB */}

              <div className="form-group">

                <label>
                  Date of Birth
                </label>

                <div className="input-wrapper">

                  <Calendar size={17} />

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Joining Date */}

              <div className="form-group">

                <label>
                  Joining Date <span>*</span>
                </label>

                <div className="input-wrapper">

                  <Calendar size={17} />

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              EMPLOYMENT INFORMATION
              ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <Building2 size={18} />
              </div>

              <div>

                <h2>
                  Employment Information
                </h2>

                <p>
                  Configure the employee's role and employment details.
                </p>

              </div>

            </div>

            <div className="form-grid">

              {/* DOMAIN */}

              <div className="form-group">

                <label htmlFor="domain">
                  Domain <span className="required">*</span>
                </label>

                <div className="input-wrapper select-wrapper">

                  <Building2 size={17} />

                  <select
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Domain
                    </option>

                    {domains.map((domain) => (
                      <option
                        key={domain.id}
                        value={domain.name}
                      >
                        {domain.name}
                      </option>
                    ))}

                  </select>

                  <ChevronDown
                    className="select-arrow"
                    size={16}
                  />

                </div>

              </div>

              {/* EMPLOYMENT TYPE */}

              <div className="form-group">

                <label>
                  Employment Type <span>*</span>
                </label>

                <div className="input-wrapper select-wrapper">

                  <Briefcase size={17} />

                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select employment type
                    </option>

                    <option value="FULL_TIME">
                      Full Time
                    </option>

                    <option value="PART_TIME">
                      Part Time
                    </option>

                    <option value="INTERN">
                      Intern
                    </option>

                    <option value="CONTRACT">
                      Contract
                    </option>

                  </select>

                  <ChevronDown
                    className="select-arrow"
                    size={16}
                  />

                </div>

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <div className="input-wrapper select-wrapper">

                  <ShieldCheck size={17} />

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>

                 

                  </select>

                  <ChevronDown
                    className="select-arrow"
                    size={16}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              ADDRESS INFORMATION
              ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <div className="section-icon">
                <MapPin size={18} />
              </div>

              <div>

                <h2>
                  Address Information
                </h2>

                <p>
                  Enter residential and permanent address details.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group full-width">

                <label>
                  Residential Address
                </label>

                <textarea
                  name="residentialAddress"
                  value={formData.residentialAddress}
                  onChange={handleChange}
                  placeholder="Enter residential address"
                  rows="3"
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Permanent Address
                </label>

                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Enter permanent address"
                  rows="3"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              EMERGENCY CONTACT
              ================================================= */}

          <section className="form-section">

            <div className="section-title">

              <div className="section-icon emergency-icon">
                <Phone size={18} />
              </div>

              <div>

                <h2>
                  Emergency Contact
                </h2>

                <p>
                  Provide emergency contact information.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Contact Name
                </label>

                <div className="input-wrapper">

                  <User size={17} />

                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Emergency contact name"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Contact Phone
                </label>

                <div className="input-wrapper">

                  <Phone size={17} />

                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="Emergency contact phone"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              ERROR
              ================================================= */}

          {error && (
            <div className="form-message error-message">

              <AlertCircle size={17} />

              <span>
                {error}
              </span>

            </div>
          )}

          {/* =================================================
              SUCCESS
              ================================================= */}

          {success && (
            <div className="form-message success-message">

              <CheckCircle2 size={17} />

              <span>
                {success}
              </span>

            </div>
          )}

          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/employees")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <Loader2
                    className="spinner"
                    size={17}
                  />

                  Creating Employee...
                </>
              ) : (
                <>
                  <Save size={17} />

                  Add Employee
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEmployee;