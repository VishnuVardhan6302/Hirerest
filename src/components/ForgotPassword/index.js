import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const API_BASE_URL = "http://localhost:8080";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =====================================================
     STEP 1 - SEND OTP
  ===================================================== */

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send verification code."
        );
      }

      setMessage(
        data.message ||
          "Verification code sent to your email."
      );

      setStep(2);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     STEP 2 - VERIFY OTP
  ===================================================== */

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-forgot-password`,
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid verification code."
        );
      }

      setResetToken(data.resetToken || "");

      setMessage(
        data.message ||
          "Verification successful."
      );

      setStep(3);
    } catch (err) {
      setError(
        err.message ||
          "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     STEP 3 - RESET PASSWORD
  ===================================================== */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            resetToken,
            newPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setMessage(
        data.message ||
          "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     STEP INDICATOR
  ===================================================== */

  const StepIndicator = () => (
    <div className="forgot-step-indicator">

      <div
        className={`forgot-step ${
          step >= 1 ? "active" : ""
        }`}
      >
        <div className="forgot-step-circle">
          1
        </div>

        <span>Email</span>
      </div>

      <div className="forgot-step-line"></div>

      <div
        className={`forgot-step ${
          step >= 2 ? "active" : ""
        }`}
      >
        <div className="forgot-step-circle">
          2
        </div>

        <span>Verify</span>
      </div>

      <div className="forgot-step-line"></div>

      <div
        className={`forgot-step ${
          step >= 3 ? "active" : ""
        }`}
      >
        <div className="forgot-step-circle">
          3
        </div>

        <span>Reset</span>
      </div>

    </div>
  );

  return (
    <div className="forgot-page">

      {/* =================================================
          OUTER BACKGROUND
      ================================================= */}

      <div className="forgot-bg-circle forgot-bg-one"></div>
      <div className="forgot-bg-circle forgot-bg-two"></div>
      <div className="forgot-bg-circle forgot-bg-three"></div>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="forgot-container">

        {/* =================================================
            LEFT PANEL
        ================================================= */}

        <section className="forgot-visual">

          <div className="forgot-visual-glow"></div>

          {/* Brand */}

          <div className="forgot-brand">

            <div className="forgot-brand-logo">
              H
            </div>

            <div className="forgot-brand-text">
              <strong>hirenest</strong>
              <span>
                EMPLOYEE MANAGEMENT
              </span>
            </div>

          </div>

          {/* Animated rings */}

          <div className="forgot-visual-ring ring-one"></div>
          <div className="forgot-visual-ring ring-two"></div>
          <div className="forgot-visual-ring ring-three"></div>

          {/* Decorative circles */}

          <div className="forgot-floating-circle circle-one"></div>
          <div className="forgot-floating-circle circle-two"></div>
          <div className="forgot-floating-circle circle-three"></div>

          {/* Abstract lock illustration */}

          <div className="forgot-illustration">

            <div className="glass-card glass-card-back"></div>

            <div className="glass-card glass-card-middle">
              <div className="glass-lock-small">
                ✉
              </div>
            </div>

            <div className="glass-card glass-card-main">

              <div className="lock-shackle">
              </div>

              <div className="lock-body">
                <span></span>
              </div>

              <div className="glass-lines">
                <i></i>
                <i></i>
                <i></i>
              </div>

            </div>

          </div>

          {/* Left content */}

          <div className="forgot-visual-content">

            <div className="visual-line"></div>

            <span className="visual-label">
              EMPLOYEE MANAGEMENT
            </span>

            <h1>
              Secure your
              <br />
              workspace.
            </h1>

            <p>
              Reset your password securely and get back
              to managing your employee information.
            </p>

            <div className="forgot-benefits">

              <div className="forgot-benefit">
                <div className="benefit-icon">
                  🔒
                </div>

                <div>
                  <strong>Secure</strong>
                  <span>
                    Your data stays protected
                  </span>
                </div>
              </div>

              <div className="forgot-benefit">
                <div className="benefit-icon">
                  ⚡
                </div>

                <div>
                  <strong>Simple</strong>
                  <span>
                    Quick and easy recovery
                  </span>
                </div>
              </div>

              <div className="forgot-benefit">
                <div className="benefit-icon">
                  🛡
                </div>

                <div>
                  <strong>Private</strong>
                  <span>
                    Only you can access your account
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="forgot-visual-footer">
            <span className="footer-line"></span>
            EMPLOYEES · DATA · PROGRESS
          </div>

        </section>

        {/* =================================================
            RIGHT PANEL
        ================================================= */}

        <section className="forgot-form-panel">

          <div className="forgot-card">

            {/* Step indicator */}

            <StepIndicator />

            {/* Back */}

            <button
              type="button"
              className="forgot-back"
              onClick={() => navigate("/login")}
            >
              <span>←</span>
              Back to sign in
            </button>

            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (
              <>
                <div className="forgot-header">

                  <div className="forgot-header-label">
                    PASSWORD RECOVERY
                  </div>

                  <h2>
                    Forgot your
                    <br />
                    password?
                  </h2>

                  <p>
                    Enter your registered email address and
                    we'll send you a verification code.
                  </p>

                </div>

                <form onSubmit={handleSendOtp}>

                  <div className="forgot-form-group">

                    <label>
                      Email address
                    </label>

                    <div className="forgot-input">

                      <span className="forgot-input-icon">
                        ✉
                      </span>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                      />

                    </div>

                  </div>

                  {error && (
                    <div className="forgot-error">
                      <span>!</span>
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="forgot-success">
                      ✓ {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="forgot-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="forgot-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send verification code
                        <span>→</span>
                      </>
                    )}
                  </button>

                </form>

                <div className="forgot-security">

                  <div className="forgot-security-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Secure account recovery
                    </strong>

                    <span>
                      Your account information stays protected.
                    </span>
                  </div>

                </div>
              </>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (
              <>
                <div className="forgot-header">

                  <div className="forgot-header-label">
                    VERIFY EMAIL
                  </div>

                  <h2>
                    Verify your
                    <br />
                    email.
                  </h2>

                  <p>
                    Enter the verification code sent to
                    your registered email address.
                  </p>

                </div>

                <form onSubmit={handleVerifyOtp}>

                  <div className="forgot-form-group">

                    <label>
                      Verification code
                    </label>

                    <div className="forgot-input">

                      <span className="forgot-input-icon">
                        #
                      </span>

                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        placeholder="Enter verification code"
                        maxLength={6}
                      />

                    </div>

                  </div>

                  {error && (
                    <div className="forgot-error">
                      <span>!</span>
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="forgot-success">
                      ✓ {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="forgot-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="forgot-spinner"></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify code
                        <span>→</span>
                      </>
                    )}
                  </button>

                </form>

                <div className="forgot-security">

                  <div className="forgot-security-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Verification protected
                    </strong>

                    <span>
                      Your verification code is secure.
                    </span>
                  </div>

                </div>
              </>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {step === 3 && (
              <>
                <div className="forgot-header">

                  <div className="forgot-header-label">
                    NEW PASSWORD
                  </div>

                  <h2>
                    Create a new
                    <br />
                    password.
                  </h2>

                  <p>
                    Choose a new password for your Hirenest
                    account.
                  </p>

                </div>

                <form onSubmit={handleResetPassword}>

                  <div className="forgot-form-group">

                    <label>
                      New password
                    </label>

                    <div className="forgot-input">

                      <span className="forgot-input-icon">
                        •••
                      </span>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        className="forgot-show"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>

                    </div>

                  </div>

                  <div className="forgot-form-group">

                    <label>
                      Confirm password
                    </label>

                    <div className="forgot-input">

                      <span className="forgot-input-icon">
                        •••
                      </span>

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        className="forgot-show"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>

                    </div>

                  </div>

                  {error && (
                    <div className="forgot-error">
                      <span>!</span>
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="forgot-success">
                      ✓ {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="forgot-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="forgot-spinner"></span>
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset password
                        <span>→</span>
                      </>
                    )}
                  </button>

                </form>

                <div className="forgot-security">

                  <div className="forgot-security-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Secure password reset
                    </strong>

                    <span>
                      Your new password will be protected.
                    </span>
                  </div>

                </div>
              </>
            )}

            <div className="forgot-footer">
              HIRENEST · EMPLOYEE MANAGEMENT PLATFORM
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default ForgotPassword;