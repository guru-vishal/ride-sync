package com.ridesync.strategy;

import com.ridesync.model.Ride;
import org.springframework.stereotype.Component;

@Component
public class AdvancedPricingStrategy implements PricingStrategy {

    @Override
    public double calculatePrice(Ride ride) {

        double baseFare = 50;
        double perKm = 10;

        double distanceCost = baseFare + (ride.getDistance() * perKm);

        double timeMultiplier = 1.0;
        if ("PEAK".equalsIgnoreCase(ride.getTimeSlot())) {
            timeMultiplier = 1.5;
        } else if ("NIGHT".equalsIgnoreCase(ride.getTimeSlot())) {
            timeMultiplier = 1.2;
        }

        double demandFactor = 1 + (5.0 / ride.getAvailableSeats());

        return distanceCost * timeMultiplier * demandFactor;
    }
}