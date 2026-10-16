import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  GraduationCap,
  Wallet,
  Users,
  CheckCircle2,
  Clock,
  CalendarDays,
  History,
} from "lucide-react";
import "./index.css";

const initialStipends = [
  {
    id: 1,
    employeeId: "HN-INT-001",
    name: "Arun Kumar",
    email: "arun@example.com",
    stipend: 12000,
    frequency: "Monthly",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "Active",
  },
  {
    id: 2,
    employeeId: "HN-INT-002",
    name: "Priya Sharma",
    email: "priya@example.com",
    stipend: 10000,
    frequency: "Monthly",
    startDate: "2026-02-01",
    endDate: "2026-07-31",
    status: "Active",
  },
  {
    id: 3,
    employeeId: "HN-INT-003",
    name: "Karthik Raj",
    email: "karthik@example.com",
    stipend: 8000,
    frequency: "Monthly",
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    status: "Completed",
  },
  {
    id: 4,
    employeeId: "HN-INT-004",
    name: "Divya S",
    email: "divya@example.com",
    stipend: 15000,
    frequency: "Monthly",
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    status: "Pending",
  },
];

const initialHistory = [
  {
    id: 1,
    employeeId: "HN-INT-001",
    name: "Arun Kumar",
    amount: 12000,
    period: "September 2026",
    paymentDate: "2026-09-05",
    status: "Paid",
  },
  {
    id: 2,
    employeeId: "HN-INT-002",
    name: "Priya Sharma",
    amount: 10000,
    period: "September 2026",
    paymentDate: "2026-09-05",
    status: "Paid",
  },
  {
    id: 3,
    employeeId: "HN-INT-004",
    name: "Divya S",
    amount: 15000,
    period: "September 2026",
    paymentDate: "2026-09-10",
    status: "Pending",
  },
  {
    id: 4,
    employeeId: "HN-INT-001",
    name: "Arun Kumar",
    amount: 12000,
    period: "August 2026",
    paymentDate: "2026-08-05",
    status: "Paid",
  },
];

