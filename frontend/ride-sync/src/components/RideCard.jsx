import React, { useEffect, useMemo, useState } from "react";
import { usersService } from "../services/usersService";

const driverNameCache = new Map();

const RouteArrow = () => (
  <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
    <path
      d="M0 10 Q15 4 30 10 Q45 16 60 10"
      stroke="#C8F135"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      fill="none"
      opacity="0.6"
    />
    <circle cx="0" cy="10" r="3" fill="#C8F135" opacity="0.8" />
    <polygon points="57,7 63,10 57,13" fill="#C8F135" opacity="0.8" />
  </svg>
);

export default function RideCard({ ride, onBook, showBookButton = true, isBooked = false }) {
  const [hovered, setHovered] = useState(false);
  const driverId = useMemo(() => (ride?.driverId || "").toString().trim(), [ride?.driverId]);
  const [driverName, setDriverName] = useState(() => (driverId ? driverNameCache.get(driverId) || "" : ""));

  useEffect(() => {
    if (!driverId) {
      setDriverName("");
      return;
    }

    const cached = driverNameCache.get(driverId);
    if (cached) {
      setDriverName(cached);
      return;
    }

    let cancelled = false;
    usersService
      .getUserPublic(driverId)
      .then((data) => {
        const nextName = (data?.name || "").toString().trim();
        if (!nextName) return;
        driverNameCache.set(driverId, nextName);
        if (!cancelled) setDriverName(nextName);
      })
      .catch(() => {
        // Silently fall back to generic label.
      });

    return () => {
      cancelled = true;
    };
  }, [driverId]);
  const seatsLeft = ride.availableSeats ?? 0;
  const hasSeats = seatsLeft > 0;

  const distanceValue = Number.isFinite(ride?.distance) ? ride.distance : null;
  const distanceLabel = distanceValue === null ? "—" : `${distanceValue} km`;

  const timeSlotLabel = (ride?.timeSlot || "").toString().trim().toUpperCase();
  const showTimeSlot = Boolean(timeSlotLabel);

  const vehicleLabel = [ride?.vehicleNo, ride?.vehicleModel].filter(Boolean).join(" · ");
  const showVehicle = Boolean(vehicleLabel);

  const formatDate = () => {
    const raw = (ride?.departureDate || "").toString().trim();
    if (!raw) return "";

    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return raw;

    const [, y, m, d] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString([], { month: "short", day: "2-digit" });
  };

  const formatTime = () => {
    const raw = (ride?.departureTime || "").toString().trim();
    if (raw) {
      // Convert 24h times from <input type="time"> (e.g., "13:05") into 12h AM/PM.
      const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
      if (match) {
        const hh = Number(match[1]);
        const mm = Number(match[2]);
        if (Number.isFinite(hh) && Number.isFinite(mm)) {
          const period = hh >= 12 ? "PM" : "AM";
          const hour12 = ((hh + 11) % 12) + 1;
          const minute2 = String(mm).padStart(2, "0");
          return `${hour12}:${minute2} ${period}`;
        }
      }

      // If backend ever returns already-formatted time, keep it.
      return raw;
    }
    // If a date is explicitly provided but time isn't, don't invent a time.
    if (ride.departureDate) return "";
    const now = new Date();
    now.setHours(now.getHours() + Math.floor(Math.random() * 5) + 1);
    return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const departureLabel = [formatDate(), formatTime()].filter(Boolean).join(" · ") || "—";
  const driverInitial = (driverName || driverId || "D").toString().charAt(0).toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass-card glass-card-hover p-5 cursor-default"
      style={{
        animation: "fadeUp 0.5s ease forwards",
        opacity: 0,
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #C8F135, #a8d020)",
              color: "#0A0A0F",
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            {driverInitial}
          </div>
          <div>
            <p className="text-sm font-medium text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {driverName || "Driver"}
            </p>
            <p className="text-xs" style={{ color: "#8891A4" }}>
              Driver
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isBooked && (
            <span className="badge badge-volt">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Booked
            </span>
          )}
          {!hasSeats && !isBooked && (
            <span
              className="badge"
              style={{
                background: "rgba(255,80,80,0.1)",
                color: "#ff5050",
                border: "1px solid rgba(255,80,80,0.2)",
              }}
            >
              Full
            </span>
          )}
          {ride.price && (
            <span
              className="font-bold text-base"
              style={{ color: "#C8F135", fontFamily: "'Clash Display', sans-serif" }}
            >
              ₹{ride.price}
            </span>
          )}
        </div>
      </div>

      {(showVehicle || showTimeSlot) && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            {showVehicle ? vehicleLabel : ""}
          </p>
          {showTimeSlot && (
            <span className="badge badge-slate" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {timeSlotLabel}
            </span>
          )}
        </div>
      )}

      {/* Route */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs mb-1" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            FROM
          </p>
          <p className="font-semibold text-white text-sm" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            {ride.source}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <RouteArrow />
          <p className="text-xs" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            {distanceLabel}
          </p>
        </div>

        <div className="flex-1 text-right">
          <p className="text-xs mb-1" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            TO
          </p>
          <p className="font-semibold text-white text-sm" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            {ride.destination}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "16px" }} />

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Seats */}
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
            </svg>
            <span className="text-xs" style={{ color: hasSeats ? "#C8F135" : "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
              {seatsLeft} seat{seatsLeft !== 1 ? "s" : ""} left
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
            </svg>
            <span className="text-xs" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
              {departureLabel}
            </span>
          </div>
        </div>

        {/* Seat dots visualization */}
        <div className="flex gap-1">
          {Array.from({ length: Math.min(ride.totalSeats || 4, 4) }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i < seatsLeft ? "#C8F135" : "rgba(255,255,255,0.1)",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Book button */}
      {showBookButton && !isBooked && (
        <div className="mt-4">
          <button
            onClick={() => onBook && onBook(ride)}
            disabled={!hasSeats}
            className="btn-volt w-full"
            style={{
              transform: hovered && hasSeats ? "translateY(-1px)" : "translateY(0)",
              boxShadow: hovered && hasSeats ? "0 8px 25px rgba(200,241,53,0.3)" : "none",
            }}
          >
            {hasSeats ? "Book Ride →" : "No Seats Available"}
          </button>
        </div>
      )}
    </div>
  );
}
