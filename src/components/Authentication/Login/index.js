import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";
import "./index.css";

const API_BASE_URL = "http://localhost:8080";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both your email address and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Invalid email or password.");
      }
      if (!data.token) {
        throw new Error("The server did not return an authentication token.");
      }

      // Remove stale details so the previous user is not shown accidentally.
      const keys = ["token", "hirenestToken", "hirenestEmail", "hirenestRole", "hirenestFullName"];
      keys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("hirenestToken", data.token);
      storage.setItem("hirenestEmail", data.email || formData.email.trim());
      storage.setItem("hirenestRole", data.role || "");
      
const loggedInName =
  formData.username?.trim() ||
  data.fullName ||
  data.username ||
  data.email ||
  formData.email.trim();

storage.setItem("hirenestFullName", loggedInName);
storage.setItem(
  "hirenestUsername",
  formData.username?.trim() || ""
);


      // Current backend roles: ADMIN, HR, USER (USER is the candidate account role).
      // They share the current Dashboard component; role-based authorization belongs on the backend.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof TypeError) {
        setError("Cannot connect to the backend. Make sure Spring Boot is running on port 8080.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="background-shape shape-one" />
      <div className="background-shape shape-two" />
      <div className="login-container">
        <section className="visual-panel">
          <div className="brand">
            <div className="brand-logo">H</div>
            <div className="brand-info">
              <strong>HireNest</strong>
              <span>EMPLOYEE MANAGEMENT</span>
            </div>
          </div>
          <div className="visual-message">
            <ShieldCheck size={42} />
            <h1>A better way to manage your people.</h1>
            <p>One secure place for your employee management workflow.</p>
          </div>
          <p className="visual-footer">HIRENEST · EMPLOYEE MANAGEMENT PLATFORM</p>
        </section>

        <section className="login-form-panel">
          <div className="login-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign in to HireNest</h2>
            
          </div>

          <form onSubmit={handleLogin} noValidate>
          {/* Username field - NEW */}
<label htmlFor="username">Username</label>
<div className="input-wrapper">
  <Mail size={18} aria-hidden="true" />
  <input
    id="username"
    name="username"
    type="text"
    autoComplete="username"
    placeholder="Enter your username"
    value={formData.username}
    onChange={handleChange}
  />
</div>


            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your work email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember Me
              </label>
              <button type="button" className="text-link" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </button>
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-security-note"><ShieldCheck size={16} /> Secure access for authorized users only</p>
         
        </section>
      </div>
    </main>
  );
};

export default Login;
