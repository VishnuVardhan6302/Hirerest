import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Mail, LockKeyhole, ShieldCheck } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =================================
  // STEP 1 - REGISTER
  // =================================
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to register. Please try again."
        );
      }

      setSuccess(
        data.message ||
          "OTP has been sent to your email address."
      );

      setStep(2);
    } catch (error) {
      console.error("Registration error:", error);

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

  // =================================
  // STEP 2 - VERIFY OTP
  // =================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid OTP. Please try again."
        );
      }

      setSuccess(
        data.message ||
          "Registration successful. You can now login."
      );

      setStep(3);
    } catch (error) {
      console.error("OTP verification error:", error);

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

  // =================================
  // BACK BUTTON
  // =================================
  const handleBack = () => {
    if (step === 1) {
      navigate("/");
      return;
    }

    if (step === 2) {
      setStep(1);
      setOtp("");
      setError("");
      setSuccess("");
      return;
    }

    navigate("/");
  };

  return (
    <div className="register-page">

      {/* Background decoration */}
      <div className="register-shape register-shape-one"></div>
      <div className="register-shape register-shape-two"></div>
      <div className="register-shape register-shape-three"></div>

      <div className="bg-ring bg-ring-one"></div>
<div className="bg-ring bg-ring-two"></div>
<div className="bg-ring bg-ring-three"></div>

      <div className="register-container">

        {/* LEFT PANEL */}
        <section className="register-visual">

          <div className="register-brand">
            <div className="register-logo">
              H
            </div>

            <div className="register-brand-text">
              <strong>hirenest</strong>
              <span>EMPLOYEE MANAGEMENT</span>
            </div>
          </div>

          <div className="register-circle circle-one"></div>
          <div className="register-circle circle-two"></div>
          <div className="register-circle circle-three"></div>

          <div className="register-visual-content">

            <div className="visual-tag">
              EMPLOYEE MANAGEMENT
            </div>

            <h1>
              Build your
              <br />
              workspace.
            </h1>

            <p>
              Create your Hirenest account and
              manage your employee workspace
              securely.
            </p>

          </div>

          <div className="register-visual-footer">
            <span className="footer-line"></span>

            <span>
              EMPLOYEES • DATA • PROGRESS
            </span>
          </div>

        </section>

        {/* RIGHT PANEL */}
        <section className="register-form-panel">

          <div className="register-card">

            {/* Mobile logo */}
            <div className="register-mobile-brand">

              

              <div className="register-brand-text">
                <strong>hirenest</strong>
                <span>EMPLOYEE MANAGEMENT</span>
              </div>

            </div>

            {/* STEP INDICATOR */}
            {step !== 3 && (
              <div className="register-step-indicator">

                <div
                  className={
                    step >= 1
                      ? "register-step active"
                      : "register-step"
                  }
                >
                  <span>1</span>
                  <small>Register</small>
                </div>

                <div className="register-step-line"></div>

                <div
                  className={
                    step >= 2
                      ? "register-step active"
                      : "register-step"
                  }
                >
                  <span>2</span>
                  <small>Verify</small>
                </div>

              </div>
            )}

            {/* SUCCESS SCREEN */}
            {step === 3 ? (

              <div className="register-success">

                <div className="register-success-icon">
                  ✓
                </div>

                <div className="register-success-label">
                  REGISTRATION COMPLETE
                </div>

                <h2>
                  Welcome to Hirenest!
                </h2>

                <p>
                  Your account has been created
                  successfully. You can now sign in
                  to your employee workspace.
                </p>

                <button
                  className="register-login-button"
                  onClick={() => navigate("/")}
                >
                  Go to Sign in
                  <span>→</span>
                </button>

              </div>

            ) : (

              <>
                {/* STEP 1 */}
                {step === 1 && (

                  <>
                    <button
                      type="button"
                      className="register-back-button"
                      onClick={handleBack}
                    >
                      ← Back to sign in
                    </button>

                    <div className="register-header">

                     

                      <h2>
                        Create your
                        <br />
                        account.
                      </h2>

                      <p>
                        Enter your details to create
                        your Hirenest account.
                      </p>

                    </div>

                    <form onSubmit={handleRegister}>

                      {/* Email */}
                      <div className="register-form-group">

                        <label htmlFor="register-email">
                          Email address
                        </label>

                        <div className="register-input">

                          
                                           <span className="input-icon">
                            <Mail size={18} strokeWidth={2} />
                          </span>

                          <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError("");
                            }}
                            placeholder="Enter your email"
                            autoComplete="email"
                          />

                        </div>

                      </div>

                      {/* Password */}
                      <div className="register-form-group">

                        <label htmlFor="register-password">
                          Password
                        </label>

                        <div className="register-input">

                          
                                         <span className="input-icon">
                            <LockKeyhole size={18} strokeWidth={2} />
                          </span>

                          <input
                            id="register-password"
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            placeholder="Enter password"
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            className="register-show-password"
                            onClick={() =>
                              setShowPassword(
                                (previous) => !previous
                              )
                            }
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>

                        </div>

                      </div>

                      {/* Confirm Password */}
                      <div className="register-form-group">

                        <label htmlFor="register-confirm-password">
                          Confirm password
                        </label>

                        <div className="register-input">

                            <span className="input-icon">
                            <LockKeyhole size={18} strokeWidth={2} />
                          </span>


                          <input
                            id="register-confirm-password"
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(
                                e.target.value
                              );
                              setError("");
                            }}
                            placeholder="Confirm password"
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            className="register-show-password"
                            onClick={() =>
                              setShowConfirmPassword(
                                (previous) => !previous
                              )
                            }
                          >
                            {showConfirmPassword
                              ? "Hide"
                              : "Show"}
                          </button>

                        </div>

                      </div>

                      {/* Error */}
                      {error && (
                        <div className="register-error">
                          <span>!</span>
                          {error}
                        </div>
                      )}

                      {/* Success */}
                      {success && (
                        <div className="register-success-message">
                          <span>✓</span>
                          {success}
                        </div>
                      )}

                      {/* Register Button */}
                      <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="register-spinner"></span>
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create account
                            <span>→</span>
                          </>
                        )}
                      </button>

                    </form>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (

                  <>
                    <button
                      type="button"
                      className="register-back-button"
                      onClick={handleBack}
                    >
                      ← Change email
                    </button>

                    <div className="register-header">

                      <div className="register-label">
                        VERIFY EMAIL
                      </div>

                      <h2>
                        Check your
                        <br />
                        inbox.
                      </h2>

                      <p>
                        We've sent a verification code
                        to <strong>{email}</strong>.
                      </p>

                    </div>

                    <form onSubmit={handleVerifyOtp}>

                      <div className="register-form-group">

                        <label htmlFor="register-otp">
                          Verification code
                        </label>

                        <div className="register-input register-otp-input">

                          <span className="register-input-icon">
                            #
                          </span>

                          <input
                            id="register-otp"
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => {
                              setOtp(
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                )
                              );
                              setError("");
                            }}
                            placeholder="Enter 6-digit OTP"
                          />

                        </div>

                      </div>

                      {error && (
                        <div className="register-error">
                          <span>!</span>
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="register-success-message">
                          <span>✓</span>
                          {success}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="register-spinner"></span>
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify account
                            <span>→</span>
                          </>
                        )}
                      </button>

                    </form>
                  </>
                )}
              </>
            )}

            {/* SECURITY */}
            <div className="register-security">

              <div className="security-icon">
               <ShieldCheck size={20} strokeWidth={2} />
             </div>

              <div>
                <strong>Secure registration</strong>

                <span>
                  Your account information stays protected.
                </span>
              </div>

            </div>

            <div className="register-footer">
              HIRENEST · EMPLOYEE MANAGEMENT PLATFORM
            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Register;