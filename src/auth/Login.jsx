import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "", role: "" });
  const [errors, setErrors] = useState({ username: "", password: "", login: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", login: "" }));
  };

  const validate = () => {
    let valid = true;
    const tempErrors = { username: "", password: "", login: "" };

    if (!formData.username.trim()) {
      tempErrors.username = "Email or phone is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.username) && isNaN(formData.username)) {
      tempErrors.username = "Enter a valid email or phone number.";
      valid = false;
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://dbbackend.devnexussolutions.com/auth/api/signin-users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username?.trim(),
            password: formData.password?.trim(),

          }),
        }
      );
   


      const data = await response.json();
      console.log("Backend response:", data);

      if (response.ok && data.token && data.user) {
        const role = data.user.role || "User"; // default role
        const userDetails = {
          id: data.user._id,
          name: data.user.name || "Unknown",
          email: data.user.email || "",
          role: role,
          token: data.token,
        };

        localStorage.setItem("UserDetails", JSON.stringify(userDetails));
        setUser(userDetails);
        console.log(userDetails)
        // Normalize role for routing
        const normalizedRole = role.toLowerCase();
        if (normalizedRole === "admin") {
          navigate("/admin-dashboard"); // match first admin route
        } else if(normalizedRole === "user") {
          navigate("/user-dashboard"); // match first user route
        }
        else{
          navigate("/")
        }
      }
      else {
        setErrors((prev) => ({
          ...prev,
          login: data.msg || data.message || "Invalid credentials",
        }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        login: "Something went wrong. Please try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f0f0] px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">

        {/* Logo Section */}
        <div className="flex items-center justify-center w-full md:w-1/3">
          <img src="/vite.svg" alt="logo" className="h-auto max-h-32 object-contain" />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-semibold text-[#141414]">Login</h2>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Email or Phone</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-b outline-none ${errors.username ? "border-red-500" : "border-[#dcdc3c]"}`}
              placeholder="Enter your email or phone"
            />
            {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-b outline-none ${errors.password ? "border-red-500" : "border-[#dcdc3c]"}`}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-sm text-blue-600 hover:underline cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition duration-300 ${loading ? "bg-gray-400 text-white" : "bg-[#141414] text-white hover:bg-[#dcdc3c] hover:text-black"}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <span
      className="text-blue-600 cursor-pointer hover:underline font-medium"
          
          onClick={()=> navigate('/forgot-password')}>Forget Passowrd</span>

          {/* Login error */}
          {errors.login && <div className="text-red-500 text-sm mt-2">{errors.login}</div>}
        </form>
      </div>
    </div>
  );
}
