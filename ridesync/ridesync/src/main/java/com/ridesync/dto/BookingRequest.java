package com.ridesync.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private String rideId;
    private String userId;
    private int seats;
}