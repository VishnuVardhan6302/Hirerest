import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  GraduationCap,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Clock3,
} from "lucide-react";
import "./index.css";

const financeModules = [
  {
    title: "Salary",
    description:
      "Manage employee salaries, monthly payments, revisions, and salary history.",
    icon: Wallet,
    status: "Available",
    path: "/employee-finance/salary",
    available: true,
  },
  {
  title: "Stipend",
  description:
    "Manage intern stipends, monthly payments, and stipend history.",
  icon: GraduationCap,
  status: "Available",
  path: "/employee-finance/stipend",
  available: true,
},
 {
  title: "Bank Details",
  description:
    "Maintain employee bank accounts, payment details, and verification status.",
  icon: Landmark,
  status: "Available",
  path: "/employee-finance/bank-details",
  available: true,
},
  
{
  title: "PF & UAN",
  description:
    "Manage provident fund information, UAN records, and employee PF details.",
  icon: ShieldCheck,
  status: "Available",
  path: "/employee-finance/pf-uan",
  available: true,
},

];

export default function EmployeeFinance() {
  const navigate = useNavigate();

  return (
    <div className="employee-finance-page">
      {/* Page navigation */}
      <button
        type="button"
        className="finance-back-button"
        onClick={() => navigate("/employees")}
      >
        <ArrowLeft size={17} />
        <span>Back to Employees</span>
      </button>

      {/* Page heading */}
      <header className="finance-page-header">
        

        <h1>Employee Finance</h1>

        <p>
          Manage salaries, stipends, bank details, and provident fund
          records in one place.
        </p>
      </header>


      {/* Module heading */}
      <div className="finance-section-header">
        <div>
          <h2>Finance Modules</h2>
          <p>Select a module to get started.</p>
        </div>

        <span className="finance-module-count">
          {financeModules.length} modules
        </span>
      </div>

      {/* Module cards */}
      <section className="finance-modules-grid">
        {financeModules.map((module) => {
          const Icon = module.icon;

          return (
            <article
              className="finance-module-card"
              key={module.title}
            >
              <div className="finance-card-top">
                <div className="finance-card-icon">
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                <span
                  className={`finance-status ${
                    module.available ? "available" : "coming-soon"
                  }`}
                >
                  {module.available ? (
                    <span className="finance-status-dot" />
                  ) : (
                    <Clock3 size={12} />
                  )}

                  {module.status}
                </span>
              </div>

              <h3>{module.title}</h3>

              <p>{module.description}</p>

              <button
                type="button"
                className={`finance-module-action ${
                  module.available ? "primary" : "disabled"
                }`}
                disabled={!module.available}
                onClick={() => {
                  if (module.path) navigate(module.path);
                }}
              >
                {module.available ? "Open Module" : "Coming Soon"}

                {module.available && <ArrowRight size={16} />}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}