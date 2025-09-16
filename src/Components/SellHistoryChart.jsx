import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Feb", sellPrice: 75, totalSell: 45 },
  { name: "Mar", sellPrice: 85, totalSell: 55 },
  { name: "Apr", sellPrice: 100, totalSell: 58 },
  { name: "May", sellPrice: 95, totalSell: 56 },
  { name: "Jun", sellPrice: 85, totalSell: 60 },
  { name: "Jul", sellPrice: 100, totalSell: 61 },
  { name: "Aug", sellPrice: 90, totalSell: 59 },
  { name: "Sep", sellPrice: 105, totalSell: 60 },
  { name: "Oct", sellPrice: 92, totalSell: 63 },
];

export default function SellHistoryChart() {
  return (
    <div className="bg-[#5755c2] text-white rounded-xl p-4 flex-1">
      {/* <h2 className="text-lg font-semibold mb-4">Sell History</h2> */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#38bdf8" />
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ color: "white" }}
          />
          <Bar dataKey="sellPrice" fill="#ffffff" name="Sell Price" />
          <Bar dataKey="totalSell" fill="#facc15" name="Total Sell" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
