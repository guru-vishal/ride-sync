package com.ridesync.service;

import com.ridesync.model.Booking;
import com.ridesync.model.Ride;

import java.util.List;

public interface RideService {
    Ride createRide(Ride ride);

    List<Ride> searchRides(String source, String destination);

    List<Ride> ridesByDriver(String driverId);

    Booking bookRide(String rideId, String userId, int seats);
}