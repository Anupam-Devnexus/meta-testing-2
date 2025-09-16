import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
} from "react-icons/fa";
import {
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { GrIntegration } from "react-icons/gr";
import { SlCalender } from "react-icons/sl";
import { MdLeaderboard } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { SiGoogleads } from "react-icons/si";
import { IoLogoGoogleplus } from "react-icons/io";
import { LuPartyPopper } from "react-icons/lu";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get stored user
  const storedUser = useMemo(() => JSON.parse(localStorage.getItem("UserDetails") || "{}"), []);
  const { role = "user", name = "Guest", permissions = [] } = storedUser;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setOpenSubmenu(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Admin Navigation (static)
  const adminNav = [
    { icon: <RiAdminLine />, label: "Dashboard", path: "/admin-dashboard" },
    { icon: <LuPartyPopper />, label: "Opportunity", path: "/admin-dashboard/oppurtunity" },
    {
      icon: <FaUsers />,
      label: "Users",
      path: "/admin-dashboard/users",
      submenu: [{ icon: <FaUsers />, sublabel: "All Users", path: "/admin-dashboard/users" }],
    },
    {
      icon: <FaUsers />,
      label: "Leads",
      path: "/admin-dashboard/leads",
      submenu: [
        { icon: <FaUsers />, sublabel: "Create Lead", path: "/admin-dashboard/mannual-leads/add" },
      ],
    },
    { icon: <SiGoogleads />, label: "Manual Leads", path: "/admin-dashboard/mannual-leads" },
    { icon: <FaUsers />, label: "Website Leads", path: "/admin-dashboard/website" },
    {
      icon: <FaUsers />,
      label: "Meta",
      path: "/admin-dashboard/meta",
      submenu: [
        { icon: <SiGoogleads />, sublabel: "Meta Leads", path: "/admin-dashboard/meta" },
        { icon: <FaUsers />, sublabel: "CA Leads", path: "/admin-dashboard/ca-leads" },
        { icon: <FaUsers />, sublabel: "Digital Leads", path: "/admin-dashboard/digital-leads" },
        { icon: <FaUsers />, sublabel: "Web Dev Leads", path: "/admin-dashboard/web-development-leads" },
        { icon: <FaUsers />, sublabel: "Travel Leads", path: "/admin-dashboard/travel-agency-leads" },
      ],
    },
    {
      icon: <IoLogoGoogleplus />,
      label: "Google",
      path: "/admin-dashboard/google",
      submenu: [{ icon: <IoLogoGoogleplus />, sublabel: "Google Ads", path: "/admin-dashboard/google-ads" }],
    },
    { icon: <RiAdminLine />, label: "Stats", path: "/admin-dashboard/stats" },
    { icon: <SlCalender />, label: "Appointments", path: "/admin-dashboard/appointments" },
    // { icon: <GrIntegration />, label: "Integrations", path: "/admin-dashboard/integrations" },
  ];

  // User navigation dynamically from permissions
  const userNav = permissions.map((perm) => ({
    icon: <MdLeaderboard />,
    label: perm.label,
    path: perm.path,
  }));

  const navData = role === "admin" ? adminNav : userNav;

  return (
    <nav className="h-screen bg-gradient-to-b from-[#2a1ce7] to-[#1c39bb] text-white fixed top-0 left-0 shadow-xl flex flex-col border-r border-white/10 w-64 transition-all duration-300">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">
          {role === "admin" ? "Admin Panel" : "User Panel"}
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/20">
        <ul className="flex flex-col gap-2">
          {navData.map((item) => {
            const isParentActive =
              location.pathname === item.path ||
              (item.submenu && item.submenu.some((sub) => location.pathname === sub.path));

            return (
              <li key={item.label}>
                <div
                  onClick={() =>
                    item.submenu
                      ? setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                      : handleNavigate(item.path)
                  }
                  className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${isParentActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
                >
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <FiChevronDown className={`text-xs transition-transform ${openSubmenu === item.label ? "rotate-180" : ""}`} />
                  )}
                </div>

                {/* Submenu */}
                {item.submenu && openSubmenu === item.label && (
                  <ul className="pl-6 mt-1 space-y-1 border-l border-white/10">
                    {item.submenu.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <li key={sub.sublabel}>
                          <div
                            onClick={() => handleNavigate(sub.path)}
                            className={`flex items-center gap-2 py-2 px-2 text-sm rounded-md cursor-pointer transition-all duration-200 ${isSubActive ? "text-[#dcdc3c] font-semibold" : "hover:text-[#dcdc3c]"}`}
                          >
                            {sub.icon}
                            <span>{sub.sublabel}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Profile Dropdown */}
      <div className="px-4 py-4 border-t border-white/10 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center gap-2 bg-white text-[#141414] px-3 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <FiUser />
          <span className="text-sm truncate">Hi, {name}</span>
          <FiChevronDown className={`ml-auto transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white text-[#141414] rounded-lg shadow-lg overflow-hidden animate-fade-in z-50">
            <button
              onClick={() => handleNavigate(role === "admin" ? "/admin-profile" : "/user-profile")}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              View Profile
            </button>
            <button
              onClick={handleLogOut}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