const emptyForm = {
  employeeId: "",
  name: "",
  email: "",
  stipend: "",
  frequency: "Monthly",
  startDate: "",
  endDate: "",
  status: "Active",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Stipend() {
  const navigate = useNavigate();

  const [stipends, setStipends] = useState(initialStipends);
  const [history, setHistory] = useState(initialHistory);
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [frequencyFilter, setFrequencyFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selectedStipend, setSelectedStipend] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredStipends = useMemo(() => {
    const query = search.toLowerCase().trim();

    return stipends.filter((item) => {
      const matchesSearch = [
        item.name,
        item.employeeId,
        item.email,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesFrequency =
        frequencyFilter === "All" ||
        item.frequency === frequencyFilter;

      return matchesSearch && matchesStatus && matchesFrequency;
    });
  }, [stipends, search, statusFilter, frequencyFilter]);

  const filteredHistory = useMemo(() => {
    const query = search.toLowerCase().trim();

    return history.filter((item) => {
      const matchesSearch = [
        item.name,
        item.employeeId,
        item.period,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [history, search, statusFilter]);

  const activeCount = stipends.filter(
    (item) => item.status === "Active"
  ).length;

  const totalMonthlyStipend = stipends
    .filter((item) => item.status === "Active")
    .reduce((total, item) => {
      if (item.frequency === "Monthly") return total + Number(item.stipend);
      if (item.frequency === "Weekly") {
        return total + Number(item.stipend) * 4;
      }
      return total + Number(item.stipend) / 12;
    }, 0);

  const paidCount = history.filter(
    (item) => item.status === "Paid"
  ).length;

  const openAddModal = () => {
    setForm(emptyForm);
    setError("");
    setSelectedStipend(null);
    setModal("add");
  };

  const openEditModal = (item) => {
    setForm({
      employeeId: item.employeeId,
      name: item.name,
      email: item.email,
      stipend: String(item.stipend),
      frequency: item.frequency,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
    });
    setError("");
    setSelectedStipend(item);
    setModal("edit");
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const saveStipend = (event) => {
    event.preventDefault();
    setError("");

    if (form.endDate < form.startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    const stipendAmount = Number(form.stipend);

    if (!Number.isFinite(stipendAmount) || stipendAmount <= 0) {
      setError("Enter a valid stipend amount greater than zero.");
      return;
    }

    const record = {
      ...form,
      stipend: stipendAmount,
    };

    if (modal === "edit" && selectedStipend) {
      setStipends((previous) =>
        previous.map((item) =>
          item.id === selectedStipend.id
            ? { ...record, id: selectedStipend.id }
            : item
        )
      );
    } else {
      setStipends((previous) => [
        { ...record, id: Date.now() },
        ...previous,
      ]);
    }

    setModal(null);
    setForm(emptyForm);
  };

  const deleteStipend = (item) => {
    const confirmed = window.confirm(
      `Delete the stipend record for ${item.name}?`
    );

    if (!confirmed) return;

    setStipends((previous) =>
      previous.filter((record) => record.id !== item.id)
    );
  };

  const exportCSV = () => {
    const rows =
      activeTab === "list" ? filteredStipends : filteredHistory;

    const headers =
      activeTab === "list"
        ? [
            "Employee ID",
            "Name",
            "Email",
            "Stipend",
            "Frequency",
            "Start Date",
            "End Date",
            "Status",
          ]
        : [
            "Employee ID",
            "Name",
            "Amount",
            "Period",
            "Payment Date",
            "Status",
          ];

    const values =
      activeTab === "list"
        ? rows.map((item) => [
            item.employeeId,
            item.name,
            item.email,
            item.stipend,
            item.frequency,
            item.startDate,
            item.endDate,
            item.status,
          ])
        : rows.map((item) => [
            item.employeeId,
            item.name,
            item.amount,
            item.period,
            item.paymentDate,
            item.status,
          ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...values]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      activeTab === "list" ? "stipend-list.csv" : "stipend-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setModal(null);
    setError("");
    setSelectedStipend(null);
  };

  return (
    <div className="stipend-page">
      <button
        type="button"
        className="stipend-back-button"
        onClick={() => navigate("/employee-finance")}
      >
        <ArrowLeft size={17} />
        <span>Back to Employee Finance</span>
      </button>

      <header className="stipend-page-header">
        <div className="stipend-title-icon">
          <GraduationCap size={25} />
        </div>

        <div>
          <p className="stipend-eyebrow">EMPLOYEE FINANCE / STIPEND</p>
          <h1>Stipend Management</h1>
          <p>
            Manage intern stipend details, payment schedules, and payment
            history.
          </p>
        </div>
      </header>

      <section className="stipend-summary-grid">
        <article className="stipend-summary-card">
          <div className="stipend-summary-icon">
            <Users size={21} />
          </div>
          <div>
            <span>Total Intern Records</span>
            <h3>{stipends.length}</h3>
          </div>
        </article>

        <article className="stipend-summary-card">
          <div className="stipend-summary-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Active Interns</span>
            <h3>{activeCount}</h3>
          </div>
        </article>

        <article className="stipend-summary-card">
          <div className="stipend-summary-icon">
            <Wallet size={21} />
          </div>
          <div>
            <span>Estimated Monthly Stipend</span>
            <h3>{formatCurrency(totalMonthlyStipend)}</h3>
          </div>
        </article>

        <article className="stipend-summary-card">
          <div className="stipend-summary-icon">
            <History size={21} />
          </div>
          <div>
            <span>Paid History Records</span>
            <h3>{paidCount}</h3>
          </div>
        </article>
      </section>

      <section className="stipend-content-card">
        <div className="stipend-content-header">
          <div>
            <h2>Intern Stipends</h2>
            <p>View and manage intern stipend information.</p>
          </div>

          <button
            type="button"
            className="stipend-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Stipend
          </button>
        </div>

        <div className="stipend-tabs">
          <button
            type="button"
            className={activeTab === "list" ? "active" : ""}
            onClick={() => {
              setActiveTab("list");
              setStatusFilter("All");
            }}
          >
            <Wallet size={16} />
            Stipend List
          </button>

          <button
            type="button"
            className={activeTab === "history" ? "active" : ""}
            onClick={() => {
              setActiveTab("history");
              setStatusFilter("All");
            }}
          >
            <History size={16} />
            Stipend History
          </button>
        </div>

        <div className="stipend-toolbar">
          <div className="stipend-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or employee ID..."
            />
          </div>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            {(
              activeTab === "list"
                ? ["Active", "Pending", "Completed"]
                : ["Paid", "Pending"]
            ).map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>

          {activeTab === "list" && (
            <select
              aria-label="Filter by frequency"
              value={frequencyFilter}
              onChange={(event) => setFrequencyFilter(event.target.value)}
            >
              <option value="All">All Frequencies</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Yearly">Yearly</option>
            </select>
          )}

          <button
            type="button"
            className="stipend-export-button"
            onClick={exportCSV}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {activeTab === "list" ? (
          <div className="stipend-table-wrapper">
            <table className="stipend-table">
              <thead>
                <tr>
                  <th>Intern</th>
                  <th>Stipend</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStipends.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="stipend-employee-cell">
                        <div className="stipend-avatar">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.employeeId}</span>
                          <small>{item.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className="stipend-amount">
                        {formatCurrency(item.stipend)}
                      </strong>
                    </td>

                    <td>{item.frequency}</td>

                    <td>
                      <div className="stipend-duration">
                        <span>
                          <CalendarDays size={13} />
                          {formatDate(item.startDate)}
                        </span>
                        <span>to {formatDate(item.endDate)}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`stipend-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="stipend-row-actions">
                        <button
                          type="button"
                          title="View"
                          aria-label={`View ${item.name}`}
                          onClick={() => {
                            setSelectedStipend(item);
                            setModal("view");
                          }}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => openEditModal(item)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          aria-label={`Delete ${item.name}`}
                          className="delete"
                          onClick={() => deleteStipend(item)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStipends.length === 0 && (
                  <tr>
                    <td colSpan="6" className="stipend-empty">
                      No stipend records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="stipend-table-wrapper">
            <table className="stipend-table">
              <thead>
                <tr>
                  <th>Intern</th>
                  <th>Payment Period</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="stipend-employee-cell">
                        <div className="stipend-avatar">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    <td>{item.period}</td>
                    <td>
                      <strong className="stipend-amount">
                        {formatCurrency(item.amount)}
                      </strong>
                    </td>
                    <td>{formatDate(item.paymentDate)}</td>
                    <td>
                      <span
                        className={`stipend-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="stipend-history-view"
                        onClick={() => {
                          setSelectedStipend(item);
                          setModal("historyView");
                        }}
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan="6" className="stipend-empty">
                      No stipend history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="stipend-table-footer">
          Showing{" "}
          {activeTab === "list"
            ? filteredStipends.length
            : filteredHistory.length}{" "}
          records
          <span>Demo data · Not connected to the backend</span>
        </div>
      </section>

      {modal && (
        <div className="stipend-modal-overlay" onClick={closeModal}>
          <div
            className="stipend-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="stipend-modal-header">
              <div>
                <h2>
                  {modal === "add" && "Add Stipend"}
                  {modal === "edit" && "Edit Stipend"}
                  {modal === "view" && "Stipend Details"}
                  {modal === "historyView" && "Payment Details"}
                </h2>
                <p>
                  {modal === "view" || modal === "historyView"
                    ? "Review the selected record."
                    : "Enter the intern's stipend information."}
                </p>
              </div>

              <button
                type="button"
                className="stipend-modal-close"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {modal === "view" && selectedStipend && (
              <div className="stipend-details-grid">
                <div>
                  <span>Intern Name</span>
                  <strong>{selectedStipend.name}</strong>
                </div>
                <div>
                  <span>Employee ID</span>
                  <strong>{selectedStipend.employeeId}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedStipend.email}</strong>
                </div>
                <div>
                  <span>Stipend Amount</span>
                  <strong>{formatCurrency(selectedStipend.stipend)}</strong>
                </div>
                <div>
                  <span>Frequency</span>
                  <strong>{selectedStipend.frequency}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedStipend.status}</strong>
                </div>
                <div>
                  <span>Start Date</span>
                  <strong>{formatDate(selectedStipend.startDate)}</strong>
                </div>
                <div>
                  <span>End Date</span>
                  <strong>{formatDate(selectedStipend.endDate)}</strong>
                </div>
              </div>
            )}

            {modal === "historyView" && selectedStipend && (
              <div className="stipend-details-grid">
                <div>
                  <span>Intern Name</span>
                  <strong>{selectedStipend.name}</strong>
                </div>
                <div>
                  <span>Employee ID</span>
                  <strong>{selectedStipend.employeeId}</strong>
                </div>
                <div>
                  <span>Payment Period</span>
                  <strong>{selectedStipend.period}</strong>
                </div>
                <div>
                  <span>Payment Amount</span>
                  <strong>{formatCurrency(selectedStipend.amount)}</strong>
                </div>
                <div>
                  <span>Payment Date</span>
                  <strong>{formatDate(selectedStipend.paymentDate)}</strong>
                </div>
                <div>
                  <span>Payment Status</span>
                  <strong>{selectedStipend.status}</strong>
                </div>
              </div>
            )}

            {(modal === "add" || modal === "edit") && (
              <form className="stipend-form" onSubmit={saveStipend}>
                <div className="stipend-form-grid">
                  <label>
                    Intern Name *
                    <input
                      name="name"
                      value={form.name}
                      onChange={updateForm}
                      placeholder="Enter intern name"
                      required
                    />
                  </label>

                  <label>
                    Employee ID *
                    <input
                      name="employeeId"
                      value={form.employeeId}
                      onChange={updateForm}
                      placeholder="e.g. HN-INT-005"
                      required
                    />
                  </label>

                  <label className="full-width">
                    Email Address *
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateForm}
                      placeholder="intern@example.com"
                      required
                    />
                  </label>

                  <label>
                    Stipend Amount (₹) *
                    <input
                      name="stipend"
                      type="number"
                      min="1"
                      step="1"
                      value={form.stipend}
                      onChange={updateForm}
                      placeholder="Enter amount"
                      required
                    />
                  </label>

                  <label>
                    Frequency *
                    <select
                      name="frequency"
                      value={form.frequency}
                      onChange={updateForm}
                      required
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </label>

                  <label>
                    Start Date *
                    <input
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={updateForm}
                      required
                    />
                  </label>

                  <label>
                    End Date *
                    <input
                      name="endDate"
                      type="date"
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={updateForm}
                      required
                    />
                  </label>

                  <label className="full-width">
                    Status *
                    <select
                      name="status"
                      value={form.status}
                      onChange={updateForm}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>
                </div>

                {error && <p className="stipend-form-error">{error}</p>}

                <div className="stipend-modal-actions">
                  <button
                    type="button"
                    className="stipend-cancel-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="stipend-primary-button"
                  >
                    {modal === "edit" ? "Save Changes" : "Add Stipend"}
                  </button>
                </div>
              </form>
            )}

            {(modal === "view" || modal === "historyView") && (
              <div className="stipend-modal-actions">
                <button
                  type="button"
                  className="stipend-cancel-button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}