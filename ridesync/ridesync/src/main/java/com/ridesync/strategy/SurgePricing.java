package com.ridesync.strategy;

import com.ridesync.model.Ride;
import org.springframework.stereotype.Component;

@Component("surgePricing")
public class SurgePricing implements PricingStrategy {

    @Override
    public double calculatePrice(Ride ride) {

        double basePrice = 100;

        // simulate demand (less seats = more demand)
        double demandFactor = 1 + (5.0 / ride.getAvailableSeats());

        return basePrice * demandFactor;
    }
}