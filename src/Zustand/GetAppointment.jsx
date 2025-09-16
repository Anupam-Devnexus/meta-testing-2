import { create } from "zustand";
import axios from "axios";

const api = "https://dbbackend.devnexussolutions.com/auth/api/appointment";

const useAppointments = create((set) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    set({ loading: true, error: null });
    try {
      // Get token from localStorage
      const tokenData = localStorage.getItem("UserDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      if (!authToken) {
        throw new Error("No token found. Please login.");
      }

      const res = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      set({ appointments: res.data || [], loading: false });
      console.log("Fetched appointments:", res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      set({
        error: err.response?.data?.message || err.message || "Something went wrong",
        loading: false,
      });
    }
  },

  addAppointment: async (appointment) => {
    set({ loading: true, error: null });
    try {
      const tokenData = localStorage.getItem("userDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      if (!authToken) {
        throw new Error("No token found. Please login.");
      }

      // Log the payload before posting
      console.log("Posting appointment:", appointment);

      const res = await axios.post(api, appointment, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Update state with new appointment
      set((state) => ({
        appointments: [...state.appointments, res.data],
        loading: false,
      }));

      console.log("Appointment added:", res.data);
    } catch (err) {
      console.error("Error adding appointment:", err);
      set({
        error: err.response?.data?.message || err.message || "Something went wrong",
        loading: false,
      });
    }
  },
}));

export default useAppointments;
