package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByCustomerEmail(String customerEmail);

    List<Reservation> findByFoodListingId(Long foodListingId);
}