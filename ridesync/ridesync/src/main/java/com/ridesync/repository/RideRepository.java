package com.ridesync.repository;

import com.ridesync.model.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RideRepository extends MongoRepository<Ride, String> {
    List<Ride> findBySourceAndDestination(String source, String destination);

    List<Ride> findByDriverId(String driverId);
}