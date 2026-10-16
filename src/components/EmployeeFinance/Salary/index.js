
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Eye,
  Pencil,
  X,
  Wallet,
  Users,
  CircleCheck,
  Clock3,
  History,
  Download,
  CalendarDays, 
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const initialEmployees = [
  {
    id: 1,
    employee: "Mathi",
    email: "mathij@gmail.com",
    employeeId: "EMP001",
    employmentType: "Full-time",
    salary: 19000,
    effectiveDate: "2026-02-22",
    currency: "INR",
    status: "Active",
    frequency: "Monthly",
  },
  {
    id: 2,
    employee: "Arun Kumar",
    email: "arun@gmail.com",
    employeeId: "EMP002",
    employmentType: "Full-time",
    salary: 32000,
    effectiveDate: "2026-03-01",
    currency: "INR",
    status: "Active",
    frequency: "Monthly",
  },
  {
    id: 3,
    employee: "Priya Sharma",
    email: "priya@gmail.com",
    employeeId: "EMP003",
    employmentType: "Intern",
    salary: 12000,
    effectiveDate: "2026-01-15",
    currency: "INR",
    status: "Active",
    frequency: "Monthly",
  },
  {
    id: 4,
    employee: "Rahul Kumar",
    email: "rahul@gmail.com",
    employeeId: "EMP004",
    employmentType: "Contract",
    salary: 24000,
    effectiveDate: "2025-12-01",
    currency: "INR",
    status: "Inactive",
    frequency: "Monthly",
  },
];

const initialHistory = [
  {
    id: 101,
    employeeId: "EMP001",
    employee: "Mathi",
    salary: 15000,
    effectiveDate: "2025-08-01",
    currency: "INR",
    frequency: "Monthly",
    status: "Previous",
  },
  {
    id: 102,
    employeeId: "EMP001",
    employee: "Mathi",
    salary: 17000,
    effectiveDate: "2025-11-01",
    currency: "INR",
    frequency: "Monthly",
    status: "Previous",
  },
  {
    id: 103,
    employeeId: "EMP001",
    employee: "Mathi",
    salary: 19000,
    effectiveDate: "2026-02-22",
    currency: "INR",
    frequency: "Monthly",
    status: "Current",
  },
  {
    id: 104,
    employeeId: "EMP002",
    employee: "Arun Kumar",
    salary: 28000,
    effectiveDate: "2025-09-01",
    currency: "INR",
    frequency: "Monthly",
    status: "Previous",
  },
];

const emptyForm = {
  employee: "",
  email: "",
  employeeId: "",
  employmentType: "Full-time",
  salary: "",
  effectiveDate: "",
  currency: "INR",
  frequency: "Monthly",
  status: "Active",
};

const money = (value, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  } catch {
    return `${currency} ${value}`;
  }
};

