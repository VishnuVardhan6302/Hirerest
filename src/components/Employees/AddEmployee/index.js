import React, { useEffect, useState } from "react";
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

const API_BASE_URL = "http://localhost:8080";

const INITIAL_FORM_DATA = {
  employeeId: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  residentialAddressLine1: "",
  residentialAddressLine2: "",
  residentialCity: "",
  residentialState: "",
  residentialPincode: "",
  permanentAddressLine1: "",
  permanentAddressLine2: "",
  permanentCity: "",
  permanentState: "",
  permanentPincode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  domain: "",
  employmentType: "",
  joiningDate: "",
  status: "ACTIVE",
};

function AddEmployee() {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [domainError, setDomainError] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sameAsResidential, setSameAsResidential] = useState(false);

  const getAuthToken = () =>
    localStorage.getItem("hirenestToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("token");

  // Fetch domains from the backend
  useEffect(() => {
    const fetchDomains = async () => {
      setDomainsLoading(true);
      setDomainError("");

      const token = getAuthToken();

      if (!token) {
        setDomainError("Please log in again to load domains.");
        setDomainsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/domains`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        if (response.status === 403) {
          throw new Error("You are not authorized to view domains.");
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load domains. Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from the domains API.");
        }

        const availableDomains = data.filter(
          (domain) =>
            domain &&
            domain.name &&
            (!domain.status ||
              String(domain.status).toUpperCase() === "ACTIVE")
        );

        setDomains(availableDomains);
      } catch (err) {
        console.error("Fetch domains error:", err);
        setDomainError(err.message || "Unable to load domains.");
      } finally {
        setDomainsLoading(false);
      }
    };

    fetchDomains();
  }, []);

  // Handle input changes and synchronize addresses when checked
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (sameAsResidential && name.startsWith("residential")) {
        const field = name.replace("residential", "");
        updated[`permanent${field}`] = value;
      }

      return updated;
    });

    setError("");
    setSuccess("");
  };

  // Copy residential address to permanent address
  const handleSameAsResidential = (e) => {
    const checked = e.target.checked;
    setSameAsResidential(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanentAddressLine1: prev.residentialAddressLine1,
        permanentAddressLine2: prev.residentialAddressLine2,
        permanentCity: prev.residentialCity,
        permanentState: prev.residentialState,
        permanentPincode: prev.residentialPincode,
      }));
    }
  };

  // Combine individual address fields into a single backend-compatible string
  const buildAddress = (line1, line2, city, state, pincode) =>
    [line1, line2, city, state, pincode]
      .map((part) => String(part || "").trim())
      .filter(Boolean)
      .join(", ");

  // Submit employee details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

    if (domainsLoading || domains.length === 0) {
      setError("No available domains. Please check the Domain API.");
      return;
    }

    try {
      setLoading(true);

      const token = getAuthToken();

      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const employeeData = {
        employeeId: formData.employeeId.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth || null,
        residentialAddress: buildAddress(
          formData.residentialAddressLine1,
          formData.residentialAddressLine2,
          formData.residentialCity,
          formData.residentialState,
          formData.residentialPincode
        ),
        permanentAddress: buildAddress(
          formData.permanentAddressLine1,
          formData.permanentAddressLine2,
          formData.permanentCity,
          formData.permanentState,
          formData.permanentPincode
        ),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        domainName: formData.domain,
        employmentType: formData.employmentType,
        joiningDate: formData.joiningDate,
        status: formData.status,
      };

      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      const responseText = await response.text();

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }

      if (response.status === 403) {
        setError("You are not authorized to add employees.");
        return;
      }

      if (!response.ok) {
        let errorMessage = "Unable to create employee.";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.message || errorData.error || errorMessage;
        } catch {
          if (responseText) errorMessage = responseText;
        }

        throw new Error(errorMessage);
      }

      setSuccess("Employee added successfully!");
      setFormData({ ...INITIAL_FORM_DATA });
      setSameAsResidential(false);

      setTimeout(() => {
        navigate("/employees");
      }, 1200);
    } catch (err) {
      console.error("Create employee error:", err);
      setError(
        err.message || "Unable to create employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAddressField = (
    id,
    label,
    placeholder,
    value,
    disabled = false,
    fullWidth = false
  ) => (
    <div className={`form-group${fullWidth ? " full-width" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        name={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={id.toLowerCase().includes("pincode") ? "numeric" : undefined}
        maxLength={id.toLowerCase().includes("pincode") ? 6 : undefined}
      />
    </div>
  );

  return (
    <div className="add-employee-page">
      <div className="page-glow page-glow-one" />
      <div className="page-glow page-glow-two" />

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
            <p>Create and register a new employee profile</p>
          </div>
        </div>
      </div>

      <div className="add-employee-card">
        <div className="form-topbar">
          <div>
            <span className="topbar-label">Employee Profile</span>
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
          {/* EMPLOYEE INFORMATION */}
          <section className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <User size={18} />
              </div>
              <div>
                <h2>Employee Information</h2>
                <p>Enter the employee's basic information.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeId">
                  Employee ID <span>*</span>
                </label>
                <div className="input-wrapper">
                  <Briefcase size={17} />
                  <input
                    id="employeeId"
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP001"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name <span>*</span>
                </label>
                <div className="input-wrapper">
                  <User size={17} />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span>*</span>
                </label>
                <div className="input-wrapper">
                  <Mail size={17} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone <span>*</span>
                </label>
                <div className="input-wrapper">
                  <Phone size={17} />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <div className="input-wrapper">
                  <Calendar size={17} />
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="joiningDate">
                  Joining Date <span>*</span>
                </label>
                <div className="input-wrapper">
                  <Calendar size={17} />
                  <input
                    id="joiningDate"
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

          {/* EMPLOYMENT INFORMATION */}
          <section className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <Building2 size={18} />
              </div>
              <div>
                <h2>Employment Information</h2>
                <p>Configure the employee's role and employment details.</p>
              </div>
            </div>

            <div className="form-grid">
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
                    disabled={domainsLoading || domains.length === 0}
                  >
                    <option value="">
                      {domainsLoading ? "Loading domains..." : "Select Domain"}
                    </option>

                    {!domainsLoading && domains.length === 0 && (
                      <option value="" disabled>
                        No domains available
                      </option>
                    )}

                    {domains.map((domain) => (
                      <option
                        key={domain.id ?? domain.name}
                        value={domain.name}
                      >
                        {domain.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>

                {domainError && (
                  <div className="form-message error-message" role="alert">
                    <AlertCircle size={17} />
                    <span>{domainError}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="employmentType">
                  Employment Type <span>*</span>
                </label>
                <div className="input-wrapper select-wrapper">
                  <Briefcase size={17} />
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select employment type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERN">Intern</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <div className="input-wrapper select-wrapper">
                  <ShieldCheck size={17} />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>
              </div>
            </div>
          </section>

          {/* ADDRESS INFORMATION */}
          <section className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <MapPin size={18} />
              </div>
              <div>
                <h2>Address Information</h2>
                <p>Enter residential and permanent address details.</p>
              </div>
            </div>

            {/* RESIDENTIAL ADDRESS */}
            <div className="address-block">
              <h3 className="address-subtitle">Residential Address</h3>

              <div className="form-grid">
                {renderAddressField(
                  "residentialAddressLine1",
                  "Address Line 1",
                  "House/flat number, street name",
                  formData.residentialAddressLine1,
                  false,
                  true
                )}

                {renderAddressField(
                  "residentialAddressLine2",
                  "Address Line 2 (Optional)",
                  "Area, landmark",
                  formData.residentialAddressLine2,
                  false,
                  true
                )}

                {renderAddressField(
                  "residentialCity",
                  "City",
                  "Enter city",
                  formData.residentialCity
                )}

                {renderAddressField(
                  "residentialState",
                  "State",
                  "Enter state",
                  formData.residentialState
                )}

                {renderAddressField(
                  "residentialPincode",
                  "PIN Code",
                  "6-digit PIN code",
                  formData.residentialPincode
                )}
              </div>
            </div>

            {/* PERMANENT ADDRESS */}
            <div className="address-block permanent-address-block">
              <h3 className="address-subtitle">Permanent Address</h3>

              <label className="same-address-option">
                <input
                  type="checkbox"
                  checked={sameAsResidential}
                  onChange={handleSameAsResidential}
                />
                <span>Same as Residential Address</span>
              </label>

              <div className="form-grid">
                {renderAddressField(
                  "permanentAddressLine1",
                  "Address Line 1",
                  "House/flat number, street name",
                  formData.permanentAddressLine1,
                  sameAsResidential,
                  true
                )}

                {renderAddressField(
                  "permanentAddressLine2",
                  "Address Line 2 (Optional)",
                  "Area, landmark",
                  formData.permanentAddressLine2,
                  sameAsResidential,
                  true
                )}

                {renderAddressField(
                  "permanentCity",
                  "City",
                  "Enter city",
                  formData.permanentCity,
                  sameAsResidential
                )}

                {renderAddressField(
                  "permanentState",
                  "State",
                  "Enter state",
                  formData.permanentState,
                  sameAsResidential
                )}

                {renderAddressField(
                  "permanentPincode",
                  "PIN Code",
                  "6-digit PIN code",
                  formData.permanentPincode,
                  sameAsResidential
                )}
              </div>
            </div>
          </section>

          {/* EMERGENCY CONTACT */}
          <section className="form-section">
            <div className="section-title">
              <div className="section-icon emergency-icon">
                <Phone size={18} />
              </div>
              <div>
                <h2>Emergency Contact</h2>
                <p>Provide emergency contact information.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emergencyContactName">Contact Name</label>
                <div className="input-wrapper">
                  <User size={17} />
                  <input
                    id="emergencyContactName"
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Emergency contact name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContactPhone">Contact Phone</label>
                <div className="input-wrapper">
                  <Phone size={17} />
                  <input
                    id="emergencyContactPhone"
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

          {/* ERROR MESSAGE */}
          {error && (
            <div className="form-message error-message" role="alert">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="form-message success-message" role="status">
              <CheckCircle2 size={17} />
              <span>{success}</span>
            </div>
          )}

          {/* ACTION BUTTONS */}
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
              disabled={loading || domainsLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" size={17} />
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