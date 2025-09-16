// src/store/useLeadStore.js
import { create } from 'zustand';
import { useNavigate } from 'react-router-dom';

const useLeadStore = create((set) => ({
  data: { leads: [] },
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });

    try {
      const tokenData = localStorage.getItem("User");
      const authToken = tokenData ? JSON.parse(tokenData).token : null;
      // console.log("Auth Token:", authToken);
      if (!authToken) {
        throw new Error("Unauthorized: No token found");
      }

      const response = await fetch(
        'https://dbbackend.devnexussolutions.com/User/leads',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 401) {
        // Token invalid or expired
        throw new Error("Unauthorized: Invalid or expired token");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Ensure leads array exists
      set({ data: { leads: result?.leads || [] }, loading: false });
      // console.log(leads)
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      set({
        error: error.message || "Failed to fetch data",
        loading: false,
      });
    }
  },
}));

export default useLeadStore;
