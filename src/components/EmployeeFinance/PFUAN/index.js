import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./index.css";
const API_URL = "http://localhost:8080/api/pf";

const getToken = () =>
  localStorage.getItem("hirenestToken") ||
  sessionStorage.getItem("hirenestToken") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

const emptyForm = {
  employeeId: "",
  employeeName: "",
  pfAccountNumber: "",
  uan: "",
  pfStatus: "ACTIVE",
  uanStatus: "PENDING",
};

function StatusBadge({ status }) {
  const normalized = (status || "UNKNOWN").toLowerCase();

  return (
    <span className={`pf-status pf-status--${normalized}`}>
      <span className="pf-status-dot" />
      {status || "Unknown"}
    </span>
  );
}

export default function PFUAN() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [pfFilter, setPfFilter] = useState("ALL");
  const [uanFilter, setUanFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  // Fetch PF/UAN records from the backend.
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setApiError("");

    try {
      const token = getToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unable to fetch PF records (${response.status}).`
        );
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : data.content || data.data || data.records || [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected PF API response format.");
      }

      setRecords(
        list.map((item) => ({
          ...item,
          id: item.id,
          employeeId: item.employeeId ?? "",
          employeeName: item.employeeName ?? "",
          pfAccountNumber: item.pfAccountNumber ?? "",
          uan: item.uan ?? "",
          pfStatus: item.pfStatus ?? "ACTIVE",
          uanStatus: item.uanStatus ?? "PENDING",
        }))
      );
    } catch (error) {
      setApiError(
        error.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Search and filter records.
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch = [
        record.employeeId,
        record.employeeName,
        record.pfAccountNumber,
        record.uan,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesPf =
        pfFilter === "ALL" || record.pfStatus === pfFilter;

      const matchesUan =
        uanFilter === "ALL" || record.uanStatus === uanFilter;

      return matchesSearch && matchesPf && matchesUan;
    });
  }, [records, search, pfFilter, uanFilter]);

  // Dashboard summary counts.
  const activePfCount = records.filter(
    (record) => record.pfStatus === "ACTIVE"
  ).length;

  const verifiedUanCount = records.filter(
    (record) => record.uanStatus === "VERIFIED"
  ).length;

  const pendingUanCount = records.filter(
    (record) => record.uanStatus === "PENDING"
  ).length;

  // Open the add form.
  const openAddForm = () => {
    setSelectedRecord(null);
    setForm({ ...emptyForm });
    setFormError("");
    setShowForm(true);
  };

  // Existing backend documentation does not provide an update API.
  const openEditForm = () => {
    setFormError(
      "Editing is unavailable because the backend update API has not been provided."
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedRecord(null);
    setForm({ ...emptyForm });
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Create a new PF/UAN record.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (selectedRecord) {
      setFormError(
        "Editing is not supported by the currently provided API."
      );
      return;
    }

    if (
      !form.employeeId.trim() ||
      !form.pfAccountNumber.trim() ||
      !/^\d{12}$/.test(form.uan.trim())
    ) {
      setFormError(
        "Enter an employee ID, PF account number and valid 12-digit UAN."
      );
      return;
    }

    setSubmitting(true);

    try {
      const token = getToken();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          employeeId: form.employeeId.trim(),
          pfAccountNumber: form.pfAccountNumber.trim(),
          uan: form.uan.trim(),
          pfStatus: form.pfStatus,
          uanStatus: form.uanStatus,
        }),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Failed to create PF record (${response.status}).`
        );
      }

      closeForm();
      await fetchRecords();
    } catch (error) {
      setFormError(
        error.message || "Failed to save PF details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a record using its backend ID.
  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      `Remove the PF/UAN record for ${record.employeeId}?`
    );

    if (!confirmed) return;

    if (record.id == null) {
      setApiError(
        "This record has no backend ID and cannot be deleted."
      );
      return;
    }

    setApiError("");

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(record.id)}`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Failed to delete PF record (${response.status}).`
        );
      }

      await fetchRecords();
    } catch (error) {
      setApiError(
        error.message || "Failed to delete PF record."
      );
    }
  };

  // Export the filtered records to CSV.
  const handleExport = () => {
    const columns = [
      "Employee ID",
      "Employee Name",
      "PF Account Number",
      "UAN",
      "PF Status",
      "UAN Status",
    ];

    const rows = filteredRecords.map((record) => [
      record.employeeId,
      record.employeeName,
      record.pfAccountNumber,
      record.uan,
      record.pfStatus,
      record.uanStatus,
    ]);

    const csv = [columns, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "pf-uan-records.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="pf-page">

      <button
  type="button"
  className="pf-back-button"
  onClick={() => navigate("/employee-finance")}
>
  <ArrowLeft size={17} />
  <span>Back to Employee Finance</span>
</button>
{apiError && (
  <p className="pf-form-error" role="alert">
    {apiError}
  </p>
)}

<header className="pf-page-header">
  <div>
    <div className="pf-breadcrumb">
      Employee Finance <span>/</span> PF &amp; UAN
    </div>

    <h1>PF &amp; UAN Management</h1>

    <p className="pf-subtitle">
      Manage employee provident fund and UAN information
      in one place.
    </p>
  </div>

  <button
    className="pf-primary-button"
    onClick={openAddForm}
  >
    <span className="pf-button-plus">+</span>
    Add PF Details
  </button>
</header>

<section className="pf-summary-grid">
  <article className="pf-summary-card">
    <div className="pf-summary-top">
      <span className="pf-summary-label">
        Total Records
      </span>
      <span className="pf-summary-icon pf-icon-green">
        ▤
      </span>
    </div>
    <div className="pf-summary-number">
      {records.length}
    </div>
    <p>Employee PF &amp; UAN records</p>
  </article>

  <article className="pf-summary-card">
    <div className="pf-summary-top">
      <span className="pf-summary-label">Active PF</span>
      <span className="pf-summary-icon pf-icon-blue">
        ✓
      </span>
    </div>
    <div className="pf-summary-number">
      {activePfCount}
    </div>
    <p>Active provident fund accounts</p>
  </article>

  <article className="pf-summary-card">
    <div className="pf-summary-top">
      <span className="pf-summary-label">
        Verified UAN
      </span>
      <span className="pf-summary-icon pf-icon-green">
        ✓
      </span>
    </div>
    <div className="pf-summary-number">
      {verifiedUanCount}
    </div>
    <p>Verified UAN records</p>
  </article>

  <article className="pf-summary-card">
    <div className="pf-summary-top">
      <span className="pf-summary-label">
        Pending UAN
      </span>
      <span className="pf-summary-icon pf-icon-orange">
        ◷
      </span>
    </div>
    <div className="pf-summary-number">
      {pendingUanCount}
    </div>
    <p>UAN records awaiting verification</p>
  </article>
</section>

<section className="pf-table-card">
  <div className="pf-table-heading">
    <div>
      <h2>Employee PF &amp; UAN Details</h2>
      <p>
        Search, review and manage PF account information.
      </p>
    </div>

    <button
      className="pf-secondary-button"
      onClick={handleExport}
      disabled={loading || filteredRecords.length === 0}
    >
      <span>↓</span> Export CSV
    </button>
  </div>

  <div className="pf-toolbar">
    <label className="pf-search">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Search employee, PF number or UAN..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />
    </label>

    <label className="pf-filter">
      <span>PF Status</span>
      <select
        value={pfFilter}
        onChange={(event) =>
          setPfFilter(event.target.value)
        }
      >
        <option value="ALL">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </label>

    <label className="pf-filter">
      <span>UAN Status</span>
      <select
        value={uanFilter}
        onChange={(event) =>
          setUanFilter(event.target.value)
        }
      >
        <option value="ALL">All statuses</option>
        <option value="VERIFIED">Verified</option>
        <option value="PENDING">Pending</option>
      </select>
    </label>
  </div>

  <div className="pf-table-scroll">
    <table className="pf-table">
      <thead>
        <tr>
          <th>EMPLOYEE</th>
          <th>PF ACCOUNT NUMBER</th>
          <th>UAN</th>
          <th>PF STATUS</th>
          <th>UAN STATUS</th>
          <th className="pf-action-heading">ACTIONS</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="6">
              <div className="pf-empty-state">
                <strong>Loading PF &amp; UAN records...</strong>
              </div>
            </td>
          </tr>
        ) : filteredRecords.length === 0 ? (
          <tr>
            <td colSpan="6">
              <div className="pf-empty-state">
                <span>⌕</span>
                <strong>
                  {apiError
                    ? "Unable to load records"
                    : "No records found"}
                </strong>
                <p>
                  {apiError
                    ? "Check the backend connection and try again."
                    : "Try another search or change your status filters."}
                </p>

                {apiError && (
                  <button
                    className="pf-secondary-button"
                    onClick={fetchRecords}
                  >
                    Retry
                  </button>
                )}
              </div>
            </td>
          </tr>
        ) : (
          filteredRecords.map((record) => (
            <tr key={record.id ?? record.employeeId}>
              <td>
                <div className="pf-employee-cell">
                  <span className="pf-avatar">
                    {(
                      record.employeeName ||
                      record.employeeId ||
                      "?"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span>
                    <strong>
                      {record.employeeName || "—"}
                    </strong>
                    <small>{record.employeeId}</small>
                  </span>
                </div>
              </td>

              <td className="pf-mono">
                {record.pfAccountNumber}
              </td>

              <td className="pf-mono">{record.uan}</td>

              <td>
                <StatusBadge status={record.pfStatus} />
              </td>

              <td>
                <StatusBadge status={record.uanStatus} />
              </td>

              <td>
                <div className="pf-row-actions">
                  <button
                    className="pf-icon-button"
                    title="View details"
                    aria-label={`View ${record.employeeId}`}
                    onClick={() =>
                      setSelectedRecord({
                        ...record,
                        viewOnly: true,
                      })
                    }
                  >
                    ◉
                  </button>

                  <button
                    className="pf-icon-button"
                    title="Editing is not available"
                    aria-label={`Edit ${record.employeeId}`}
                    onClick={openEditForm}
                  >
                    ✎
                  </button>

                  <button
                    className="pf-icon-button pf-delete-button"
                    title="Delete record"
                    aria-label={`Delete ${record.employeeId}`}
                    onClick={() => handleDelete(record)}
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  <div className="pf-table-footer">
    Showing <strong>{filteredRecords.length}</strong> of{" "}
    <strong>{records.length}</strong> records
  </div>
</section>

{showForm && (
  <div
    className="pf-modal-backdrop"
    onMouseDown={closeForm}
  >
    <section
      className="pf-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pf-modal-title"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="pf-modal-header">
        <div>
          <h2 id="pf-modal-title">Add PF Details</h2>
          <p>
            Enter the employee's PF and UAN information.
          </p>
        </div>

        <button
          className="pf-modal-close"
          aria-label="Close form"
          onClick={closeForm}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="pf-form-grid">
          <label className="pf-field">
            <span>
              Employee ID <b>*</b>
            </span>
            <input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              required
            />
          </label>

          <label className="pf-field">
            <span>Employee Name</span>
            <input
              name="employeeName"
              value={form.employeeName}
              onChange={handleChange}
              placeholder="Enter employee name"
            />
          </label>

          <label className="pf-field pf-field-full">
            <span>
              PF Account Number <b>*</b>
            </span>
            <input
              name="pfAccountNumber"
              value={form.pfAccountNumber}
              onChange={handleChange}
              placeholder="Enter PF account number"
              required
            />
          </label>

          <label className="pf-field pf-field-full">
            <span>
              UAN <b>*</b>
            </span>
            <input
              name="uan"
              value={form.uan}
              onChange={handleChange}
              placeholder="Enter 12-digit UAN"
              inputMode="numeric"
              pattern="[0-9]{12}"
              title="Enter a 12-digit UAN"
              maxLength={12}
              required
            />
          </label>

          <label className="pf-field">
            <span>PF Status</span>
            <select
              name="pfStatus"
              value={form.pfStatus}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <label className="pf-field">
            <span>UAN Status</span>
            <select
              name="uanStatus"
              value={form.uanStatus}
              onChange={handleChange}
            >
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </label>
        </div>

        {formError && (
          <p className="pf-form-error" role="alert">
            {formError}
          </p>
        )}

        <div className="pf-modal-footer">
          <button
            type="button"
            className="pf-secondary-button"
            onClick={closeForm}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="pf-primary-button"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add Record"}
          </button>
        </div>
      </form>
    </section>
  </div>
)}

{selectedRecord?.viewOnly && (
  <div
    className="pf-modal-backdrop"
    onMouseDown={() => setSelectedRecord(null)}
  >
    <section
      className="pf-modal pf-view-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pf-view-title"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="pf-modal-header">
        <div>
          <h2 id="pf-view-title">
            PF &amp; UAN Details
          </h2>
          <p>Employee record information</p>
        </div>

        <button
          className="pf-modal-close"
          onClick={() => setSelectedRecord(null)}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      <dl className="pf-detail-list">
        <div>
          <dt>Employee ID</dt>
          <dd>{selectedRecord.employeeId}</dd>
        </div>

        <div>
          <dt>Employee Name</dt>
          <dd>{selectedRecord.employeeName || "—"}</dd>
        </div>

        <div>
          <dt>PF Account Number</dt>
          <dd>{selectedRecord.pfAccountNumber}</dd>
        </div>

        <div>
          <dt>UAN</dt>
          <dd>{selectedRecord.uan}</dd>
        </div>

        <div>
          <dt>PF Status</dt>
          <dd>
            <StatusBadge status={selectedRecord.pfStatus} />
          </dd>
        </div>

        <div>
          <dt>UAN Status</dt>
          <dd>
            <StatusBadge status={selectedRecord.uanStatus} />
          </dd>
        </div>
      </dl>

      <div className="pf-modal-footer">
        <button
          className="pf-secondary-button"
          onClick={() => setSelectedRecord(null)}
        >
          Close
        </button>
      </div>
    </section>
  </div>
)}
    </main>
  );
}
