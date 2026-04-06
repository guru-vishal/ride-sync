package com.ridesync.strategy;

import com.ridesync.model.Ride;
import org.springframework.stereotype.Component;

@Component("distancePricing")
public class DistancePricing implements PricingStrategy {

    @Override
    public double calculatePrice(Ride ride) {
        double baseFare = 50;
        double perKm = 10;

        return baseFare + (ride.getDistance() * perKm);
    }
}
