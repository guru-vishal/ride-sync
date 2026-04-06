package com.ridesync.controller;

import com.ridesync.dto.BookingDetails;
import com.ridesync.model.Booking;
import com.ridesync.model.Ride;
import com.ridesync.repository.BookingRepository;
import com.ridesync.repository.RideRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;

    public BookingController(BookingRepository bookingRepository, RideRepository rideRepository) {
        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
    }

    @GetMapping("/user/{userId}")
    public List<BookingDetails> bookingsByUser(@PathVariable String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);

        List<String> rideIds = bookings.stream()
                .map(Booking::getRideId)
                .distinct()
                .collect(Collectors.toList());

        Map<String, Ride> ridesById = new HashMap<>();
        rideRepository.findAllById(rideIds).forEach(ride -> ridesById.put(ride.getId(), ride));

        return bookings.stream()
                .map(b -> new BookingDetails(
                        b.getId(),
                        b.getRideId(),
                        b.getUserId(),
                        b.getSeatsBooked(),
                        ridesById.get(b.getRideId())))
                .collect(Collectors.toList());
    }
}
