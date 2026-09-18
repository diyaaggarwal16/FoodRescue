package com.foodrescue.backend.service;

import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.repository.FoodNeedRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodNeedService {

    private final FoodNeedRepository foodNeedRepository;

    public FoodNeedService(
            FoodNeedRepository foodNeedRepository
    ) {
        this.foodNeedRepository = foodNeedRepository;
    }

    public FoodNeed createNeed(FoodNeed foodNeed) {

        if (foodNeed.getFoodType() == null ||
                foodNeed.getFoodType().trim().isEmpty()) {
            throw new RuntimeException(
                    "Food type is required"
            );
        }

        if (foodNeed.getQuantityNeeded() == null ||
                foodNeed.getQuantityNeeded() <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        if (foodNeed.getNeededBy() == null) {
            throw new RuntimeException(
                    "Needed-by deadline is required"
            );
        }

        if (foodNeed.getNeededBy()
                .isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Needed-by deadline must be in the future"
            );
        }

        if (foodNeed.getLocation() == null ||
                foodNeed.getLocation().trim().isEmpty()) {
            throw new RuntimeException(
                    "Location is required"
            );
        }

        if (foodNeed.getUrgency() == null ||
                foodNeed.getUrgency().trim().isEmpty()) {
            throw new RuntimeException(
                    "Urgency is required"
            );
        }

        if (foodNeed.getAllowPurchase() == null) {
            foodNeed.setAllowPurchase(false);
        }

        foodNeed.setQuantityFulfilled(0);
        foodNeed.setStatus("OPEN");
        foodNeed.setCreatedAt(LocalDateTime.now());

        return foodNeedRepository.save(foodNeed);
    }

    public List<FoodNeed> getNeedsByNgo(
            Long ngoId
    ) {
        return foodNeedRepository.findByNgoId(
                ngoId
        );
    }

    public List<FoodNeed> getOpenNeeds() {
        return foodNeedRepository.findByStatus(
                "OPEN"
        );
    }
}