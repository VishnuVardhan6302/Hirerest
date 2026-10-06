import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Mail, LockKeyhole, ShieldCheck } from "lucide-react";
// Backend API Base URL
const API_BASE_URL = "http://localhost:8080";

const Login = () => {
  const navigate = useNavigate();

  // Login form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle email/password input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Login API
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Email validation
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Password validation
    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Call backend Login API
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      // Read response
      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // Backend returned error
      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email or password."
        );
      }

      // Check JWT token
      if (!data.token) {
        throw new Error(
          "Login successful, but authentication token was not received."
        );
      }

      /*
        Store authentication details.

        Remember Me checked:
        localStorage

        Remember Me not checked:
        sessionStorage
      */// Clear previous authentication data
localStorage.removeItem("token");
localStorage.removeItem("hirenestToken");
localStorage.removeItem("hirenestEmail");
localStorage.removeItem("hirenestRole");

sessionStorage.removeItem("token");
sessionStorage.removeItem("hirenestToken");
sessionStorage.removeItem("hirenestEmail");
sessionStorage.removeItem("hirenestRole");

// Choose storage based on Remember Me
const storage = rememberMe
  ? localStorage
  : sessionStorage;

// Store JWT token
storage.setItem("token", data.token);
storage.setItem("hirenestToken", data.token);

// Store email
storage.setItem(
  "hirenestEmail",
  data.email || formData.email
);

// Store role
storage.setItem(
  "hirenestRole",
  data.role || ""
);

      // Login successful
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      // Backend cannot be reached
      if (error.name === "TypeError") {
        setError(
          "Unable to connect to the authentication server."
        );
      } else {
        setError(
          error.message ||
            "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">

      {/* Decorative background */}

      <div className="background-shape shape-one"></div>
      <div className="background-shape shape-two"></div>
      <div className="background-shape shape-three"></div>
     
     <div className="bg-ring bg-ring-one"></div>
<div className="bg-ring bg-ring-two"></div>
<div className="bg-ring bg-ring-three"></div>

      {/* Main Login Container */}

      <div className="login-container">


        {/* =================================
            LEFT VISUAL PANEL
        ================================= */}

        <section className="visual-panel">

          {/* Decorative rings */}

          <div className="ring ring-one"></div>
          <div className="ring ring-two"></div>
          <div className="ring ring-three"></div>
 
 
          <div className="visual-top">

            <div className="brand">

              <div className="brand-logo">
                H
              </div>

              <div className="brand-info">

                <strong>
                  HireNest
                </strong>

                <span>
                  EMPLOYEE MANAGEMENT
                </span>

              </div>

            </div>

          </div>


          {/* Abstract design */}

          <div className="abstract-art">

            <div className="art-line line-one"></div>
            <div className="art-line line-two"></div>
            <div className="art-line line-three"></div>
            <div className="art-line line-four"></div>

            <div className="art-dot dot-one"></div>
            <div className="art-dot dot-two"></div>
            <div className="art-dot dot-three"></div>

          </div>


          <div className="visual-message">

            <span>
              EMPLOYEE MANAGEMENT
            </span>

            <h1>
              Manage your
              <br />
              people.
            </h1>

            <p>
              One workspace to manage employees,
              employment details and organizational data.
            </p>

          </div>


          <div className="visual-bottom">

            <div className="bottom-line"></div>

            <span>
              EMPLOYEES • DATA • PROGRESS
            </span>

          </div>

        </section>


        {/* =================================
            RIGHT LOGIN CARD
        ================================= */}

        <section className="login-panel">

          <div className="login-card">


            {/* Mobile logo */}

            <div className="mobile-brand">


              <div className="brand-info">

                <strong>
                  HireNest
                </strong>

                <span>
                  EMPLOYEE MANAGEMENT
                </span>

              </div>

            </div>


            {/* Heading */}

            <div className="login-header">

              <div className="login-label">
                SIGN IN
              </div>

              <h2>
                Welcome back!
              </h2>

              <p>
                Sign in to continue to your
                Hirenest employee workspace.
              </p>

            </div>


            {/* Form */}

            <form onSubmit={handleLogin}>


              {/* Email */}

              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                 <span className="input-icon">
  <Mail size={18} strokeWidth={2} />
</span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* Password */}

              <div className="form-group">

                <div className="label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-button"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="input-wrapper">

               <span className="input-icon">
  <LockKeyhole size={18} strokeWidth={2} />
</span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* Error */}

              {error && (
                <div className="error-message">

                  <span className="error-icon">
                    !
                  </span>

                  <span>
                    {error}
                  </span>

                </div>
              )}


              {/* Remember Me */}

              <div className="form-options">

                <label className="remember">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  <span className="check-box"></span>

                  <span>
                    Remember me
                  </span>

                </label>

              </div>


              {/* Login Button */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <span className="button-arrow">
                      →
                    </span>
                  </>
                )}

              </button>
            
            <div className="register-link">
  <span>Don't have an account?</span>

  <button
    type="button"
    onClick={() => navigate("/register")}
  >
    Create account
  </button>
</div>
            </form>


            {/* Security */}

            <div className="security">

              <div className="security-icon">
  <ShieldCheck size={20} strokeWidth={2} />
</div>

              <div>

                <strong>
                  Secure login
                </strong>

                <span>
                  Your information is protected.
                </span>

              </div>

            </div>


            <div className="login-footer">
              HIRENEST · EMPLOYEE MANAGEMENT PLATFORM
            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Login;