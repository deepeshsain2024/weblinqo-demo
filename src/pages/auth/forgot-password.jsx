import React, { useState, useEffect, useRef } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logos/logo-icon.png";
import api from "../../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = new password, 4 = success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const resendIntervalId = useRef(null);

  useEffect(() => {
    return () => {
      if (resendIntervalId.current) clearInterval(resendIntervalId.current);
    };
  }, []);

  // OTP countdown timer
  const startResendTimer = () => {
    setResendDisabled(true);
    let timer = 30;
    setResendTimer(timer);

    if (resendIntervalId.current) clearInterval(resendIntervalId.current);

    resendIntervalId.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendIntervalId.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // show temporary success message
  const showSuccess = (message, duration = 3000) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), duration);
  };

  // send otp to email handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await api.post(`/api/v1/auth/forgot-password`, { email });
      showSuccess("OTP sent to your email");
      setStep(2);
      startResendTimer();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // verify otp
  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (step === 2) {
      if (otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      setStep(3);
      return;
    }

    // Step 3 - Handle password reset
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/api/v1/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (response.data.status === "SUCCESS") {
        showSuccess("Password reset successful!");
        setStep(4);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset OTP handler
  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await api.post(`/api/v1/auth/resend`, {
        email,
        purpose: "PASSWORD_RESET",
      });
      showSuccess("New OTP sent to your email");
      startResendTimer();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center px-4 py-5 w-full">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="flex justify-center items-center gap-3 mb-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:opacity-90 transition-opacity"
            >
              <span
                className="text-black p-2 rounded-lg"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={logo}
                  alt="weblinqo Logo"
                  className="h-14 object-contain"
                />
              </span>
              {/* <span className="font-extrabold text-black">weblinqo</span> */}
            </Link>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Back button for steps 2 and 3 */}
            {(step === 2 || step === 3) && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center text-gray-500 hover:text-gray-700 p-6 pb-0"
              >
                <AiOutlineArrowLeft className="mr-1.5" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            <div className="p-6">
              {/* Message Container */}
              <div className="mb-6 space-y-3">
                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-[#e8f5d0] border border-primary text-[#2a5a00] rounded-lg flex items-start text-sm">
                        <svg
                          className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{success}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-[#ffebee] border border-[#ff6b6b] text-[#c62828] rounded-lg flex items-start text-sm">
                        <svg
                          className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* step 1 sending email  */}
              {step === 1 && (
                <>
                  <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Reset your password
                    </h1>
                    <p className="text-gray-600">
                      Enter your email to receive a verification code
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSendOtp}>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-size-14 font-medium text-gray-500 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3.5 px-4 rounded-xl font-semibold flex justify-center items-center transition-all duration-200 ${
                        isLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary hover:scale-[1.02] active:scale-95 shadow-md"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* step 2 updating otp by email  */}
              {step === 2 && (
                <>
                  <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Enter verification code
                    </h1>
                    <p className="text-gray-600">
                      Sent to{" "}
                      <span className="font-medium text-gray-800">{email}</span>
                    </p>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={handleVerifyOtpAndReset}
                  >
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        6-digit code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="• • • • • •"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50 text-center tracking-[0.5em] text-lg${
                          otp.length === 0 ? " font-sans" : ""
                        }`}
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setOtp(value.slice(0, 6));
                        }}
                        required
                        maxLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3.5 px-4 rounded-xl font-semibold flex justify-center items-center transition-all duration-200 ${
                        isLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary hover:scale-[1.02] active:scale-95 shadow-md"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                          />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Didn't receive a code?{" "}
                    <button
                      onClick={handleResendOtp}
                      disabled={resendDisabled || isLoading}
                      className={`font-medium ${
                        resendDisabled || isLoading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-primary hover:underline"
                      }`}
                    >
                      {resendDisabled
                        ? `Resend in ${resendTimer}s`
                        : "Resend code"}
                    </button>
                  </div>
                </>
              )}

              {/* step 3 changing password  */}
              {step === 3 && (
                <>
                  <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Create new password
                    </h1>
                    <p className="text-gray-600">
                      Your new password must be different from previous ones
                    </p>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={handleVerifyOtpAndReset}
                  >
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder="At least 8 characters"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50 font-sans placeholder-gray-400"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength="8"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50 font-sans placeholder-gray-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="8"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3.5 px-4 rounded-xl font-semibold flex justify-center items-center transition-all duration-200 ${
                        isLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary text-black hover:bg-primary hover:scale-[1.02] active:scale-95 shadow-md"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                          />
                          <span>Resetting...</span>
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>
                </>
              )}

              {/*  update confirmation container */}
              {step === 4 && (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-[#e8f5d0] border-2 border-primary rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-[#2a5a00]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Password Updated
                    </h1>
                    <p className="text-gray-600">
                      Your password has been changed successfully
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-black hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
