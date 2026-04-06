package com.ridesync.strategy;

import com.ridesync.model.Ride;
import org.springframework.stereotype.Component;

@Component("seatPricing")
public class SeatPricing implements PricingStrategy {

    @Override
    public double calculatePrice(Ride ride) {

        // fewer seats = higher price per seat
        int seats = ride.getAvailableSeats();

        if (seats <= 2) return 200;
        if (seats <= 4) return 150;

        return 100;
    }
}