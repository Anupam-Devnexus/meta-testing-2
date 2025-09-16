import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmOtp = () => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.warning("OTP must be 6 digits");
      return;
    }

    // API call or verification logic here
    toast.success("OTP Verified Successfully 🎉");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          Confirm OTP
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOtp;
