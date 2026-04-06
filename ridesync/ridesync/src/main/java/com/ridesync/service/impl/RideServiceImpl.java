package com.ridesync.service.impl;

import com.ridesync.model.Booking;
import com.ridesync.model.Ride;
import com.ridesync.repository.BookingRepository;
import com.ridesync.repository.RideRepository;
import com.ridesync.service.RideService;
import com.ridesync.strategy.PricingStrategy;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final PricingStrategy pricingStrategy;

    public RideServiceImpl(RideRepository rideRepository,
            BookingRepository bookingRepository,
            PricingStrategy pricingStrategy) {
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
        this.pricingStrategy = pricingStrategy;
    }

    @Override
    public Ride createRide(Ride ride) {

        String departureDate = ride.getDepartureDate();
        String departureTime = ride.getDepartureTime();

        if (departureDate == null || departureDate.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Departure date is required");
        }
        if (departureTime == null || departureTime.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Departure time is required");
        }

        try {
            LocalDate date = LocalDate.parse(departureDate.trim());
            LocalTime time = LocalTime.parse(departureTime.trim());
            LocalDateTime departureDateTime = LocalDateTime.of(date, time);
            if (departureDateTime.isBefore(LocalDateTime.now())) {
                throw new ResponseStatusException(BAD_REQUEST, "Departure date/time cannot be in the past");
            }
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid departure date/time format");
        }

        // Set available seats equal to total seats initially
        ride.setAvailableSeats(ride.getTotalSeats());

        // If driver provided a price, respect it; otherwise, compute using strategy.
        if (ride.getPrice() <= 0) {
            ride.setPrice(pricingStrategy.calculatePrice(ride));
        }

        return rideRepository.save(ride);
    }

    @Override
    public List<Ride> searchRides(String source, String destination) {
        return rideRepository.findBySourceAndDestination(source, destination);
    }

    @Override
    public List<Ride> ridesByDriver(String driverId) {
        return rideRepository.findByDriverId(driverId);
    }

    @Override
    public Booking bookRide(String rideId, String userId, int seats) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        String driverId = ride.getDriverId();
        if (driverId != null && userId != null && driverId.trim().equals(userId.trim())) {
            throw new ResponseStatusException(BAD_REQUEST, "You can't book your own ride");
        }

        String departureDate = ride.getDepartureDate();
        String departureTime = ride.getDepartureTime();
        if (departureDate != null && !departureDate.isBlank() && departureTime != null && !departureTime.isBlank()) {
            try {
                LocalDate date = LocalDate.parse(departureDate.trim());
                LocalTime time = LocalTime.parse(departureTime.trim());
                LocalDateTime departureDateTime = LocalDateTime.of(date, time);
                if (departureDateTime.isBefore(LocalDateTime.now())) {
                    throw new ResponseStatusException(BAD_REQUEST, "You can't book rides in the past");
                }
            } catch (DateTimeParseException ex) {
                throw new ResponseStatusException(BAD_REQUEST, "Invalid departure date/time format");
            }
        }

        if (ride.getAvailableSeats() < seats) {
            throw new RuntimeException("Not enough seats available");
        }

        ride.setAvailableSeats(ride.getAvailableSeats() - seats);
        rideRepository.save(ride);

        Booking booking = new Booking();
        booking.setRideId(rideId);
        booking.setUserId(userId);
        booking.setSeatsBooked(seats);

        return bookingRepository.save(booking);
    }
}