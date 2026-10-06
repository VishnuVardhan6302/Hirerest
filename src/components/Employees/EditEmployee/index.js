import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Save,
  Loader2,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import "./index.css";

const MOCK_DOMAINS = [
  { id: 1, name: "Java" },
  { id: 2, name: "Python" },
  { id: 3, name: "React JS" },
  { id: 4, name: "Spring Boot" },
  { id: 5, name: "Data Engineering" },
  { id: 6, name: "DevOps" },
  { id: 7, name: "Testing" },
  { id: 8, name: "UI/UX" },
];

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD EMPLOYEE
     ===================================================== */

  useEffect(() => {
    try {
      const employees =
        JSON.parse(
          localStorage.getItem("mockEmployees")
        ) || [];

      const employee = employees.find(
        (item) => String(item.id) === String(id)
      );

      if (!employee) {
        setError("Employee not found.");
        return;
      }

      setFormData({
        employeeId: employee.employeeId || "",
        fullName: employee.fullName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        dateOfBirth: employee.dateOfBirth || "",
        residentialAddress:
          employee.residentialAddress || "",
        permanentAddress:
          employee.permanentAddress || "",
        emergencyContactName:
          employee.emergencyContactName || "",
        emergencyContactPhone:
          employee.emergencyContactPhone || "",
        domain:
          employee.domainName ||
          employee.domain ||
          "",
        employmentType:
          employee.employmentType || "",
        joiningDate:
          employee.joiningDate || "",
        status:
          employee.status || "ACTIVE",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load employee.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* =====================================================
     HANDLE CHANGE
     ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     SAVE CHANGES
     ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.employeeId.trim() ||
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.domain ||
      !formData.employmentType ||
      !formData.joiningDate
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setSaving(true);

      const employees =
        JSON.parse(
          localStorage.getItem("mockEmployees")
        ) || [];

      const updatedEmployees = employees.map(
        (employee) => {
          if (
            String(employee.id) !==
            String(id)
          ) {
            return employee;
          }

          return {
            ...employee,
            employeeId:
              formData.employeeId.trim(),
            fullName:
              formData.fullName.trim(),
            email:
              formData.email.trim(),
            phone:
              formData.phone.trim(),
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
            domainName:
              formData.domain.trim(),
            employmentType:
              formData.employmentType,
            joiningDate:
              formData.joiningDate,
            status:
              formData.status,
          };
        }
      );

      localStorage.setItem(
        "mockEmployees",
        JSON.stringify(updatedEmployees)
      );

      setSuccess(
        "Employee updated successfully."
      );

      setTimeout(() => {
        navigate("/employees");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="edit-employee-page">
        <div className="edit-loading">
          Loading employee...
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="edit-employee-page">

      {/* HEADER */}

      <div className="edit-header">

        <button
          className="edit-back-button"
          onClick={() =>
            navigate(
              `/employees/${id}`
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Employee
        </button>

        <div>
          <span className="edit-eyebrow">
            Employee Management
          </span>

          <h1>
            Edit Employee
          </h1>

          <p>
            Update employee information
          </p>
        </div>

      </div>

      {/* CARD */}

      <div className="edit-card">

        <div className="edit-card-top">

          <div className="edit-title-icon">
            <User size={20} />
          </div>

          <div>
            <h2>
              Employee Profile
            </h2>

            <p>
              Update the employee information below.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* PERSONAL */}

          <section className="edit-section">

            <div className="edit-section-heading">

              <User size={18} />

              <div>
                <h3>
                  Personal Information
                </h3>

                <p>
                  Basic employee details
                </p>
              </div>

            </div>

            <div className="edit-grid">

              <div className="edit-field">
                <label>
                  Employee ID *
                </label>

                <div className="edit-input">
                  <Briefcase size={16} />

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-field">
                <label>
                  Full Name *
                </label>

                <div className="edit-input">
                  <User size={16} />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-field">
                <label>
                  Email *
                </label>

                <div className="edit-input">
                  <Mail size={16} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-field">
                <label>
                  Phone *
                </label>

                <div className="edit-input">
                  <Phone size={16} />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-field">
                <label>
                  Date of Birth
                </label>

                <div className="edit-input">
                  <Calendar size={16} />

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-field">
                <label>
                  Joining Date *
                </label>

                <div className="edit-input">
                  <Calendar size={16} />

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* EMPLOYMENT */}

          <section className="edit-section">

            <div className="edit-section-heading">

              <Building2 size={18} />

              <div>
                <h3>
                  Employment Information
                </h3>

                <p>
                  Work and employment details
                </p>
              </div>

            </div>

            <div className="edit-grid">

              <div className="edit-field">

                <label>
                  Domain *
                </label>

                <div className="edit-input">

                  <Building2 size={16} />

                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Domain
                    </option>

                    {MOCK_DOMAINS.map(
                      (domain) => (
                        <option
                          key={domain.id}
                          value={domain.name}
                        >
                          {domain.name}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown size={16} />

                </div>

              </div>

              <div className="edit-field">

                <label>
                  Employment Type *
                </label>

                <div className="edit-input">

                  <Briefcase size={16} />

                  <select
                    name="employmentType"
                    value={
                      formData.employmentType
                    }
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Employment Type
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

                  <ChevronDown size={16} />

                </div>

              </div>

              <div className="edit-field">

                <label>
                  Status
                </label>

                <div className="edit-input">

                  <ShieldCheck size={16} />

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

                    <option value="FORMER">
                      Former
                    </option>

                  </select>

                  <ChevronDown size={16} />

                </div>

              </div>

            </div>
          </section>

          {/* ADDRESS */}

          <section className="edit-section">

            <div className="edit-section-heading">

              <MapPin size={18} />

              <div>
                <h3>
                  Address Information
                </h3>

                <p>
                  Address details
                </p>
              </div>

            </div>

            <div className="edit-grid">

              <div className="edit-field full-edit-field">

                <label>
                  Residential Address
                </label>

                <textarea
                  name="residentialAddress"
                  value={
                    formData.residentialAddress
                  }
                  onChange={handleChange}
                  rows="3"
                />

              </div>

              <div className="edit-field full-edit-field">

                <label>
                  Permanent Address
                </label>

                <textarea
                  name="permanentAddress"
                  value={
                    formData.permanentAddress
                  }
                  onChange={handleChange}
                  rows="3"
                />

              </div>

            </div>
          </section>

          {/* EMERGENCY */}

          <section className="edit-section">

            <div className="edit-section-heading">

              <Phone size={18} />

              <div>
                <h3>
                  Emergency Contact
                </h3>

                <p>
                  Emergency contact information
                </p>
              </div>

            </div>

            <div className="edit-grid">

              <div className="edit-field">

                <label>
                  Contact Name
                </label>

                <div className="edit-input">

                  <User size={16} />

                  <input
                    type="text"
                    name="emergencyContactName"
                    value={
                      formData.emergencyContactName
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="edit-field">

                <label>
                  Contact Phone
                </label>

                <div className="edit-input">

                  <Phone size={16} />

                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={
                      formData.emergencyContactPhone
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>
          </section>

          {/* MESSAGES */}

          {error && (
            <div className="edit-message edit-error">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          {success && (
            <div className="edit-message edit-success">
              <CheckCircle2 size={17} />
              {success}
            </div>
          )}

          {/* BUTTONS */}

          <div className="edit-actions">

            <button
              type="button"
              className="edit-cancel"
              onClick={() =>
                navigate("/employees")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save"
              disabled={saving}
            >

              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="edit-spinner"
                  />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditEmployee;