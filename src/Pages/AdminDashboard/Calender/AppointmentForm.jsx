import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAppointments from "../../../Zustand/GetAppointment";

const AppointmentForm = () => {
  const navigate = useNavigate();
  const { addAppointment } = useAppointments();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "30",
    description: "",
    emails: "",
  });
  const [meetLink, setMeetLink] = useState("");
  const [error, setError] = useState("");

  const api = "https://dbbackend.devnexussolutions.com/auth/api/appointment";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, date, time, duration, description, emails } = formData;

    // Validate required fields
    if (!title || !date || !time) {
      setError("Please fill all mandatory fields.");
      return;
    }

    // Validate emails
    const emailList = emails
      .split(/[,;\s]+/)
      .filter((email) => email.trim() !== "");
    const invalidEmails = emailList.filter(
      (email) => !/^\S+@\S+\.\S+$/.test(email)
    );
    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
      return;
    }

    setError("");

    // Generate Meet link
    const generatedLink = `https://meet.google.com/${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const appointmentPayload = {
      title,
      date,
      time,
      duration,
      description,
      emails: emailList,
      meetLink: generatedLink,
    };

    // Console log payload before posting
    console.log("Posting appointment:", appointmentPayload);

    try {
      const tokenData = localStorage.getItem("userDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      // Post to API
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify(appointmentPayload),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      // Update Zustand store
      addAppointment(data);

      // Show success toast
      toast.success("Appointment booked successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect to appointments page
      navigate("/admin-dashboard/appointments");

      // Reset form
      setMeetLink(generatedLink);
      setFormData({
        title: "",
        date: "",
        time: "",
        duration: "30",
        description: "",
        emails: "",
      });
    } catch (err) {
      console.error("Error posting appointment:", err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to book appointment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Schedule Appointment
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="title"
        placeholder="Appointment Title *"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-2">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <input
        type="number"
        min="5"
        name="duration"
        placeholder="Duration (minutes)"
        value={formData.duration}
        onChange={handleChange}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="emails"
        placeholder="Invite Emails (comma, semicolon, or space separated)"
        value={formData.emails}
        onChange={handleChange}
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
      >
        Schedule Appointment
      </button>
    </form>
  );
};

export default AppointmentForm;
