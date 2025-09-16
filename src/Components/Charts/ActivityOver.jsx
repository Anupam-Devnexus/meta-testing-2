import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Data from "../../Datastore/Stats.json";

const ActivityOver = () => {
  const activityData = Object.entries(Data.activityOverview.activityCount).map(
    ([key, value]) => ({
      activity: key.charAt(0).toUpperCase() + key.slice(1),
      count: value,
    })
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Activity Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={activityData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="activity" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip
            contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
          />
          <Legend />
          <Bar dataKey="count" fill="#4f46e5" barSize={40} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityOver;
    