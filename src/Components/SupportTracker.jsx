import { FaTicketAlt } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";

export default function SupportTracker() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full md:w-[350px]">
      {/* <h2 className="text-lg font-semibold mb-4">Support Tracker</h2> */}

      <div className="flex justify-center items-center mb-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              className="text-gray-200"
              d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="text-blue-500"
              d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="70, 100"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm text-gray-500">Completed Task</span>
            <span className="text-2xl font-bold text-gray-800">70</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-center">
        <div className="flex-1">
          <div className="flex justify-center mb-1">
            <FaTicketAlt className="text-purple-500" />
          </div>
          <p className="text-gray-600 font-medium">New Tickets</p>
          <p className="text-gray-800 font-semibold">100</p>
        </div>
        <div className="flex-1">
          <div className="flex justify-center mb-1">
            <FiCheckCircle className="text-green-500" />
          </div>
          <p className="text-gray-600 font-medium">Open Tickets</p>
          <p className="text-gray-800 font-semibold">16</p>
        </div>
        <div className="flex-1">
          <div className="flex justify-center mb-1">
            <MdOutlineAccessTime className="text-yellow-500" />
          </div>
          <p className="text-gray-600 font-medium">Response Time</p>
          <p className="text-gray-800 font-semibold">1 day</p>
        </div>
      </div>
    </div>
  );
}
