import { useEffect } from "react";
import useLeadStore from "../../Zustand/LeadsGet";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function MannualChart() {
  const {
    data: manualLeads,
    loading: leadLoading,
    error: leadError,
    fetchData,
  } = useLeadStore();

  useEffect(() => {
    fetchData();
  }, []);

  // Transform leads to chart format
  const chartData = manualLeads?.leads?.map((lead) => ({
    name: lead.name || "No Name",
    budget: Number(lead.budget) || 0,
    createdBy: lead.createdBy || "Unknown",
  })) || [];

  return (
    <div className="w-full h-[400px] p-4">
      <h2 className="text-xl font-bold mb-4">Budget Chart (per Lead)</h2>
      {leadLoading && <p>Loading...</p>}
      {leadError && <p>Error loading data.</p>}
      {!leadLoading && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
