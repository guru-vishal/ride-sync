import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/Toast";
import { UserProvider } from "./context/UserContext";
import { useUser } from "./context/UserContext";
import HomePage from "./pages/Home";
import CreateRidePage from "./pages/CreateRide";
import SearchRidePage from "./pages/SearchRide";
import BookingsPage from "./pages/Bookings";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFound";
import "./index.css";

function RequireAuth({ children }) {
  const { user } = useUser();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function AppContent() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create-ride"
          element={
            <RequireAuth>
              <CreateRidePage />
            </RequireAuth>
          }
        />
        <Route
          path="/search-ride"
          element={
            <RequireAuth>
              <SearchRidePage />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <BookingsPage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <UserProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </UserProvider>
    </Router>
  );
}