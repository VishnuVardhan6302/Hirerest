
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Wallet,
  CheckCircle2,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Download,
  RefreshCw,
} from "lucide-react";
import "./index.css";

const API_URL = "http://localhost:8080/api/internship";

const emptyForm = {
  employeeId: "",
  stipend: "",
  frequency: "MONTHLY",
  startDate: "",
  endDate: "",
};

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);


function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("hirenestToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("hirenestToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwtToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("jwtToken") ||
    ""
  );
}


async function apiRequest(url, options = {}) {
  const token = getToken();
  console.log("JWT token found:", Boolean(token));

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.message || data.error || data.detail
        : data;

    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

function getRecordStatus(item) {
  const today = new Date().toISOString().slice(0, 10);

  if (item.endDate && item.endDate < today) return "Completed";
  if (item.startDate && item.startDate > today) return "Upcoming";
  return "Active";
}

export default function Stipend() {
  const [stipends, setStipends] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const loadStipends = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(API_URL);
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setStipends(records);
    } catch (err) {
      setError(
        `${err.message}. Check that Spring Boot is running on port 8080 and that your login token is valid.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStipends();
  }, [loadStipends]);

  const totals = useMemo(() => {
    const total = stipends.reduce(
      (sum, item) => sum + Number(item.stipend || 0),
      0
    );

    return {
      interns: stipends.length,
      total,
      active: stipends.filter(
        (item) => getRecordStatus(item) === "Active"
      ).length,
      upcoming: stipends.filter(
        (item) => getRecordStatus(item) === "Upcoming"
      ).length,
    };
  }, [stipends]);

  const filteredStipends = useMemo(() => {
    const term = search.trim().toLowerCase();

    return stipends.filter((item) => {
      const matchesSearch = [
        item.employeeId,
        item.frequency,
        item.startDate,
        item.endDate,
        item.id,
      ].some((value) => String(value ?? "").toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All" || getRecordStatus(item) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stipends, search, statusFilter]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
    setNotice("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({
      employeeId: String(item.employeeId ?? ""),
      stipend: String(item.stipend ?? ""),
      frequency: item.frequency || "MONTHLY",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
    });
    setFormError("");
    setNotice("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setNotice("");

    
const employeeId = form.employeeId.trim();
const stipend = Number(form.stipend);

if (!employeeId) {
  setFormError("Please enter a valid employee ID.");
  return;
}

if (!Number.isFinite(stipend) || stipend <= 0) {
  setFormError("Stipend must be greater than zero.");
  return;
}

const payload = {
  employeeId,
  stipend,
  frequency: form.frequency,
  startDate: form.startDate,
  endDate: form.endDate,
};


    setSaving(true);

    try {
      const url =
        editingId !== null
          ? `${API_URL}/${encodeURIComponent(editingId)}`
          : API_URL;

      await apiRequest(url, {
        method: editingId !== null ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      setNotice(
        editingId !== null
          ? "Stipend record updated successfully."
          : "Stipend record added successfully."
      );

      await loadStipends();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStipend = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stipend record?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      setNotice("Stipend record deleted successfully.");
      await loadStipends();
    } catch (err) {
      setError(`Unable to delete stipend record: ${err.message}`);
    }
  };

  const exportCsv = () => {
    const headers = [
      "Record ID",
      "Employee Database ID",
      "Stipend",
      "Frequency",
      "Start Date",
      "End Date",
      "Status",
    ];

    const rows = filteredStipends.map((item) => [
      item.id,
      item.employeeId,
      item.stipend,
      item.frequency,
      item.startDate,
      item.endDate,
      getRecordStatus(item),
    ]);

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stipend-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stipend-page">
      <div className="stipend-header">
        <div>
          <div className="stipend-breadcrumb">Finance / Stipend</div>
          <h1>Stipend Management</h1>
          <p>Manage intern stipend amounts and internship periods.</p>
        </div>

        <div className="stipend-header-actions">
          <button
            type="button"
            className="stipend-btn stipend-btn-outline"
            onClick={exportCsv}
          >
            <Download size={17} />
            Export CSV
          </button>
          <button
            type="button"
            className="stipend-btn stipend-btn-primary"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Stipend
          </button>
        </div>
      </div>

      {error && (
        <div className="stipend-alert stipend-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadStipends}>
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      )}

      {notice && (
        <div className="stipend-alert stipend-alert-success" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="stipend-summary-grid">
        <SummaryCard
          title="Stipend Records"
          value={totals.interns}
          icon={<Users size={21} />}
          detail="Records from backend"
          color="blue"
        />
        <SummaryCard
          title="Total Stipend"
          value={currency(totals.total)}
          icon={<Wallet size={21} />}
          detail="Sum of listed stipend amounts"
          color="purple"
        />
        <SummaryCard
          title="Active Records"
          value={totals.active}
          icon={<CheckCircle2 size={21} />}
          detail="Within the stipend period"
          color="green"
        />
        <SummaryCard
          title="Upcoming Records"
          value={totals.upcoming}
          icon={<CalendarDays size={21} />}
          detail="Periods starting later"
          color="orange"
        />
      </div>

      <div className="stipend-table-card">
        <div className="stipend-table-heading">
          <div>
            <h2>Stipend Records</h2>
            <p>Data loaded from the HIRENEST backend.</p>
          </div>
          <button
            type="button"
            className="stipend-icon-btn"
            title="Refresh records"
            aria-label="Refresh records"
            onClick={loadStipends}
            disabled={loading}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="stipend-toolbar">
          <div className="stipend-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search employee ID, frequency, dates..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="stipend-clear-search"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            className="stipend-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by record status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="stipend-table-wrapper">
          <table className="stipend-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Stipend Amount</th>
                <th>Frequency</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Period Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">
                    <div className="stipend-empty">Loading stipend records...</div>
                  </td>
                </tr>
              ) : filteredStipends.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="stipend-empty">
                      <Wallet size={34} />
                      <strong>No stipend records found</strong>
                      <span>
                        Add a record or try changing your search filters.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStipends.map((item) => {
                  const status = getRecordStatus(item);

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="stipend-person">
                          <div className="stipend-avatar">
                            {String(item.employeeId ?? "?").slice(0, 2)}
                          </div>
                          <div>
                            <strong>Employee #{item.employeeId}</strong>
                            <span>Record ID: {item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="stipend-money">
                        {currency(item.stipend)}
                      </td>
                      <td>{item.frequency || "—"}</td>
                      <td>
                        <span className="stipend-date">
                          <CalendarDays size={14} />
                          {item.startDate || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="stipend-date">
                          <CalendarDays size={14} />
                          {item.endDate || "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`stipend-status status-${status.toLowerCase()}`}
                        >
                          <span />
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="stipend-row-actions">
                          <button
                            type="button"
                            className="stipend-icon-btn"
                            title="Edit stipend"
                            aria-label={`Edit stipend record ${item.id}`}
                            onClick={() => openEditForm(item)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="stipend-icon-btn stipend-delete-btn"
                            title="Delete stipend"
                            aria-label={`Delete stipend record ${item.id}`}
                            onClick={() => deleteStipend(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="stipend-table-footer">
          <span>
            Showing {filteredStipends.length} of {stipends.length} records
          </span>
          <span>Amounts displayed in INR (₹)</span>
        </div>
      </div>

      {showForm && (
        <div
          className="stipend-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="stipend-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stipend-modal-title"
          >
            <div className="stipend-modal-header">
              <div>
                <h2 id="stipend-modal-title">
                  {editingId !== null ? "Edit Stipend" : "Add Stipend"}
                </h2>
                <p>Enter the employee ID and stipend period.</p>
              </div>
              <button
                type="button"
                className="stipend-icon-btn"
                aria-label="Close form"
                disabled={saving}
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="stipend-form-grid">
                <label className="stipend-full-width">
                  Employee Database ID *
                  
<input
  type="text"
  name="employeeId"
  value={form.employeeId}
  onChange={updateField}
  placeholder="Enter employee ID, e.g. EMP001"
  required
/>

                  <span className="stipend-field-help">
                    Use the employee's database ID, not an employee code.
                  </span>
                </label>

                <label>
                  Stipend Amount (₹) *
                  <input
                    type="number"
                    name="stipend"
                    min="0.01"
                    step="0.01"
                    value={form.stipend}
                    onChange={updateField}
                    placeholder="Enter stipend amount"
                    required
                  />
                </label>

                <label>
                  Frequency *
                  <select
                    name="frequency"
                    value={form.frequency}
                    onChange={updateField}
                    required
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="DAILY">Daily</option>
                    <option value="YEARLY">Yearly</option>
                    <option value="ONE_TIME">One-time</option>
                  </select>
                </label>

                <label>
                  Start Date *
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  End Date *
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={updateField}
                    min={form.startDate || undefined}
                    required
                  />
                </label>
              </div>

              {formError && (
                <p className="stipend-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="stipend-modal-actions">
                <button
                  type="button"
                  className="stipend-btn stipend-btn-outline"
                  disabled={saving}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="stipend-btn stipend-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Stipend"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, detail, color }) {
  return (
    <div className="stipend-summary-card">
      <div className="stipend-summary-top">
        <span>{title}</span>
        <div className={`stipend-summary-icon ${color}`}>{icon}</div>
      </div>
      <strong className="stipend-summary-value">{value}</strong>
      <span className="stipend-summary-detail">{detail}</span>
    </div>
  );
}
