package com.ridesync.controller;

import com.ridesync.dto.BookingRequest;
import com.ridesync.model.Booking;
import com.ridesync.model.Ride;
import com.ridesync.service.RideService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping
    public Ride createRide(@RequestBody Ride ride) {
        return rideService.createRide(ride);
    }

    @GetMapping
    public List<Ride> searchRides(@RequestParam String source,
            @RequestParam String destination) {
        return rideService.searchRides(source, destination);
    }

    @GetMapping("/driver/{driverId}")
    public List<Ride> ridesByDriver(@PathVariable String driverId) {
        return rideService.ridesByDriver(driverId);
    }

    @PostMapping("/book")
    public Booking bookRide(@RequestBody BookingRequest request) {
        return rideService.bookRide(
                request.getRideId(),
                request.getUserId(),
                request.getSeats());
    }
}