import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useToast } from "../components/Toast";

export default function Profile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, switchRole, logout } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-md mx-auto px-5 py-16 text-center">
          <p className="text-xl font-semibold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            You’re not logged in
          </p>
          <p className="mt-2 text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Login or sign up to view your profile.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/login" className="btn-volt" style={{ textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/signup" className="btn-outline" style={{ textDecoration: "none" }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    addToast("Logged out", "info");
    navigate("/login");
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="mb-10" style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}>
          <span className="badge badge-volt mb-3">Account</span>
          <h1
            className="text-4xl font-bold text-white mt-2"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Profile
          </h1>
          <p className="mt-2" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Your RideSync account details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile card */}
          <div
            className="glass-card gradient-border p-7 md:col-span-2"
            style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
                style={{ background: "#C8F135", color: "#0A0A0F", fontFamily: "'Clash Display', sans-serif" }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xl font-semibold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                  {user.name}
                </p>
                <p className="text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  {[user.email, user.mobile].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button onClick={switchRole} className="btn-outline" style={{ padding: "10px 16px" }}>
                Switch to {user.role === "driver" ? "Rider" : "Driver"}
              </button>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "18px 0" }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  ROLE
                </p>
                <p className="text-white font-medium" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  {user.role === "driver" ? "Driver" : "Rider"}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  STATUS
                </p>
                <span className="badge badge-slate">Active</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div
            className="glass-card p-7"
            style={{ animation: "fadeUp 0.6s ease 0.2s forwards", opacity: 0 }}
          >
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Clash Display', sans-serif", letterSpacing: "0.06em" }}
            >
              QUICK LINKS
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/bookings"
                className="btn-outline inline-flex items-center justify-center gap-2"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
                </svg>
                View Bookings
              </Link>
              <Link
                to="/search-ride"
                className="btn-volt inline-flex items-center justify-center gap-2"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                Find a Ride
              </Link>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: "12px" }}>
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
