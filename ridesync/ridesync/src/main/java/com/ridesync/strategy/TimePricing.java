package com.ridesync.strategy;

import com.ridesync.model.Ride;
import org.springframework.stereotype.Component;

@Component("timePricing")
public class TimePricing implements PricingStrategy {

    @Override
    public double calculatePrice(Ride ride) {

        double multiplier = 1.0;

        if ("PEAK".equalsIgnoreCase(ride.getTimeSlot())) {
            multiplier = 1.5;
        } else if ("NIGHT".equalsIgnoreCase(ride.getTimeSlot())) {
            multiplier = 1.2;
        }

        return 100 * multiplier;
    }
}
