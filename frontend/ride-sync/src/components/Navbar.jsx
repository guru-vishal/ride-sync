import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="10" fill="#C8F135" />
    <path d="M8 22L14 10L20 16L24 10" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="10" r="2" fill="#0A0A0F" />
    <circle cx="8" cy="22" r="2" fill="#0A0A0F" />
  </svg>
);

const navLinks = [
  {
    path: "/",
    label: "Home",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    path: "/create-ride",
    label: "Drive",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 17l2-6h14l2 6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 11l2-5h10l2 5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    path: "/search-ride",
    label: "Ride",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 1a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, switchRole } = useUser();

  const visibleLinks = navLinks.filter((link) => {
    if (!user) return link.path === "/";
    if (link.path === "/create-ride") return user.role === "driver";
    return true;
  });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(10,10,15,0.92)"
            : "rgba(10,10,15,0.5)",
          backdropFilter: "blur(24px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="transition-transform duration-300 group-hover:rotate-12">
              <Logo />
            </div>
            <span
              style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "18px" }}
              className="text-white"
            >
              Ride<span style={{ color: "#C8F135" }}>Sync</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ path, label, icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    color: active ? "#C8F135" : "#8891A4",
                  }}
                >
                  {active && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(200,241,53,0.08)" }}
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    <span className="opacity-90">{icon}</span>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={switchRole}
                  className="badge badge-slate cursor-pointer hover:border-volt transition-colors"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: user.role === "driver" ? "#C8F135" : "#8891A4" }}
                  />
                  {user.role === "driver" ? "Driver Mode" : "Rider Mode"}
                </button>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}
                  aria-label="Go to profile"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#C8F135", color: "#0A0A0F", fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {user.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-outline"
                  style={{ textDecoration: "none", padding: "10px 16px" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-volt"
                  style={{ textDecoration: "none", padding: "10px 16px" }}
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#8891A4" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-5 pb-5 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {visibleLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center py-3 text-sm"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  color: location.pathname === path ? "#C8F135" : "#8891A4",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="mr-2 opacity-90">{icon}</span>
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="pt-3 flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "#C8F135", color: "#0A0A0F", fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                        {user.name}
                      </p>
                      <p className="text-xs" style={{ color: "#8891A4" }}>
                        {user.userId}
                      </p>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-volt w-full mt-4"
                  style={{ textDecoration: "none", textAlign: "center", padding: "12px" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-outline w-full mt-2"
                  style={{ textDecoration: "none", textAlign: "center", padding: "12px" }}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}