import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

// Sign up form
const SignupForm = ({
  formData,
  setFormData,
  showPassword,
  togglePassword,
  showConfirmPassword,
  toggleConfirmPassword,
  isLoading,
  isNavigating,
  handleSignup
}) => (
  <form className="space-y-4" onSubmit={handleSignup}>
    {/* Email Input */}
    <div>
      <label htmlFor="email" className="block text-size-14 font-medium text-gray-500 mb-2">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="your@email.com"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        required
      />
    </div>
    {/* Password and Confirm Password Fields */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="password" className="block text-size-14 font-medium text-gray-500 mb-2">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50 pr-12 placeholder-gray-400 ${showPassword ? "font-pier" : "font-sans"
              }`}
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        </div>
      </div>
      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-size-14 font-medium text-gray-500 mb-2">Confirm Password</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="••••••••"
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50 pr-12 placeholder-gray-400 ${showConfirmPassword ? "font-pier" : "font-sans"
              }`}
            value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        </div>
         {/* Password mismatch warning */}
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-size-12 mt-1">Passwords do not match</p>
        )}
        {/* <div className="text-right">
          <Link to="/forgot-password" className="text-size-14 text-gray-500 hover:underline font-medium">
            Forgot password?
          </Link>
        </div> */}
      </div>
    </div>
    {/* Submit button which is disabled if something is loading, navigating or passwords unmatched */}
    <button
      type="submit"
      className={`w-full py-3.5 px-4 rounded-xl font-semibold flex justify-center h-12 items-center transition-all duration-200
        ${isLoading || isNavigating || (formData.confirmPassword && formData.password !== formData.confirmPassword)
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-primary text-white hover:bg-white border-primary border-2 hover:text-primary shadow-md"
        }
      `}
      disabled={isLoading || isNavigating || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
          />
          <span>Creating account...</span>
        </>
      ) : (
        "Create account"
      )}
    </button>
  </form>
);

export default SignupForm;