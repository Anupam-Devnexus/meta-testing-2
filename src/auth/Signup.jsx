import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setFormErrors({ ...formErrors, [id]: "" }); // clear on change
  };

  // Validate form data
  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      postData(formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Admin",
      });
    }
  };

  // Mock post function (replace with real API)
 const postData = async (data) => {
  try {
    const response = await axios.post("https://dbbackend.devnexussolutions.com/auth/api/signup-users", data);

    if (response.status === 201) {
      alert("Admin registered successfully!");
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Admin",
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      setFormErrors({ email: "Email already exists" });
    } else {
      alert("Something went wrong. Please try again later.");
    }
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[var(--primary-color)]">
          Admin Signup
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`p-2 border rounded-md outline-none ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.name && <span className="text-red-500 text-sm">{formErrors.name}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`p-2 border rounded-md outline-none ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              className={`p-2 border rounded-md outline-none ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.password && (
              <span className="text-red-500 text-sm">{formErrors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`p-2 border rounded-md outline-none ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.confirmPassword && (
              <span className="text-red-500 text-sm">{formErrors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white font-semibold rounded-md transition"
          >
            Create Admin Account
          </button>

          {/* Optional: success message */}
          {submitted && (
            <p className="text-green-600 text-center font-medium mt-2">
              Admin account created successfully!
            </p>
          )}
        </form>
        <button
        onClick={()=>navigate('/')}
            type="submit"
            className="w-full py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white font-semibold rounded-md transition"
          >
           Back to Login
          </button>
      </div>
      
    </div>
  );
}
