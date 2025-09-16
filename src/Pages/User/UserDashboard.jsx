import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  // Grab user from localStorage
  const storedUser = localStorage.getItem("User");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id || !user?.token) {
        setError("Missing user ID or token. Please log in again.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          "https://dbbackend.devnexussolutions.com/auth/api/get-all-users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Find the logged-in user in the response
        const currentUser = data.users?.find((u) => u._id === user.id);

        if (!currentUser) {
          setError("User not found in backend response");
        } else {
          setUserDetails(currentUser);
          localStorage.setItem("UserDetails", JSON.stringify(currentUser));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, user?.token]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        No user data found in localStorage
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading user dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!userDetails) return null;

  const { EmpUsername, email, role, _id, phone, permissions = [] } =
    userDetails;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Dashboard
        </h1>

        {/* Basic Details */}
        <div className="space-y-4 mb-6">
          <Detail label="Name" value={EmpUsername} />
          <Detail label="Email" value={email} />
          <Detail label="Role" value={role} highlight />
          <Detail label="ID" value={_id} small />
          <Detail label="Phone" value={phone} small />
        </div>

        {/* Permissions */}
        <h2 className="text-xl font-semibold mb-2">Allowed Routes</h2>
        {permissions.length > 0 ? (
          <ul className="space-y-2">
            {permissions.map((perm) => (
              <li
                key={perm._id}
                className="p-3 cursor-pointer bg-gray-50 rounded-lg border flex justify-between hover:bg-gray-100"
                onClick={() => navigate(perm.path)}
              >
                <span className="font-medium text-gray-700">
                  {perm.label || "Unnamed"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No permissions found</p>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, highlight = false, small = false }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span
        className={`${
          highlight ? "capitalize text-blue-600 font-semibold" : "text-gray-900"
        } ${small ? "text-sm break-all" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
