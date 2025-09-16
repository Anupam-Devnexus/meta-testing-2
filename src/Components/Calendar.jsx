import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay, parseISO } from "date-fns";

const AppointmentCalendar = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Appointments for the selected date
  const dailyAppointments = useMemo(
    () =>
      appointments.filter((appt) => isSameDay(parseISO(appt.date), selectedDate)),
    [appointments, selectedDate]
  );

  // Color date cells based on appointment types
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dayAppointments = appointments.filter((appt) =>
        isSameDay(parseISO(appt.date), date)
      );

      if (dayAppointments.length > 0) {
        // Determine highest priority status for coloring
        if (dayAppointments.some((appt) => appt.status === "cancelled")) {
          return "bg-red-100 text-red-700 font-semibold rounded-md";
        } else if (dayAppointments.some((appt) => appt.status === "completed")) {
          return "bg-green-100 text-green-700 font-semibold rounded-md";
        } else {
          return "bg-blue-100 text-blue-700 font-semibold rounded-md";
        }
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>

      {/* Appointment Details */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow-md max-h-[500px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Appointments on {format(selectedDate, "PPP")}
        </h2>

        {dailyAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments for this day.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {dailyAppointments.map((appt) => (
              <li
                key={appt.id}
                className="p-3 border-l-4 rounded-md shadow-sm hover:shadow-md transition relative"
              >
                <span
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                    appt.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : appt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {appt.status}
                </span>
                <h3 className="font-bold text-gray-800">{appt.title}</h3>
                {appt.time && <p className="text-gray-600 mt-1">Time: {appt.time}</p>}
                {appt.duration && (
                  <p className="text-gray-500 text-sm mt-1">
                    Duration: {appt.duration} mins
                  </p>
                )}
                {appt.description && (
                  <p className="text-gray-500 text-sm mt-2">{appt.description}</p>
                )}
                {appt.emails && appt.emails.length > 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    Invitees: {appt.emails.join(", ")}
                  </p>
                )}
                {appt.meetLink && (
                  <a
                    href={appt.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                  >
                    Join Meeting
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
