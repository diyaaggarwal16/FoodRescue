package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.FoodListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface FoodListingRepository
        extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByStatus(String status);

    List<FoodListing> findByRestaurantId(Long restaurantId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select f from FoodListing f where f.id = :id")
    Optional<FoodListing> findByIdForUpdate(@Param("id") Long id);
}
