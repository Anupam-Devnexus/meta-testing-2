import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useLeadStore from "../../../Zustand/LeadsGet";
import useUserStore from "../../../Zustand/UsersGet";

export default function EditMannualLeads() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, fetchData } = useLeadStore();
  const { users, fetchUser } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    requirement: "",
    assignedTo: "",
    assignedDate: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  useEffect(() => {
    if (data?.leads) {
      const lead = data.leads.find((l) => l._id === leadId);
      if (lead) {
        setFormData({
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          city: lead.city || "",
          requirement: lead.requirement || "",
          assignedTo: lead.assignedTo || "",
          assignedDate: lead.assignedDate ? lead.assignedDate.slice(0, 10) : "",
          status: lead.status || "",
        });
      }
    }
  }, [data, leadId]);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-20 text-lg font-medium">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 mt-20 text-lg font-medium">
        Error: {error}
      </p>
    );

  const adminUsers =
    users?.users?.filter((user) => user.role === "admin") || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = `https://dbbackend.devnexussolutions.com/auth/api/get-all-leads/edit/${leadId}`;

    console.log("PATCH request to:", apiUrl);
    console.log("Payload being sent:", formData);

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // Uncomment if token is needed
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update lead");
      }

      await response.json();
      alert("Lead updated successfully!");
      navigate("/admin-dashboard/mannual-leads");
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("An error occurred while updating the lead.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 sm:mt-16">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center sm:text-left">
        Edit Lead: <span className="text-blue-600">{formData.name}</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="font-semibold text-gray-700">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Full Name"
              required
            />
          </label>

          <label className="block">
            <span className="font-semibold text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="example@email.com"
              required
            />
          </label>

          <label className="block">
            <span className="font-semibold text-gray-700">Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="+91 9876543210"
              required
            />
          </label>

          <label className="block">
            <span className="font-semibold text-gray-700">City</span>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="City"
            />
          </label>
        </div>

        <label className="block">
          <span className="font-semibold text-gray-700">Requirement</span>
          <input
            type="text"
            name="requirement"
            value={formData.requirement}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Requirement details"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="font-semibold text-gray-700">Assigned To</span>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">-- Select Admin --</option>
              {adminUsers.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="font-semibold text-gray-700">Assigned Date</span>
            <input
              type="date"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>
        </div>

        <label className="block">
          <span className="font-semibold text-gray-700">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="">-- Select Status --</option>
            <option value="No Answer on Call">No Answer on Call</option>
            <option value="Call Rescheduled">Call Rescheduled</option>
            <option value="Information Pending to be Shared">
              Information Pending to be Shared
            </option>
            <option value="Information Shared">Information Shared</option>
            <option value="Follow-Up Needed">Follow-Up Needed</option>
            <option value="Interested – Needs Further Clarification">
              Interested – Needs Further Clarification
            </option>
            <option value="Not Interested">Not Interested</option>
            <option value="Phone Unreachable / Switched Off">
              Phone Unreachable / Switched Off
            </option>
            <option value="Lead Successfully Closed">Lead Successfully Closed</option>
            <option value="Incorrect Contact Number">Incorrect Contact Number</option>
            <option value="Call Pending">Call Pending</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full sm:w-auto mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
