package com.ridesync.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookings")
@Data
public class Booking {
    @Id
    private String id;
    private String rideId;
    private String userId;
    private int seatsBooked;
}