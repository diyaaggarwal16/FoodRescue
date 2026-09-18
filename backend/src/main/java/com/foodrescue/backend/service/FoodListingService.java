package com.foodrescue.backend.service;

import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.repository.FoodListingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodListingService {

    private final FoodListingRepository foodListingRepository;

    public FoodListingService(FoodListingRepository foodListingRepository) {
        this.foodListingRepository = foodListingRepository;
    }

    public FoodListing createListing(FoodListing foodListing) {

        foodListing.setRemainingQuantity(
                foodListing.getQuantity()
        );

        foodListing.setStatus("AVAILABLE");

        return foodListingRepository.save(foodListing);
    }

    public List<FoodListing> getAvailableFood() {

        return foodListingRepository.findByStatus("AVAILABLE");
    }
}