import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../../../Zustand/UsersGet";

export default function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { users, loading, error, fetchUser } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    lastLogin: "",
    loginHistory: [],
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (users?.users && userId) {
      const user = users.users.find((u) => u._id === userId);
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          lastLogin: user.lastLogin || "",
          loginHistory: user.loginHistory || [],
        });
      }
    }
  }, [users, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Inline update API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tokenData = localStorage.getItem("User");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;
      if (!authToken) throw new Error("No auth token found. Please login first.");
      const id = userId; // Ensure the correct ID is used
      const res = await fetch(`https://dbbackend.devnexussolutions.com/auth/api/update-user/${id}`, {
        method: "PATCH", // or "PATCH" depending on backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      alert("User updated successfully ✅");
      navigate("/admin-dashboard/users");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating user ❌");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading user data...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600">
        Error loading user data: {error}
      </p>
    );

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit User: {formData.name}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <label className="block">
          <span className="font-semibold text-gray-700">Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
          />
        </label>

        {/* Email */}
        <label className="block">
          <span className="font-semibold text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
        </label>

        {/* Role */}
        <label className="block">
          <span className="font-semibold text-gray-700">Role</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>

        {/* Last Login */}
        <label className="block">
          <span className="font-semibold text-gray-700">Last Login</span>
          <input
            type="text"
            name="lastLogin"
            value={formData.lastLogin}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Last login timestamp"
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>

      {/* Login History */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Login History</h2>
        {formData.loginHistory.length === 0 ? (
          <p className="text-gray-500">No login history available.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Login At
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    IP Address
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.loginHistory.map((login) => (
                  <tr key={login._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDate(login.loginAt)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {login.ip}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {login.userAgent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
