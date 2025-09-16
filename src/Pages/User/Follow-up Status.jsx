// components/FollowUpChart.jsx

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FollowUpStatus = () => {
  const data = {
    labels: ["Pending Follow-Up", "Today's Follow-Up"],
    datasets: [
      {
        label: "No. of Leads",
        data: [1, 2], // Replace with dynamic values if needed
        backgroundColor: ["#facc15", "#3b82f6"],
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div>
          <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center sm:text-left mt-10">
            Follow Up Status
            </h1>
  
    <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-md mx-auto">
      
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Follow-Up Status
      </h2>
      <Bar data={data} options={options} />
    </div>
      </div>
  );
};

export default FollowUpStatus;
