package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.DonatedMeal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonatedMealRepository
        extends JpaRepository<DonatedMeal, Long> {

    List<DonatedMeal> findByStatus(String status);

    List<DonatedMeal> findByClaimedByNgoId(Long claimedByNgoId);

    List<DonatedMeal> findByReservationId(Long reservationId);
}