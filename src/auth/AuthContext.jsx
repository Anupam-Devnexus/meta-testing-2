// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return {
          ...parsed,
          role: parsed.role ? parsed.role.trim().toLowerCase() : "user", // default to 'user'
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      const normalized = {
        ...user,
        role: user.role ? user.role.trim().toLowerCase() : "user",
      };
      localStorage.setItem("User", JSON.stringify(normalized));
    } else {
      localStorage.removeItem("User");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hooks
export const useAuth = () => useContext(AuthContext);
export const useUser = () => {
  const { user } = useAuth();
  return user;
};
