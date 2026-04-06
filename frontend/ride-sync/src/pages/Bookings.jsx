import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import RideCard from "../components/RideCard";
import { ridesService } from "../services/ridesService";

export default function Bookings() {
  const { user, bookings, setBookings, createdRides, setCreatedRides } = useUser();

  useEffect(() => {
    if (!user?.userId) return;

    let cancelled = false;

    const load = async () => {
      try {
        const bookingDetails = await ridesService.getBookingsByUser(user.userId);
        if (!cancelled) {
          const normalized = (bookingDetails || [])
            .filter((b) => b?.ride)
            .map((b) => ({
              ...b.ride,
              bookingId: b.id,
              seatsBooked: b.seatsBooked,
            }));
          setBookings(normalized);
        }
      } catch {
        // Keep existing UI state on load failure.
      }

      if (user.role !== "driver") {
        if (!cancelled) setCreatedRides([]);
        return;
      }

      try {
        const rides = await ridesService.getRidesByDriver(user.userId);
        if (!cancelled) setCreatedRides(rides || []);
      } catch {
        // Keep existing UI state on load failure.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.userId, user?.role, setBookings, setCreatedRides]);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Header */}
        <div
          className="mb-10"
          style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}
        >
          <span className="badge badge-volt mb-3">Activity</span>
          <h1
            className="text-4xl font-bold text-white mt-2"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Your Rides
          </h1>
          <p className="mt-2" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Track your bookings and rides you've created.
          </p>
        </div>

        {/* Booked rides */}
        <section
          className="mb-10"
          style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Booked Rides
            </h2>
            <span className="badge badge-slate">{bookings.length}</span>
          </div>

          {bookings.length === 0 ? (
            <div
              className="glass-card p-10 text-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(136,145,164,0.08)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p
                className="text-base font-semibold text-white mb-1"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                No bookings yet
              </p>
              <p className="text-sm mb-5" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                Find a ride that matches your route and book instantly.
              </p>
              <Link
                to="/search-ride"
                className="btn-volt inline-flex items-center gap-2"
                style={{ textDecoration: "none" }}
              >
                Search Rides →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking, i) => (
                <div key={booking.bookingId || i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <RideCard ride={booking} showBookButton={false} isBooked />
                  <div
                    className="mt-2 px-1 flex items-center justify-between text-xs"
                    style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}
                  >
                    <span>{booking.bookingId}</span>
                    <span>{booking.seatsBooked} seat{booking.seatsBooked > 1 ? "s" : ""} booked</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Created rides */}
        <section
          style={{ animation: "fadeUp 0.6s ease 0.2s forwards", opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Rides You Created
            </h2>
            <span className="badge badge-slate">{createdRides.length}</span>
          </div>

          {createdRides.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(136,145,164,0.08)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="1.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </div>
              <p
                className="text-base font-semibold text-white mb-1"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                No rides created
              </p>
              <p className="text-sm mb-5" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                Offer a ride to split costs with fellow commuters.
              </p>
              <Link
                to="/create-ride"
                className="btn-volt inline-flex items-center gap-2"
                style={{ textDecoration: "none" }}
              >
                Create a Ride →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {createdRides.map((ride, i) => (
                <div key={ride.id || i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <RideCard ride={ride} showBookButton={false} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}