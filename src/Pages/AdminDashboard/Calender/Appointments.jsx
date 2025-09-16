import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";

export default function CalendarScheduler() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    duration: "30",
    attendees: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const api = "https://dbbackend.devnexussolutions.com/auth/api/appointment";

  // ------------------------
  // Fetch Appointments
  // ------------------------
  const fetchAppointments = async () => {
    try {
      const tokenData = localStorage.getItem("userDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      const res = await fetch(api, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch events");

      const mappedEvents = data.map((event) => ({
        id: event.id,
        title: event.summary || event.title,
        start: event.start.dateTime || event.start,
        end: event.end.dateTime || event.end,
        extendedProps: {
          meetLink: event.meetLink,
          attendees: event.attendees,
        },
      }));

      setEvents(mappedEvents);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ------------------------
  // Create Appointment
  // ------------------------
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setFormData({ title: "", duration: "30", attendees: "" });
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const emailList = formData.attendees
      .split(/[,;\s]+/)
      .filter((email) => email.trim() !== "");
    const invalidEmails = emailList.filter(
      (email) => !/^\S+@\S+\.\S+$/.test(email)
    );
    if (invalidEmails.length > 0) {
      return toast.error(`Invalid email(s): ${invalidEmails.join(", ")}`);
    }

    try {
      const newEvent = {
        title: formData.title,
        start: selectedDate,
        end: new Date(
          new Date(selectedDate).getTime() + formData.duration * 60000
        ).toISOString(),
        attendees: emailList,
      };

      const tokenData = localStorage.getItem("userDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      const res = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create appointment");

      setEvents((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.summary || data.title,
          start: data.start.dateTime || data.start,
          end: data.end.dateTime || data.end,
          extendedProps: {
            meetLink: data.meetLink,
            attendees: data.attendees,
          },
        },
      ]);

      toast.success("Appointment scheduled!");
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      toast.error(err.message);
    }
  };

  // ------------------------
  // Edit Appointment
  // ------------------------
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setFormData({
      title: info.event.title,
      duration: Math.round(
        (new Date(info.event.end) - new Date(info.event.start)) / 60000
      ),
      attendees: info.event.extendedProps.attendees
        ?.map((a) => a.email)
        .join(", ") || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    const emailList = formData.attendees
      .split(/[,;\s]+/)
      .filter((email) => email.trim() !== "");

    try {
      const updatedEvent = {
        title: formData.title,
        start: selectedEvent.start.toISOString(),
        end: new Date(
          new Date(selectedEvent.start).getTime() + formData.duration * 60000
        ).toISOString(),
        attendees: emailList,
      };

      const tokenData = localStorage.getItem("userDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      const res = await fetch(`${api}/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify(updatedEvent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update appointment");

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                title: data.title,
                start: data.start.dateTime || data.start,
                end: data.end.dateTime || data.end,
                extendedProps: {
                  meetLink: data.meetLink,
                  attendees: data.attendees,
                },
              }
            : ev
        )
      );

      toast.success("Appointment updated!");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating appointment:", err);
      toast.error(err.message);
    }
  };

  // ------------------------
  // Delete Appointment
  // ------------------------
  const handleDeleteEvent = async () => {
    try {
      const tokenData = localStorage.getItem("userDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      const res = await fetch(`${api}/${selectedEvent.id}`, {
        method: "DELETE",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      });

      if (!res.ok) throw new Error("Failed to delete appointment");

      setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
      toast.success("Appointment deleted!");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">📅 Google Calendar Scheduler</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={false}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="80vh"
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal title="New Appointment" onClose={() => setIsCreateModalOpen(false)}>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <InputField
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <InputField
              type="number"
              label="Duration (minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, duration: e.target.value }))
              }
            />
            <InputField
              label="Attendees (comma separated emails)"
              value={formData.attendees}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, attendees: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal title="Edit Appointment" onClose={() => setIsEditModalOpen(false)}>
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <InputField
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <InputField
              type="number"
              label="Duration (minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, duration: e.target.value }))
              }
            />
            <InputField
              label="Attendees (comma separated emails)"
              value={formData.attendees}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, attendees: e.target.value }))
              }
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ------------------------
// Reusable Modal Component
// ------------------------
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ------------------------
// Reusable Input Component
// ------------------------
function InputField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2"
      />
    </div>
  );
}
