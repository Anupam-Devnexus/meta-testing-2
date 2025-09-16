import React, { useState } from "react";

const Allappointments = () => {
  const initialEvents = [
    { id: 1, title: "Meeting with Client", start: new Date(2025, 7, 20, 10, 0), end: new Date(2025, 7, 20, 11, 0), calendar: "Matt Jones work calendar", status: "active" },
    { id: 2, title: "Cancelled Meeting", start: new Date(2025, 7, 21, 14, 0), end: new Date(2025, 7, 21, 15, 0), calendar: "Ankit Sureka Personal Calendar", status: "cancelled" },
    { id: 3, title: "Project Discussion", start: new Date(2025, 7, 22, 9, 30), end: new Date(2025, 7, 22, 10, 30), calendar: "Matt Jones work calendar", status: "active" },
    { id: 4, title: "Team Standup", start: new Date(2025, 7, 22, 11, 0), end: new Date(2025, 7, 22, 11, 30), calendar: "Ankit Sureka Personal Calendar", status: "active" },
    { id: 5, title: "Client Follow-up Call", start: new Date(2025, 7, 23, 13, 0), end: new Date(2025, 7, 23, 13, 30), calendar: "Matt Jones work calendar", status: "cancelled" },
    { id: 6, title: "HR Interview", start: new Date(2025, 7, 23, 15, 0), end: new Date(2025, 7, 23, 16, 0), calendar: "Ankit Sureka Personal Calendar", status: "active" },
    { id: 7, title: "Marketing Brainstorm", start: new Date(2025, 7, 24, 10, 0), end: new Date(2025, 7, 24, 11, 0), calendar: "Matt Jones work calendar", status: "active" },
    { id: 8, title: "Cancelled Presentation Review", start: new Date(2025, 7, 24, 14, 0), end: new Date(2025, 7, 24, 15, 0), calendar: "Ankit Sureka Personal Calendar", status: "cancelled" },
    { id: 9, title: "Sales Meeting", start: new Date(2025, 7, 25, 9, 0), end: new Date(2025, 7, 25, 10, 0), calendar: "Matt Jones work calendar", status: "active" },
    { id: 10, title: "Cancelled Client Demo", start: new Date(2025, 7, 25, 11, 0), end: new Date(2025, 7, 25, 12, 0), calendar: "Ankit Sureka Personal Calendar", status: "cancelled" },
  ];

  const [filter, setFilter] = useState("all");

  // Filtering logic
  const filteredEvents = initialEvents.filter(event => {
    if (filter === "all") return true;
    if (filter === "active") return event.status === "active";
    if (filter === "cancelled") return event.status === "cancelled";
    if (filter === "matt") return event.calendar.includes("Matt Jones");
    if (filter === "ankit") return event.calendar.includes("Ankit Sureka");
    return true;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter("all")} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">All</button>
        <button onClick={() => setFilter("active")} className="px-3 py-1 rounded bg-green-200 hover:bg-green-300">Active</button>
        <button onClick={() => setFilter("cancelled")} className="px-3 py-1 rounded bg-red-200 hover:bg-red-300">Cancelled</button>
        <button onClick={() => setFilter("matt")} className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300">Matt Jones</button>
        <button onClick={() => setFilter("ankit")} className="px-3 py-1 rounded bg-purple-200 hover:bg-purple-300">Ankit Sureka</button>
      </div>

      {/* Event List */}
      <ul className="space-y-2">
        {filteredEvents.map(event => (
          <li key={event.id} className={`p-3 rounded shadow ${event.status === "cancelled" ? "bg-red-50" : "bg-green-50"}`}>
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.calendar}</p>
            <p className="text-xs">
              {event.start.toLocaleString()} - {event.end.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Allappointments;
