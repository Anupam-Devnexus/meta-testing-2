import { create } from "zustand";
import axios from "axios";

const metainsights = create((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchinsights: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        "http://ec2-15-206-164-254.ap-south-1.compute.amazonaws.com:3000/auth/api/meta-ads/insights"
      );
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || "Something went wrong", loading: false });
    }
  },
}));

export default metainsights;
