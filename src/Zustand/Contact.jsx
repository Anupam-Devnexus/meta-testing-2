// src/store/useContactStore.js
import { create } from "zustand";
import axios from "axios";

const useContactStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchContacts: async () => {
    set({ loading: true, error: null });

    try {
      // Get token from localStorage
      const tokenData = localStorage.getItem("UserDetails");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      if (!authToken) {
        throw new Error("Unauthorized: No token found");
      }

      const response = await axios.get(
        "https://dbbackend.devnexussolutions.com/auth/api/contact",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      set({ data: response.data || [], loading: false });
    } catch (error) {
      console.error("Fetch Contacts Error:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to fetch contacts",
        loading: false,
      });
    }
  },
}));

export default useContactStore;
