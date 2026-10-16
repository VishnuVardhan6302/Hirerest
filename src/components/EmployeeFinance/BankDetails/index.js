
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Landmark,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  Users,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import "./index.css";

const API_URL = "http://localhost:8080/api/bank";

const emptyForm = {
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  status: "ACTIVE",
};


const getToken = () => {
  return (
    localStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("hirenestToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};


const getEmployeeName = (record) =>
  record?.employee?.fullName || record?.employee?.name || "—";

const getEmployeeId = (record) =>
  record?.employee?.employeeId || record?.employee?.id || "—";

const getDepartment = (record) =>
  record?.employee?.domain?.name || "—";

const maskAccount = (accountNumber) => {
  if (!accountNumber) return "—";
  return `•••• •••• ${String(accountNumber).slice(-4)}`;
};

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export default function BankDetails() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modal, setModal] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Send the JWT with each authenticated backend request.
  const getHeaders = () => {
    const token = getToken();

    if (!token) {
      throw new Error("Your login session was not found. Please log in again.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Read backend responses and show useful error messages.
  const apiRequest = async (url, options = {}) => {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const responseText = await response.text();
    let data = null;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired or token missing. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission for this action. Please check your role."
        );
      }

      const errorMessage =
        typeof data === "object" && data !== null
          ? data.message || data.error || data.detail
          : data;

      throw new Error(
        errorMessage || `Backend request failed (${response.status}).`
      );
    }

    return data;
  };

  // GET /api/bank
  const fetchBankDetails = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    setError("");

    try {
      const data = await apiRequest(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load bank details.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    // Load records when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const searchableValues = [
        getEmployeeName(record),
        getEmployeeId(record),
        getDepartment(record),
        record.bankName,
        record.accountHolderName,
        record.ifscCode,
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const verifiedCount = records.filter(
    (record) => record.status === "ACTIVE"
  ).length;

  const pendingCount = records.filter(
    (record) => record.status === "INACTIVE"
  ).length;

  const openAdd = () => {
    setForm(emptyForm);
    setSelectedRecord(null);
    setError("");
    setMessage("");
    setModal("add");
  };

  const openEdit = (record) => {
    setForm({
      bankName: record.bankName || "",
      accountHolderName: record.accountHolderName || "",
      accountNumber: record.accountNumber || "",
      ifscCode: record.ifscCode || "",
      status: record.status || "ACTIVE",
    });

    setSelectedRecord(record);
    setError("");
    setMessage("");
    setModal("edit");
  };

  const openView = (record) => {
    setSelectedRecord(record);
    setError("");
    setModal("view");
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setModal("");
    setSelectedRecord(null);
    setForm(emptyForm);
    setError("");
  };

  // POST /api/bank or PUT /api/bank/{id}
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const accountNumber = form.accountNumber.trim();
    const ifscCode = form.ifscCode.trim().toUpperCase();

    if (!/^\d{9,18}$/.test(accountNumber)) {
      setError("Enter an account number containing 9–18 digits.");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setError("Enter a valid IFSC code, for example SBIN0001234.");
      return;
    }

    const payload = {
      bankName: form.bankName.trim(),
      accountHolderName: form.accountHolderName.trim(),
      accountNumber,
      ifscCode,
      status: form.status,
    };

    setSaving(true);

    try {
      if (modal === "edit") {
        await apiRequest(`${API_URL}/${selectedRecord.id}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });

        setMessage("Bank details updated successfully.");
      } else {
        await apiRequest(API_URL, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });

        setMessage("Bank details added successfully.");
      }

      closeModal();
      await fetchBankDetails(false);
    } catch (err) {
      setError(err.message || "Unable to save bank details.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE /api/bank/{id}
  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      `Delete bank details for ${getEmployeeName(record)}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await apiRequest(`${API_URL}/${record.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      setMessage("Bank details deleted successfully.");
      await fetchBankDetails(false);
    } catch (err) {
      setError(err.message || "Unable to delete bank details.");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Employee ID",
      "Employee",
      "Department",
      "Bank Name",
      "Account Holder",
      "Account Number",
      "IFSC Code",
      "Status",
    ];

    const rows = filteredRecords.map((record) => [
      getEmployeeId(record),
      getEmployeeName(record),
      getDepartment(record),
      record.bankName,
      record.accountHolderName,
      record.accountNumber,
      record.ifscCode,
      record.status,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "bank-details.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="bank-page">
      <button
        type="button"
        className="bank-back-button"
        onClick={() => navigate("/employee-finance")}
      >
        <ArrowLeft size={17} />
        Back to Employee Finance
      </button>

      <header className="bank-page-header">
        <div className="bank-title-icon">
          <Landmark size={25} />
        </div>

        <div>
          <p className="bank-eyebrow">
            HIRENEST / EMPLOYEE FINANCE / BANK DETAILS
          </p>
          <h1>Bank Details</h1>
          <p>Manage employee bank accounts and banking information.</p>
        </div>
      </header>

      {message && <div className="bank-message success">{message}</div>}
      {error && <div className="bank-message error">{error}</div>}

      <section className="bank-summary-grid">
        <article className="bank-summary-card">
          <div className="bank-summary-icon">
            <Users size={21} />
          </div>
          <div>
            <span>Total Bank Records</span>
            <h3>{records.length}</h3>
          </div>
        </article>

        <article className="bank-summary-card">
          <div className="bank-summary-icon">
            <ShieldCheck size={21} />
          </div>
          <div>
            <span>Active Accounts</span>
            <h3>{verifiedCount}</h3>
          </div>
        </article>

        <article className="bank-summary-card">
          <div className="bank-summary-icon">
            <Clock3 size={21} />
          </div>
          <div>
            <span>Inactive Accounts</span>
            <h3>{pendingCount}</h3>
          </div>
        </article>
      </section>

      <section className="bank-content-card">
        <div className="bank-content-header">
          <div>
            <h2>Employee Bank Accounts</h2>
            <p>View and manage employee banking information.</p>
          </div>

          <button
            type="button"
            className="bank-primary-button"
            onClick={openAdd}
          >
            <Plus size={17} />
            Add Bank Details
          </button>
        </div>

        <div className="bank-toolbar">
          <div className="bank-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search employee, ID, or bank..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter bank status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="CLOSED">Closed</option>
          </select>

          <button
            type="button"
            className="bank-export-button"
            onClick={exportCSV}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="bank-table-wrapper">
          <table className="bank-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Bank Details</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="bank-empty">
                    Loading bank records...
                  </td>
                </tr>
              ) : (
                <>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="bank-employee-cell">
                          <div className="bank-avatar">
                            {getEmployeeName(record)
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{getEmployeeName(record)}</strong>
                            <span>{getEmployeeId(record)}</span>
                            <small>{getDepartment(record)}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="bank-detail-cell">
                          <strong>{record.bankName || "—"}</strong>
                          <span>
                            Account holder: {record.accountHolderName || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="bank-account-number">
                        {maskAccount(record.accountNumber)}
                      </td>

                      <td>{record.ifscCode || "—"}</td>

                      <td>
                        <span
                          className={`bank-status ${(record.status || "").toLowerCase()}`}
                        >
                          <span />
                          {formatStatus(record.status)}
                        </span>
                      </td>

                      <td>
                        <div className="bank-actions">
                          <button
                            type="button"
                            title="View bank details"
                            aria-label="View bank details"
                            onClick={() => openView(record)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Edit bank details"
                            aria-label="Edit bank details"
                            onClick={() => openEdit(record)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            title="Delete bank details"
                            aria-label="Delete bank details"
                            onClick={() => handleDelete(record)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="6" className="bank-empty">
                        No bank records found. Try another search or filter.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="bank-table-footer">
          Showing {filteredRecords.length} records
          <span>Connected to backend API</span>
        </div>
      </section>

      {modal && (
        <div className="bank-modal-overlay" onClick={closeModal}>
          <div
            className="bank-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bank-modal-header">
              <div>
                <h2>
                  {modal === "add" && "Add Bank Details"}
                  {modal === "edit" && "Edit Bank Details"}
                  {modal === "view" && "Bank Account Details"}
                </h2>
                <p>
                  {modal === "view"
                    ? "Review the selected bank record."
                    : "Enter the bank account information."}
                </p>
              </div>

              <button
                type="button"
                className="bank-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {modal === "view" && selectedRecord && (
              <div className="bank-details-grid">
                {[
                  ["Employee Name", getEmployeeName(selectedRecord)],
                  ["Employee ID", getEmployeeId(selectedRecord)],
                  ["Department", getDepartment(selectedRecord)],
                  ["Bank Name", selectedRecord.bankName],
                  ["Account Holder", selectedRecord.accountHolderName],
                  ["Account Number", selectedRecord.accountNumber],
                  ["IFSC Code", selectedRecord.ifscCode],
                  ["Status", formatStatus(selectedRecord.status)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value || "—"}</strong>
                  </div>
                ))}
              </div>
            )}

            {(modal === "add" || modal === "edit") && (
              <form className="bank-form" onSubmit={handleSubmit}>
                <div className="bank-form-grid">
                  <label>
                    Bank Name *
                    <input
                      name="bankName"
                      value={form.bankName}
                      onChange={updateField}
                      placeholder="Enter bank name"
                      required
                    />
                  </label>

                  <label>
                    Account Holder Name *
                    <input
                      name="accountHolderName"
                      value={form.accountHolderName}
                      onChange={updateField}
                      placeholder="Enter account holder name"
                      required
                    />
                  </label>

                  <label>
                    Account Number *
                    <input
                      name="accountNumber"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      value={form.accountNumber}
                      onChange={updateField}
                      placeholder="9–18 digit account number"
                      minLength={9}
                      maxLength={18}
                      pattern="[0-9]{9,18}"
                      required
                    />
                  </label>

                  <label>
                    IFSC Code *
                    <input
                      name="ifscCode"
                      value={form.ifscCode}
                      onChange={updateField}
                      placeholder="SBIN0001234"
                      maxLength={11}
                      required
                    />
                  </label>

                  <label className="bank-full-width">
                    Status *
                    <select
                      name="status"
                      value={form.status}
                      onChange={updateField}
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </label>
                </div>

                {error && <p className="bank-form-error">{error}</p>}

                <div className="bank-modal-actions">
                  <button
                    type="button"
                    className="bank-cancel-button"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bank-primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : modal === "edit"
                        ? "Save Changes"
                        : "Add Bank Details"}
                  </button>
                </div>
              </form>
            )}

            {modal === "view" && (
              <div className="bank-modal-actions bank-view-footer">
                <button
                  type="button"
                  className="bank-cancel-button"
                  onClick={closeModal}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="bank-primary-button"
                  onClick={() => openEdit(selectedRecord)}
                >
                  <Pencil size={15} />
                  Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
