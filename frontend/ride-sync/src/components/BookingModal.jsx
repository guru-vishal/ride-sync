import React, { useState, useEffect } from "react";
import { ridesService } from "../services/ridesService";
import { useUser } from "../context/UserContext";
import { useToast } from "./Toast";

export default function BookingModal({ ride, onClose, onSuccess }) {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { user, addBooking } = useUser();
  const { addToast } = useToast();

  const maxSeats = ride?.availableSeats ?? 0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBook = async () => {
    const riderId = (user?.userId || "").toString().trim();
    const driverId = (ride?.driverId || "").toString().trim();
    if (riderId && driverId && riderId === driverId) {
      addToast("You can't book your own ride", "error");
      return;
    }

    if (ride?.departureDate && ride?.departureTime) {
      const [y, m, d] = ride.departureDate.split("-").map((v) => Number(v));
      const [hh, mm] = ride.departureTime.split(":").map((v) => Number(v));
      const hasValidParts =
        Number.isFinite(y) &&
        Number.isFinite(m) &&
        Number.isFinite(d) &&
        Number.isFinite(hh) &&
        Number.isFinite(mm);

      if (hasValidParts) {
        const departure = new Date(y, m - 1, d, hh, mm, 0, 0);
        if (!Number.isNaN(departure.getTime()) && departure.getTime() < Date.now()) {
          addToast("You can't book rides in the past", "error");
          return;
        }
      }
    }

    if (seats < 1 || seats > maxSeats) {
      addToast(`Please select between 1 and ${maxSeats} seats`, "error");
      return;
    }

    setLoading(true);
    try {
      const booked = await ridesService.bookRide({
        rideId: ride.id || ride.rideId,
        userId: user.userId,
        seats,
      });

      const booking = {
        ...ride,
        rideId: booked?.rideId || ride.id || ride.rideId,
        userId: booked?.userId || user.userId,
        seatsBooked: booked?.seatsBooked ?? seats,
        bookingId: booked?.id || `BK-${Date.now()}`,
        bookedAt: new Date().toISOString(),
      };
      addBooking(booking);
      setConfirmed(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2500);
    } catch (err) {
      addToast(err.userMessage || "Booking failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md gradient-border"
        style={{
          background: "#141420",
          animation: "fadeUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        {confirmed ? (
          <ConfirmationView ride={ride} seats={seats} />
        ) : (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Book Ride
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "#8891A4", background: "rgba(255,255,255,0.05)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Route summary */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: "rgba(200,241,53,0.05)", border: "1px solid rgba(200,241,53,0.15)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "#8891A4" }}>FROM</p>
                  <p className="font-semibold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                    {ride.source}
                  </p>
                </div>
                <div style={{ color: "#C8F135" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-0.5" style={{ color: "#8891A4" }}>TO</p>
                  <p className="font-semibold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                    {ride.destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Passenger info */}
            <div className="mb-5 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs mb-1" style={{ color: "#8891A4" }}>PASSENGER</p>
              <p className="font-medium text-white text-sm" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {user.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8891A4" }}>{user.userId}</p>
            </div>

            {/* Seat selector */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "#fff", fontFamily: "'Satoshi', sans-serif" }}
              >
                Seats to book
                <span className="ml-2 text-xs" style={{ color: "#8891A4" }}>
                  ({maxSeats} available)
                </span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "18px",
                  }}
                >
                  −
                </button>
                <div
                  className="flex-1 text-center py-2.5 rounded-xl text-lg font-bold"
                  style={{
                    background: "rgba(200,241,53,0.08)",
                    border: "1px solid rgba(200,241,53,0.2)",
                    color: "#C8F135",
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  {seats}
                </div>
                <button
                  onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "18px",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price */}
            {ride.price && (
              <div
                className="flex justify-between items-center p-3 rounded-xl mb-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  Total ({seats} × ₹{ride.price})
                </span>
                <span
                  className="font-bold"
                  style={{ color: "#C8F135", fontFamily: "'Clash Display', sans-serif", fontSize: "18px" }}
                >
                  ₹{seats * ride.price}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-outline flex-1">
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={loading}
                className="btn-volt flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full animate-spin"
                      style={{ border: "2px solid transparent", borderTopColor: "#0A0A0F" }}
                    />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmationView({ ride, seats }) {
  return (
    <div className="p-8 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(200,241,53,0.15)", border: "2px solid #C8F135" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3
        className="text-2xl font-bold text-white mb-2"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        Ride Booked!
      </h3>
      <p className="text-sm mb-5" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
        Your {seats} seat{seats > 1 ? "s" : ""} from{" "}
        <strong style={{ color: "white" }}>{ride.source}</strong> to{" "}
        <strong style={{ color: "white" }}>{ride.destination}</strong> has been confirmed.
      </p>
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
        style={{ background: "rgba(200,241,53,0.1)", color: "#C8F135", border: "1px solid rgba(200,241,53,0.2)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Track your driver on the app
      </div>
    </div>
  );
}