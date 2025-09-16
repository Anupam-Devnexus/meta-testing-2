import { useState, useCallback, useMemo } from "react";

// Backend-friendly navigation (no icons, consistent labels)
const adminNav = [
  { label: "Dashboard", path: "/admin-dashboard" },
  { label: "Opportunity", path: "/admin-dashboard/oppurtunity" },
  {
    label: "Users",
    path: "/admin-dashboard/users",
    submenu: [{ label: "All Users", path: "/admin-dashboard/users" }],
  },
  {
    label: "Leads",
    path: "/admin-dashboard/leads",
    submenu: [{ label: "Create Lead", path: "/admin-dashboard/mannual-leads/add" }],
  },
  { label: "Manual Leads", path: "/admin-dashboard/mannual-leads" },
  { label: "Website Leads", path: "/admin-dashboard/contact" },
  {
    label: "Meta",
    path: "/admin-dashboard/meta",
    submenu: [
      { label: "Meta Leads", path: "/admin-dashboard/meta" },
      { label: "CA Leads", path: "/admin-dashboard/ca-leads" },
      { label: "Digital Leads", path: "/admin-dashboard/digital-leads" },
      { label: "Web Dev Leads", path: "/admin-dashboard/web-development-leads" },
      { label: "Travel Leads", path: "/admin-dashboard/travel-agency-leads" },
    ],
  },
  {
    label: "Google",
    path: "/admin-dashboard/google",
    submenu: [{ label: "Google Ads", path: "/admin-dashboard/google-ads" }],
  },
  { label: "Stats", path: "/admin-dashboard/stats" },
  { label: "Appointments", path: "/admin-dashboard/appointments" },
  { label: "Integrations", path: "/admin-dashboard/integrations" },
];

// Recursive Access Checkbox Component
const AccessCheckbox = ({ item, formData, handleChange }) => {
  const isChecked = formData.access.some((a) => a.path === item.path);

  const areChildrenChecked =
    item.submenu &&
    item.submenu.every((sub) => formData.access.some((a) => a.path === sub.path));
  // console.log(formData.role)
  return (
    <div className="mb-3">
      <label
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${isChecked ? "bg-blue-50 text-blue-700 font-semibold" : "hover:bg-gray-100"
          }`}
      >
        <input
          type="checkbox"
          name="access"
          value={item.path}
          checked={isChecked || areChildrenChecked}
          onChange={(e) => handleChange(e, item)}
          className="h-4 w-4 accent-blue-600"
        />
        {item.label}
      </label>

      {item.submenu && (
        <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
          {item.submenu.map((sub, subIdx) => (
            <AccessCheckbox
              key={subIdx}
              item={sub}
              formData={formData}
              handleChange={handleChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AddUser() {
  const initialFormState = useMemo(
    () => ({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      adminId: "", // NEW FIELD
      access: [],
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Recursive helper to collect all submenu paths
  const collectChildren = (item) => {
    let paths = [{ label: item.label, path: item.path }];
    if (item.submenu) {
      item.submenu.forEach((sub) => {
        paths = [...paths, ...collectChildren(sub)];
      });
    }
    return paths;
  };

  // Handle input changes
  const handleChange = useCallback((e, item) => {
    const { name, value, checked } = e.target;

    if (name === "access") {
      const allPaths = collectChildren(item);
      setFormData((prev) => {
        let updatedAccess = [...prev.access];
        if (checked) {
          allPaths.forEach((p) => {
            if (!updatedAccess.some((a) => a.path === p.path)) {
              updatedAccess.push(p);
            }
          });
        } else {
          updatedAccess = updatedAccess.filter(
            (a) => !allPaths.some((p) => p.path === a.path)
          );
        }
        return { ...prev, access: updatedAccess };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Handle form submission
  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  const { name, email, phone, password, confirmPassword, role, access } = formData;

  if (!name || !email || !phone || !password || !confirmPassword || !role) {
    setError("All fields are required!");
    setSuccess("");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match!");
    setSuccess("");
    return;
  }

  // 🔑 Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("User"));
console.log(loggedInUser.id)
  // Fetch adminId if logged-in user is admin
  let adminId = null;
  if (loggedInUser?.role === "admin") {
    adminId = loggedInUser.id; // Or loggedInUser.adminId depending on backend schema
  }

  const payload = {
    EmpUsername: name,
    email,
    phone,
    password,
    confirmPassword,
    role,
    adminId,  
    isActive: true,
    permissions: access,
    lastLogin: null,
  };

  try {
    const response = await fetch(
      "https://dbbackend.devnexussolutions.com/auth/api/signup-users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (response.ok) {
      setSuccess("User added successfully!");
      setFormData(initialFormState);
    } else {
      setError(result.message || "Something went wrong!");
    }
  } catch (err) {
    console.error(err);
    setError("Network or server error");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New User</h2>

        {error && <p className="mb-4 text-center text-red-600 font-medium">{error}</p>}
        {success && <p className="mb-4 text-center text-green-600 font-medium">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

     


          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Page Access */}
          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Page Access</label>
            <div className="bg-gray-50 rounded-xl p-4 max-h-[400px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {adminNav.map((item, idx) => (
                <AccessCheckbox
                  key={idx}
                  item={item}
                  formData={formData}
                  handleChange={handleChange}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="sm:col-span-2 w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
