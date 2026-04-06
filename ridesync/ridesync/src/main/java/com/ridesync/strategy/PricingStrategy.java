package com.ridesync.strategy;

import com.ridesync.model.Ride;

public interface PricingStrategy {
    double calculatePrice(Ride ride);
}