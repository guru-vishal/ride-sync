package com.ridesync.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rides")
@Data
public class Ride {
    @Id
    private String id;
    private String driverId;
    private String source;
    private String destination;
    private int totalSeats;
    private int availableSeats;
    private String vehicleNo;
    private String vehicleModel;
    // Store as string (e.g. "2026-04-06") to keep the API simple for the React
    // client.
    private String departureDate;
    // Store as string (e.g. "08:30") to keep the API simple for the React client.
    private String departureTime;
    private double price;
    private double distance; // in km
    private String timeSlot; // PEAK / NORMAL / NIGHT
}