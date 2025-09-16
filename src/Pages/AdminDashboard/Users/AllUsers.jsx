import useUserStore from "../../../Zustand/UsersGet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllUsers() {
  const { users, loading, error, fetchUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const confirmData = users.users || [];
  console.log("All users", confirmData);

  // 🔹 Function to delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;

    try {
      const tokenData = localStorage.getItem("User");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;
      if (!authToken) throw new Error("No auth token found. Please login first.");

      // API call to delete user
      const _id = id; // Ensure the correct ID is used
      const res = await fetch(`https://dbbackend.devnexussolutions.com/auth/api/delete-user/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh users list after delete
      fetchUser();
      alert("User deleted successfully ✅");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting user ❌");
    }
  };

  const handleNavigate = () => {
    navigate("/admin-dashboard/users/add");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNavigate}
            className="px-4 py-2 bg-[var(--primary-color)] cursor-pointer hover:bg-blue-700 text-white font-medium rounded-full transition duration-200"
          >
            Add New
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/upload-excel")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
          >
            Upload Excel File
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading && <p className="text-yellow-600">Loading users...</p>}

      {/* Error */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Users Table */}
      {!loading && !error && confirmData.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">lastLogin</th>
                <th className="py-2 px-4 border">role</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {confirmData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{user._id}</td>
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">{user.lastLogin}</td>
                  <td className="py-2 px-4 border">{user.role}</td>
                  <td className="py-2 px-2 border space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin-dashboard/users/edit/${user._id}`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Users */}
      {!loading && !error && confirmData.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
