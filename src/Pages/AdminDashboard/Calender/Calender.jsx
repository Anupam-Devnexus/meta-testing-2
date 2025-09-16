import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Allappointments from "../../../Components/Allappointments";

const localizer = momentLocalizer(moment);

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

const calendars = [
  { name: "Matt Jones work calendar", color: "#4ade80" },
  { name: "Ankit Sureka Personal Calendar", color: "#60a5fa" },
];

const ViewButton = ({ viewName, currentView, setView }) => (
  <button
    onClick={() => setView(viewName)}
    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
      currentView === viewName
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
  </button>
);

const CalendarCheckbox = ({ cal, selectedCalendars, toggleCalendar }) => (
  <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
    <input
      type="checkbox"
      checked={selectedCalendars.includes(cal.name)}
      onChange={() => toggleCalendar(cal.name)}
      className="rounded text-blue-600 focus:ring-blue-500"
    />
    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cal.color }}></span>
    <span className="text-gray-700">{cal.name}</span>
  </label>
);

export default function CalendarApp() {
  const [events] = useState(initialEvents);
  const [selectedCalendars, setSelectedCalendars] = useState(calendars.map(c => c.name));
  const [view, setView] = useState("week");
  const [showCancelled, setShowCancelled] = useState(true);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const filteredEvents = useMemo(
    () => events.filter(e => selectedCalendars.includes(e.calendar) && e.status === "active"),
    [events, selectedCalendars]
  );

  const cancelledEvents = useMemo(
    () => events.filter(e => e.status === "cancelled"),
    [events]
  );

  const toggleCalendar = name => {
    setSelectedCalendars(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleAllCalendars = () => {
    setSelectedCalendars(
      selectedCalendars.length === calendars.length ? [] : calendars.map(c => c.name)
    );
  };

  const eventStyle = event => {
    const cal = calendars.find(c => c.name === event.calendar);
    return {
      style: {
        backgroundColor: cal?.color || "#2563eb",
        color: "white",
        borderRadius: "8px",
        padding: "6px",
        fontWeight: "500",
        border: "none",
      }
    };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow rounded-xl p-4 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Calendars</h3>
        <button
          onClick={toggleAllCalendars}
          className="w-full bg-gray-200 text-gray-700 py-1 rounded-md hover:bg-gray-300 transition"
        >
          {selectedCalendars.length === calendars.length ? "Deselect All" : "Select All"}
        </button>
        <div className="flex flex-col gap-2">
          {calendars.map(cal => (
            <CalendarCheckbox
              key={cal.name}
              cal={cal}
              selectedCalendars={selectedCalendars}
              toggleCalendar={toggleCalendar}
            />
          ))}
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 bg-white shadow rounded-xl p-4 flex flex-col gap-4">
        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-2">
            {!showAllAppointments &&
              ["day", "week", "month"].map(v => (
                <ViewButton key={v} viewName={v} currentView={view} setView={setView} />
              ))}
          </div>

          <div className="flex gap-2">
           
            <button
              onClick={() => setShowAllAppointments(!showAllAppointments)}
              className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              {showAllAppointments ? "Show Calendar" : "All Appointments"}
            </button>
            {!showAllAppointments && (
              <button
                onClick={() => setShowCancelled(!showCancelled)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  showCancelled ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {showCancelled ? "Hide Cancelled" : "Show Cancelled"}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!showAllAppointments ? (
          <>
            <div className="flex-1">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "600px" }}
                view={view}
                eventPropGetter={eventStyle}
              />
            </div>

            {showCancelled && cancelledEvents.length > 0 && (
              <div className="bg-red-50 p-4 rounded-xl shadow-inner mt-2">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Cancelled Appointments</h3>
                <ul className="space-y-2">
                  {cancelledEvents.map(e => (
                    <li key={e.id} className="flex justify-between items-center bg-red-100 p-3 rounded-lg hover:bg-red-200 transition">
                      <span className="font-medium">{e.title}</span>
                      <span className="text-sm text-red-700">
                        {moment(e.start).format("DD MMM YYYY, hh:mm A")}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-700">
                        Cancelled
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <Allappointments />
        )}
      </main>
    </div>
  );
}
