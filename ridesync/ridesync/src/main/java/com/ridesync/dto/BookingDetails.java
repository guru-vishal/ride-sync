package com.ridesync.dto;

import com.ridesync.model.Ride;

public record BookingDetails(
        String id,
        String rideId,
        String userId,
        int seatsBooked,
        Ride ride) {
}
