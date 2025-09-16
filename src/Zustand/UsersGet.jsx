import { create } from 'zustand';

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      // Get token from localStorage
      const userDetails = JSON.parse(localStorage.getItem('UserDetails'));
      const token = userDetails?.token;

      if (!token) {
        throw new Error('No token found. Please login.');
      }

      const response = await fetch(
        'https://dbbackend.devnexussolutions.com/auth/api/get-all-users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // include token
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      set({ users: result, loading: false });
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch data',
        loading: false,
      });
    }
  },
}));

export default useUserStore;