const dateFormat = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function Salary() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(initialEmployees);
  const [history, setHistory] = useState(initialHistory);
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalType, setModalType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveCount = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const monthlyPayroll = employees
    .filter(
      (employee) =>
        employee.status === "Active" &&
        employee.frequency === "Monthly" &&
        employee.currency === "INR"
    )
    .reduce((total, employee) => total + Number(employee.salary || 0), 0);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch = [
        employee.employee,
        employee.email,
        employee.employeeId,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesEmployment =
        employmentFilter === "All" ||
        employee.employmentType === employmentFilter;

      const matchesStatus =
        statusFilter === "All" || employee.status === statusFilter;

      return matchesSearch && matchesEmployment && matchesStatus;
    });
  }, [employees, search, employmentFilter, statusFilter]);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return history
      .filter((record) => {
        const matchesSearch = [
          record.employee,
          record.employeeId,
          record.status,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

        const employee = employees.find(
          (item) => item.employeeId === record.employeeId
        );

        const matchesEmployment =
          employmentFilter === "All" ||
          employee?.employmentType === employmentFilter;

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Active" && record.status === "Current") ||
          (statusFilter === "Inactive" && record.status === "Previous");

        return matchesSearch && matchesEmployment && matchesStatus;
      })
      .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
  }, [history, employees, search, employmentFilter, statusFilter]);

  const closeModal = () => {
    setModalType("");
    setSelectedEmployee(null);
    setForm(emptyForm);
    setError("");
  };

  const openAdd = () => {
    setSelectedEmployee(null);
    setForm(emptyForm);
    setError("");
    setModalType("add");
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setForm({ ...employee });
    setError("");
    setModalType("edit");
  };

  const openView = (employee) => {
    setSelectedEmployee(employee);
    setModalType("view");
  };
  const handleDelete = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this salary record?"
  );

  if (!confirmed) return;

  setEmployees((previous) =>
    previous.filter((employee) => employee.id !== id)
  );

  setHistory((previous) =>
    previous.filter((record) => record.id !== id)
  );
};

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.employee.trim() ||
      !form.employeeId.trim() ||
      form.salary === "" ||
      Number(form.salary) <= 0 ||
      !form.effectiveDate
    ) {
      setError("Please fill in all required fields correctly.");
      return;
    }

   
    const duplicate = employees.some(
      (employee) =>
        employee.employeeId.toLowerCase() ===
          form.employeeId.trim().toLowerCase() &&
        employee.id !== selectedEmployee?.id
    );

    if (duplicate) {
      setError("This Employee ID already exists.");
      return;
    }

    const record = {
      ...form,
      id: selectedEmployee?.id || Date.now(),
      employee: form.employee.trim(),
      email: form.email.trim(),
      employeeId: form.employeeId.trim(),
      salary: Number(form.salary),
    };

    if (modalType === "edit") {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === selectedEmployee.id ? record : employee
        )
      );

      // Mark the earlier current record as previous.
      setHistory((previous) => [
        ...previous.map((item) =>
          item.employeeId === record.employeeId && item.status === "Current"
            ? { ...item, status: "Previous" }
            : item
        ),
        {
          ...record,
          id: Date.now(),
          status: "Current",
        },
      ]);
    } else {
      setEmployees((previous) => [...previous, record]);

      setHistory((previous) => [
        ...previous,
        {
          ...record,
          id: Date.now(),
          status: "Current",
        },
      ]);
    }

    closeModal();
  };

  const exportCSV = () => {
    const rows =
      activeTab === "list" ? filteredEmployees : filteredHistory;

    const headers = [
      "Employee",
      "Employee ID",
      "Salary",
      "Frequency",
      "Effective Date",
      "Currency",
      "Status",
    ];

    const csvRows = rows.map((record) => [
      record.employee,
      record.employeeId,
      record.salary,
      record.frequency,
      record.effectiveDate,
      record.currency,
      record.status,
    ]);

    const csv = [headers, ...csvRows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      activeTab === "list" ? "employee-salaries.csv" : "salary-history.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const displayedRecords =
    activeTab === "list" ? filteredEmployees : filteredHistory;

  return (
    <div className="salary-page">
      <button
        className="salary-back-link"
        type="button"
        onClick={() => navigate("/employee-finance")}
      >
        <ArrowLeft size={16} />
        Back to Employee Finance
      </button>

      <div className="salary-breadcrumb">
        HIRENEST <span>/</span> EMPLOYEE FINANCE <span>/</span> SALARY
      </div>

      <div className="salary-header">
        <div>
          <h1>Salary Management</h1>
          <p>Manage employee salaries, revisions, and salary history.</p>
        </div>

        <button className="salary-primary-btn" onClick={openAdd}>
          <Plus size={17} />
          Add Salary
        </button>
      </div>

      <div className="salary-summary-grid">
        <div className="salary-summary-card">
          <div className="salary-summary-icon green">
            <Wallet size={21} />
          </div>
          <div>
            <p>Total Monthly Payroll</p>
            <h2>{money(monthlyPayroll)}</h2>
            <span>Active salary records</span>
          </div>
        </div>

        <div className="salary-summary-card">
          <div className="salary-summary-icon blue">
            <Users size={21} />
          </div>
          <div>
            <p>Salary Records</p>
            <h2>{employees.length}</h2>
            <span>All employee records</span>
          </div>
        </div>

        <div className="salary-summary-card">
          <div className="salary-summary-icon purple">
            <CircleCheck size={21} />
          </div>
          <div>
            <p>Active Records</p>
            <h2>{activeCount}</h2>
            <span>Currently active</span>
          </div>
        </div>

        <div className="salary-summary-card">
          <div className="salary-summary-icon orange">
            <Clock3 size={21} />
          </div>
          <div>
            <p>Inactive Records</p>
            <h2>{inactiveCount}</h2>
            <span>Inactive salary records</span>
          </div>
        </div>
      </div>

      <div className="salary-tabs">
        <button
          className={activeTab === "list" ? "active" : ""}
          onClick={() => setActiveTab("list")}
          type="button"
        >
          Salary List
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
          type="button"
        >
          <History size={15} />
          Salary History
        </button>
      </div>

      <section className="salary-table-card">
        <div className="salary-table-heading">
          <div>
            <h2>
              {activeTab === "list"
                ? "Employee Salary List"
                : "Employee Salary History"}
            </h2>
            <p>
              {activeTab === "list"
                ? `${filteredEmployees.length} records found`
                : `${filteredHistory.length} history records found`}
            </p>
          </div>

          <button
            className="salary-export-btn"
            onClick={exportCSV}
            type="button"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        <div className="salary-filter-bar">
          <div className="salary-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={employmentFilter}
            onChange={(event) => setEmploymentFilter(event.target.value)}
            aria-label="Filter by employment type"
          >
            <option value="All">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
            <option value="Temporary">Temporary</option>
            <option value="Probation">Probation</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="salary-table-wrapper">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Salary</th>
                <th>Effective Date</th>
                {activeTab === "list" && <th>Status</th>}
                {activeTab === "history" && <th>Record</th>}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="salary-employee-cell">
                      <div className="salary-avatar">
                        {record.employee
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>{record.employee}</strong>
                        {activeTab === "list" && (
                          <span>{record.email || "No email provided"}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="salary-employee-code">
                      {record.employeeId}
                    </span>
                  </td>

                  <td className="salary-net-amount">
                    {money(record.salary, record.currency)}
                    <div className="salary-frequency-label">
                      {record.frequency}
                    </div>
                  </td>

                  <td>{dateFormat(record.effectiveDate)}</td>

                  <td>
                    <span
                      className={`salary-status ${
                        activeTab === "history"
                          ? record.status === "Current"
                            ? "active"
                            : "previous"
                          : record.status.toLowerCase()
                      }`}
                    >
                      <span />
                      {record.status}
                    </span>
                  </td>

                  <td>
                    <div className="salary-actions">
                      {activeTab === "list" ? (
                        <>
                          <button
                            type="button"
                            className="salary-action-btn view"
                            title="View salary"
                            onClick={() => openView(record)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="salary-action-btn edit"
                            title="Edit salary"
                            onClick={() => openEdit(record)}
                          >
                            <Pencil size={16} />
                          </button>
                         <button
  type="button"
  className="salary-action-btn delete"
  title="Delete salary"
  aria-label={`Delete salary for ${record.employee}`}
  onClick={() => handleDelete(record.id)}
>
  <Trash2 size={16} />
</button>                </>
                      ) : (
                        <button
                          type="button"
                          className="salary-action-btn view"
                          title="View employee"
                          onClick={() => {
                            const employee = employees.find(
                              (item) =>
                                item.employeeId === record.employeeId
                            );
                            if (employee) openView(employee);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {displayedRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="salary-empty-state">
                    <CalendarDays size={30} />
                    <strong>No records found</strong>
                    <span>Try changing your search or filter options.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="salary-table-footer">
          Showing {displayedRecords.length} records
        </div>
      </section>

      {(modalType === "add" || modalType === "edit") && (
        <div className="salary-modal-overlay" onClick={closeModal}>
          <div
            className="salary-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="salary-modal-header">
              <div>
                <h2>{modalType === "add" ? "Add Salary" : "Edit Salary"}</h2>
                <p>Enter employee salary information.</p>
              </div>

              <button
                className="salary-modal-close"
                onClick={closeModal}
                type="button"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="salary-form-grid">
                <div className="salary-form-group">
                  <label>Employee Name *</label>
                  <input
                    value={form.employee}
                    onChange={(event) =>
                      updateField("employee", event.target.value)
                    }
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                <div className="salary-form-group">
                  <label>Employee ID *</label>
                  <input
                    value={form.employeeId}
                    onChange={(event) =>
                      updateField("employeeId", event.target.value)
                    }
                    placeholder="EMP005"
                    required
                  />
                </div>

                <div className="salary-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="employee@example.com"
                  />
                </div>

                <div className="salary-form-group">
                  <label>Employment Type *</label>
                  <select
                    value={form.employmentType}
                    onChange={(event) =>
                      updateField("employmentType", event.target.value)
                    }
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Intern</option>
                    <option>Temporary</option>
                    <option>Probation</option>
                  </select>
                </div>

                <div className="salary-form-group">
                  <label>Salary *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.salary}
                    onChange={(event) =>
                      updateField("salary", event.target.value)
                    }
                    placeholder="Enter salary"
                    required
                  />
                </div>

                <div className="salary-form-group">
                  <label>Frequency *</label>
                  <select
                    value={form.frequency}
                    onChange={(event) =>
                      updateField("frequency", event.target.value)
                    }
                  >
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Biweekly</option>
                    <option>Yearly</option>
                    <option>Hourly</option>
                  </select>
                </div>

                <div className="salary-form-group">
                  <label>Effective Date *</label>
                  <input
                    type="date"
                    value={form.effectiveDate}
                    onChange={(event) =>
                      updateField("effectiveDate", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="salary-form-group">
                  <label>Currency *</label>
                  <select
                    value={form.currency}
                    onChange={(event) =>
                      updateField("currency", event.target.value)
                    }
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div className="salary-form-group">
                  <label>Status *</label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {error && <p className="salary-form-error">{error}</p>}

              <div className="salary-modal-footer">
                <button
                  type="button"
                  className="salary-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="salary-primary-btn">
                  {modalType === "add" ? "Save Salary" : "Update Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "view" && selectedEmployee && (
        <div className="salary-modal-overlay" onClick={closeModal}>
          <div
            className="salary-modal salary-view-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="salary-modal-header">
              <div>
                <h2>Salary Details</h2>
                <p>{selectedEmployee.employee}</p>
              </div>

              <button
                className="salary-modal-close"
                onClick={closeModal}
                type="button"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="salary-view-amount">
              <span>Salary</span>
              <h2>
                {money(selectedEmployee.salary, selectedEmployee.currency)}
              </h2>
              <span>{selectedEmployee.frequency}</span>
            </div>

            <div className="salary-detail-list">
              {[
                ["Employee ID", selectedEmployee.employeeId],
                ["Employee", selectedEmployee.employee],
                ["Email", selectedEmployee.email || "—"],
                ["Employment Type", selectedEmployee.employmentType],
                [
                  "Salary",
                  money(selectedEmployee.salary, selectedEmployee.currency),
                ],
                ["Frequency", selectedEmployee.frequency],
                ["Effective Date", dateFormat(selectedEmployee.effectiveDate)],
                ["Currency", selectedEmployee.currency],
                ["Status", selectedEmployee.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="salary-modal-footer">
              <button
                type="button"
                className="salary-secondary-btn"
                onClick={closeModal}
              >
                Close
              </button>

              <button
                type="button"
                className="salary-primary-btn"
                onClick={() => openEdit(selectedEmployee)}
              >
                <Pencil size={15} />
                Edit Salary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
