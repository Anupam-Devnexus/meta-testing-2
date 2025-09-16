import React, { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch("https://dbbackend.devnexussolutions.com/auth/api/get-all-leads", {
      method: "GET",
      credentials: "include", // send session cookie
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("API Response:", res);
        if (res.success && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.warn("Unexpected or unauthorized response", res);
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setData([]);
      });
  }, []);

  const handleSave = (id) => {
    const updated = data.find((item) => item._id === id);

    fetch(`/api/update-user-data/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: updated.status,
        remarks: updated.remarks,
      }),
    })
      .then((res) => res.json())
      .then(() => setEditing(null))
      .catch((err) => console.error(err));
  };

  const handleChange = (id, key, value) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [key]: value } : item
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Assigned Leads</h2>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Remarks</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800 flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  {item.name}
                  {item.linkedin && (
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-blue-600 ml-2" />
                    </a>
                  )}
                </td>

                <td className="px-5 py-3 text-gray-700">{item.email}</td>

                <td className="px-5 py-3">
                  {editing === item._id ? (
                    <select
                      className="border px-2 py-1 rounded w-full"
                      value={item.status}
                      onChange={(e) =>
                        handleChange(item._id, "status", e.target.value)
                      }
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Closed"
                          ? "bg-green-100 text-green-800"
                          : item.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </td>

                <td className="px-5 py-3 text-gray-700">
                  {editing === item._id ? (
                    <input
                      type="text"
                      className="border px-2 py-1 w-full rounded"
                      value={item.remarks}
                      onChange={(e) =>
                        handleChange(item._id, "remarks", e.target.value)
                      }
                    />
                  ) : (
                    item.remarks || "-"
                  )}
                </td>

                <td className="px-5 py-3">
                  {editing === item._id ? (
                    <button
                      onClick={() => handleSave(item._id)}
                      className="bg-green-500 text-white text-sm px-4 py-1.5 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditing(item._id)}
                      className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-5 text-center text-gray-500">
                  No assigned data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (static for now) */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Rows per page: <span className="font-medium">10</span>
        </div>
        <div>
          Page <span className="font-medium">1</span> of{" "}
          <span className="font-medium">50</span>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
