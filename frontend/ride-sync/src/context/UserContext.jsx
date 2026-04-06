/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext(null);

const TOKEN_KEY = "ridesync_token";
const USER_KEY = "ridesync_user";

const safeJsonParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeUser = (nextUser) => ({
  userId: (nextUser?.userId || "").toString().trim(),
  name: (nextUser?.name || "").toString().trim(),
  role: nextUser?.role || "rider",
  email: (nextUser?.email || "").toString().trim(),
  mobile: (nextUser?.mobile || "").toString().trim(),
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    const token = window.localStorage.getItem(TOKEN_KEY);
    const persistedUser = safeJsonParse(window.localStorage.getItem(USER_KEY));

    // If a user is persisted but the token is missing, treat as logged out.
    if (!token) {
      window.localStorage.removeItem(USER_KEY);
      return null;
    }

    if (!persistedUser) return null;
    return normalizeUser(persistedUser);
  });

  const [bookings, setBookings] = useState([]);
  const [createdRides, setCreatedRides] = useState([]);

  const addBooking = (booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const addCreatedRide = (ride) => {
    setCreatedRides((prev) => [ride, ...prev]);
  };

  const login = (nextUser) => {
    setUser(normalizeUser(nextUser));
  };

  const signup = (nextUser) => {
    setUser(normalizeUser(nextUser));
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
    setUser(null);
    setBookings([]);
    setCreatedRides([]);
  };

  const switchRole = () => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        role: prev.role === "rider" ? "driver" : "rider",
      };
    });
  };

  // Keep persisted user in sync so refresh doesn't log out.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      window.localStorage.removeItem(USER_KEY);
      return;
    }

    if (!user) {
      window.localStorage.removeItem(USER_KEY);
      return;
    }

    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage quota/serialization errors.
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      signup,
      logout,
      bookings,
      setBookings,
      addBooking,
      createdRides,
      setCreatedRides,
      addCreatedRide,
      switchRole,
    }),
    [user, bookings, createdRides]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};