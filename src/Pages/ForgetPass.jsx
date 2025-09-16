import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Replace with your real API
      const response = await fetch(
        "https://dbbackend.devnexussolutions.com/auth/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      if (data.exists) {
        toast.success("✅ User exists! Redirecting...");
        // wait a bit for the toast to show before navigating
        setTimeout(() => navigate("/otp-confirm"), 1500);
      } else {
        toast.error("❌ This email is not registered.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Enter your registered email to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-md transition disabled:opacity-70"
          >
            {loading ? "Checking..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => navigate("/auth/api/signin-users")}
          className="mt-4 text-blue-600 hover:underline font-medium"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ForgetPass;
