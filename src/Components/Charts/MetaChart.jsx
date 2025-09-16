import { useEffect } from "react";
import useMetaLeads from "../../Zustand/MetaLeadsGet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MetaChart() {
  const {
    metaleads,
    loading: metaLoading,
    error: metaError,
    fetchMetaLeads,
  } = useMetaLeads();

  useEffect(() => {
    fetchMetaLeads();
  }, []);

  // Utility to extract average number from a budget string like "₹20,000_–_₹30,000"
  const parseBudget = (budgetStr) => {
    if (!budgetStr) return 0;

    // Remove ₹, _, spaces and split ranges
    const cleaned = budgetStr.replace(/[₹,_]/g, "").split("–");
    const nums = cleaned.map((val) => parseInt(val.trim()));

    if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
      return Math.round((nums[0] + nums[1]) / 2); // Average
    }

    return !isNaN(nums[0]) ? nums[0] : 0;
  };
// console.log( metaleads?.leads)
  // Transform data
  const chartData =
    metaleads?.leads?.map((lead, index) => {
      const fields = lead.AllFields || {};
      return {
        name: fields.full_name || `Lead ${index + 1}`,
        budget: parseBudget(fields["what_is_your_monthly_marketing_budget?"]),
        city: fields.city || "Unknown",
      };
    }) || [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Meta Leads Budget Chart</h2>

      {metaLoading ? (
        <p>Loading chart...</p>
      ) : metaError ? (
        <p>Error loading data</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
