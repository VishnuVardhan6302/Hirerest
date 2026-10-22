import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Pencil, Trash2, X, Download, Wallet, Users, History, Eye } from "lucide-react";
import "./index.css";
const API_BASE = "http://localhost:8080/api";
const getToken = () => localStorage.getItem("hirenestToken") || sessionStorage.getItem("hirenestToken") || localStorage.getItem("token") || sessionStorage.getItem("token");
async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    const body = await response.text();
    let message = body;
    try { const parsed = JSON.parse(body); message = parsed.message || parsed.error || body; } catch { /* non-JSON response */ }
    if (response.status === 401) message = "Please log in again.";
    if (response.status === 403) message = "You do not have permission for this action.";
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}
const formatMoney = (value, currency = "INR") => {
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value) || 0); }
  catch { return `${currency} ${value}`; }
};
const exportCsv = (filename, headers, rows) => {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(row => row.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
};

const emptyForm = { employeeId: "", salary: "", frequency: "MONTHLY", effectiveDate: "", currency: "INR" };
const sortRecords = (items) => [...items].sort((a,b) => String(b.effectiveDate).localeCompare(String(a.effectiveDate)) || b.id-a.id);
export default function Salary() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("current");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const load = useCallback(async () => {
    try { setLoading(true); setError(""); const data = await api("/salary"); setRecords(Array.isArray(data) ? data : []); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const current = useMemo(() => {
    const byEmployee = new Map();
    for (const r of sortRecords(records)) if (!byEmployee.has(r.employeeId)) byEmployee.set(r.employeeId, r);
    return [...byEmployee.values()];
  }, [records]);
  const shown = useMemo(() => (tab === "current" ? current : sortRecords(records)).filter(r => String(r.employeeId || "").toLowerCase().includes(search.trim().toLowerCase())), [tab, current, records, search]);
  const monthlyPayroll = current.reduce((sum,r) => sum + (r.currency === "INR" ? Number(r.salary || 0) * (String(r.frequency).toUpperCase() === "YEARLY" ? 1/12 : 1) : 0), 0);
  const openAdd = () => { setSelected(null); setForm(emptyForm); setFormError(""); setModal("add"); };
  const openEdit = (r) => { setSelected(r); setForm({ employeeId:r.employeeId, salary:String(r.salary), frequency:r.frequency, effectiveDate:r.effectiveDate, currency:r.currency }); setFormError(""); setModal("edit"); };
  const close = () => { if (!busy) { setModal(""); setSelected(null); } };
  const save = async (e) => {
    e.preventDefault(); setFormError("");
    if (!form.employeeId.trim() || !(Number(form.salary) > 0) || !form.effectiveDate || !form.currency.trim()) { setFormError("Complete all required fields with a valid salary amount."); return; }
    const payload = { employeeId: form.employeeId.trim(), salary: Number(form.salary), frequency: form.frequency, effectiveDate: form.effectiveDate, currency: form.currency.trim().toUpperCase() };
    try { setBusy(true); await api(modal === "edit" ? `/salary/${selected.id}` : "/salary", { method: modal === "edit" ? "PUT" : "POST", body: JSON.stringify(payload) }); setModal(""); await load(); }
    catch(e) { setFormError(e.message); } finally { setBusy(false); }
  };
  const remove = async (r) => {
    if (!window.confirm(`Delete salary record #${r.id} for ${r.employeeId}? Only Admin can delete.`)) return;
    try { setBusy(true); await api(`/salary/${r.id}`, { method:"DELETE" }); await load(); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  };
  return <div className="salary-page">
    <button className="salary-back-link" onClick={() => navigate("/employee-finance")}><ArrowLeft size={16}/> Back to Employee Finance</button>
    <div className="salary-breadcrumb">HIRENEST / EMPLOYEE FINANCE / SALARY</div>
    <div className="salary-header"><div><h1>Salary Management</h1><p>Manage employee salaries, revisions, and salary history.</p></div><button className="salary-primary-btn" onClick={openAdd}><Plus size={16}/> Add Salary</button></div>
    <div className="salary-summary-grid">
      <div className="salary-summary-card"><div className="salary-summary-icon green"><Wallet/></div><div><p>Estimated Monthly Payroll (INR)</p><h2>{formatMoney(monthlyPayroll)}</h2><span>Current salary records</span></div></div>
      <div className="salary-summary-card"><div className="salary-summary-icon blue"><Users/></div><div><p>Employees with Salary</p><h2>{current.length}</h2><span>Unique employee IDs</span></div></div>
      <div className="salary-summary-card"><div className="salary-summary-icon purple"><Wallet/></div><div><p>Salary Records</p><h2>{records.length}</h2><span>All revisions</span></div></div>
      <div className="salary-summary-card"><div className="salary-summary-icon orange"><History/></div><div><p>Previous Records</p><h2>{records.length-current.length}</h2><span>Historical revisions</span></div></div>
    </div>
    <div className="salary-tabs"><button className={tab==="current"?"active":""} onClick={()=>setTab("current")}>Salary List</button><button className={tab==="history"?"active":""} onClick={()=>setTab("history")}><History size={15}/> Salary History</button></div>
    <section className="salary-table-card"><div className="salary-table-heading"><div><h2>{tab==="current"?"Current Salaries":"All Salary Records"}</h2><p>Data loaded from Spring Boot</p></div><button className="salary-export-btn" onClick={()=>exportCsv("salary-records.csv",["Record ID","Employee ID","Salary","Frequency","Effective Date","Currency"],shown.map(r=>[r.id,r.employeeId,r.salary,r.frequency,r.effectiveDate,r.currency]))}><Download size={15}/> Export CSV</button></div>
      <div className="salary-filter-bar"><div className="salary-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search employee ID..."/></div><button className="salary-secondary-btn" onClick={load}>Refresh</button></div>
      {error && <p role="alert" style={{color:"#b91c1c",padding:"0 20px"}}>{error}</p>}
      <div className="salary-table-wrapper"><table className="salary-table"><thead><tr><th>RECORD ID</th><th>EMPLOYEE ID</th><th>SALARY</th><th>FREQUENCY</th><th>EFFECTIVE DATE</th><th>CURRENCY</th><th>ACTIONS</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="7">Loading salaries...</td></tr> : shown.length===0 ? <tr><td colSpan="7">No salary records found.</td></tr> : shown.map(r=><tr key={r.id}><td>#{r.id}</td><td><span className="salary-employee-code">{r.employeeId}</span></td><td className="salary-net-amount">{formatMoney(r.salary,r.currency)}</td><td>{r.frequency}</td><td>{r.effectiveDate}</td><td>{r.currency}</td><td><div className="salary-actions"><button className="salary-action-btn edit" title="Edit" onClick={()=>openEdit(r)}><Pencil size={15}/></button><button className="salary-action-btn view" title="View" onClick={()=>{setSelected(r);setModal("view");}}><Eye size={15}/></button><button className="salary-action-btn" title="Delete (Admin only)" disabled={busy} onClick={()=>remove(r)}><Trash2 size={15}/></button></div></td></tr>)}
      </tbody></table></div><div className="salary-table-footer">Showing {shown.length} record(s)</div></section>
    {modal && <div className="salary-modal-overlay" style={{alignItems:"center",justifyContent:"center"}} onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><div style={{background:"white",borderRadius:12,padding:24,width:"min(520px,100%)",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 15px 40px #0002"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h2 style={{margin:0}}>{modal==="view"?"Salary Details":modal==="edit"?"Edit Salary":"Add Salary"}</h2><button onClick={close} style={{border:0,background:"transparent",cursor:"pointer"}}><X/></button></div>
    {modal==="view" ? <div>{["id","employeeId","salary","frequency","effectiveDate","currency"].map(k=><p key={k}><strong>{k}:</strong> {selected?.[k]}</p>)}</div> : <form onSubmit={save} style={{display:"grid",gap:12}}>{[["employeeId","Employee ID","text"],["salary","Salary Amount","number"],["effectiveDate","Effective Date","date"],["currency","Currency","text"]].map(([k,label,type])=><label key={k} style={{display:"grid",gap:5}}>{label}<input required type={type} min={type==="number"?"0.01":undefined} step={type==="number"?"0.01":undefined} value={form[k]} disabled={busy || (modal==="edit" && k==="employeeId")} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{padding:10,border:"1px solid #cbd5d1",borderRadius:7}}/></label>)}<label style={{display:"grid",gap:5}}>Frequency<select value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))} style={{padding:10,border:"1px solid #cbd5d1",borderRadius:7}}><option value="MONTHLY">MONTHLY</option><option value="YEARLY">YEARLY</option></select></label>{formError && <p role="alert" style={{color:"#b91c1c"}}>{formError}</p>}<div style={{display:"flex",justifyContent:"flex-end",gap:10}}><button type="button" className="salary-secondary-btn" onClick={close}>Cancel</button><button type="submit" className="salary-primary-btn" disabled={busy}>{busy?"Saving...":"Save Salary"}</button></div></form>}
    </div></div>}
  </div>;
}
