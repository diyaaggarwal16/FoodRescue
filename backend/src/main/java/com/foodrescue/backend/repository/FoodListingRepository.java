package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.FoodListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByStatus(String status);
}