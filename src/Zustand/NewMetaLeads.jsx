import { create } from "zustand";
import axios from "axios";

const useNewMetaLeads = create((set) => ({
  loading: false,
  newleadsdata: [],
  error: null,

  fetchNewMeta: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        "http://ec2-15-206-164-254.ap-south-1.compute.amazonaws.com:3000/auth/api/meta-ads/fetch-meta-leads"
      );
      set({ newleadsdata: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch new meta leads", loading: false });
    }
  },
}));

export default useNewMetaLeads;
