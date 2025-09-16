import { useEffect, useState, useMemo } from "react";
import { FaUser, FaUsers, FaChartLine, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useMetaLeads from "../../Zustand/MetaLeadsGet";
import useLeadStore from "../../Zustand/LeadsGet";
import useUserStore from "../../Zustand/UsersGet";
import IntegrationPage from "./Interagtion/IntegrationPage";

import StatCard from "../../Components/Cards/StatCard";
import SalesFunnel from "../../Components/Charts/SalesFunnel";
import SellHistoryChart from "../../Components/SellHistoryChart";
import SupportTracker from "../../Components/SupportTracker";

export default function Dashboard() {
  const { metaleads, fetchMetaLeads } = useMetaLeads();
  const { users, loading, error, fetchUser } = useUserStore();
  const { data, fetchData } = useLeadStore();

  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    token: "",
  });

  const navigate = useNavigate();

  // 🔹 Facebook OAuth Handler
  const handleFacebook = async () => {
    try {
      if (!userInfo.token) throw new Error("No token found. Please login first.");

      const res = await fetch(
        "https://dbbackend.devnexussolutions.com/facebook/config",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch config: ${errorText}`);
      }

      const { appId, redirectUri } = await res.json();
      if (!appId || !redirectUri)
        throw new Error("Invalid Facebook config (missing appId or redirectUri)");

      const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=pages_show_list,pages_read_engagement,leads_retrieval&response_type=code`;

      window.open(fbAuthUrl, "fbLogin", "width=600,height=700");
    } catch (err) {
      console.error("Facebook Login Error:", err.message);
    }
  };

  // 🔹 Fetch Data on Mount
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserInfo((prev) => ({ ...prev, ...user }));
      } catch (err) {
        console.error("Failed to parse user info:", err);
      }
    }
    fetchMetaLeads();
    fetchData();
    fetchUser();
  }, []);

  // 🔹 Derived Data
  const totalLeads = useMemo(() => data?.leads?.length || 0, [data]);
  const totalMetaLeads = useMemo(() => metaleads?.leads?.length || 0, [metaleads]);
  const totalUsers = useMemo(() => users?.users?.length || 0, [users]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700">
            Welcome back,{" "}
            <span className="text-indigo-900">{userInfo.name || "Guest"}</span>!
          </h1>
          <p className="mt-2 text-lg text-indigo-600 font-medium">
            Role: {userInfo.role || "User"}
          </p>
        </div>
        <IntegrationPage/>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={FaUser}
          title="Total Users"
          value={loading ? "..." : totalUsers}
          bgColor="bg-indigo-100"
          iconColor="text-indigo-600"
          onClick={() => navigate("/admin-dashboard/users")}
          hoverEffect
        />
        <StatCard
          icon={FaUsers}
          title="Total Meta Leads"
          value={totalMetaLeads}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          onClick={() => navigate("/admin-dashboard/meta")}
          hoverEffect
        />
        <StatCard
          icon={FaChartLine}
          title="Total Leads"
          value={totalLeads}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          onClick={() => navigate("/admin-dashboard/stats")}
          hoverEffect
        />
      </div>

      {/* Sales & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Sales Funnel</h2>
          <SalesFunnel />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Sales History</h2>
          <SellHistoryChart />
        </div>
      </div>

      {/* Support Tracker */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Support Tracker</h2>
        <SupportTracker />
      </div>
    </div>
  );
}
