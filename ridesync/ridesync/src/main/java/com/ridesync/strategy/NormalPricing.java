package com.ridesync.strategy;

import com.ridesync.model.Ride;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Primary
@Component
public class NormalPricing implements PricingStrategy {
    @Override
    public double calculatePrice(Ride ride) {
        return 100.0;
    }
}