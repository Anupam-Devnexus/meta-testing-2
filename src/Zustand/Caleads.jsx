import { create } from "zustand";
import axios from "axios";

const api = "https://dbbackend.devnexussolutions.com/user/leads";

const useCaleads = create((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchCaleads: async () => {
    set({ loading: true, error: null });
    try {
      // Get token from localStorage
      const key = UserDetails ? UserDetails : User;
      const tokenData = localStorage.getItem(key);
      const authToken = tokenData ? JSON.parse(tokenData).token : null;

      console.log("Stored tokenData:", tokenData);
      console.log("Extracted authToken:", authToken);


      if (!authToken) {
        throw new Error("No token found, please login.");
      }

      const res = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      set({ data: res.data.leads || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || "Something went wrong",
        loading: false,
      });
    }
  },
}));

export default useCaleads;
