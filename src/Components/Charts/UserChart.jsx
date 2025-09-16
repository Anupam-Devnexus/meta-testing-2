import { useEffect } from "react";
import useUserStore from "../../Zustand/UsersGet";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function UserPieChart() {
  const { users, loading: userLoading, error: userError, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  // Count users by role
  const roleCountMap = {};
  users?.users?.forEach(user => {
    const role = user.role || "Unknown";
    roleCountMap[role] = (roleCountMap[role] || 0) + 1;
  });

  const chartData = Object.entries(roleCountMap).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  return (
    <div className="w-full h-[400px] p-4">
      <h2 className="text-xl font-bold mb-4">User Roles Distribution (Pie Chart)</h2>
      {userLoading && <p>Loading...</p>}
      {userError && <p>Error loading users.</p>}
      {!userLoading && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
