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
        foodListing.setRemainingQuantity(foodListing.getQuantity());
        foodListing.setStatus("AVAILABLE");
        return foodListingRepository.save(foodListing);
    }

    public List<FoodListing> getAvailableFood() {
        return foodListingRepository.findByStatus("AVAILABLE");
    }

    public List<FoodListing> getRestaurantFood(Long restaurantId) {
        return foodListingRepository.findByRestaurantId(restaurantId);
    }

    public FoodListing getListing(Long id) {
        return foodListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food listing not found"));
    }

    public FoodListing updateListing(
        Long id,
        FoodListing updatedListing,
        Long restaurantId
) {
    FoodListing existingListing = getListing(id);

    if (!existingListing.getRestaurantId().equals(restaurantId)) {
        throw new RuntimeException(
                "You can only edit your own food listings"
        );
    }

    int oldQuantity = existingListing.getQuantity();
    int oldRemaining = existingListing.getRemainingQuantity();

    int soldQuantity = oldQuantity - oldRemaining;
    int newQuantity = updatedListing.getQuantity();

    if (newQuantity < soldQuantity) {
        throw new RuntimeException(
                "Quantity cannot be less than already reserved quantity"
        );
    }

    int newRemaining = newQuantity - soldQuantity;

    existingListing.setFoodName(
            updatedListing.getFoodName()
    );

    existingListing.setDescription(
            updatedListing.getDescription()
    );

    existingListing.setQuantity(newQuantity);
    existingListing.setRemainingQuantity(newRemaining);

    existingListing.setOriginalPrice(
            updatedListing.getOriginalPrice()
    );

    existingListing.setRescuePrice(
            updatedListing.getRescuePrice()
    );
    existingListing.setAllergens(
            updatedListing.getAllergens()
    );

    existingListing.setPickupDeadline(
            updatedListing.getPickupDeadline()
    );

    if (newRemaining == 0) {
        existingListing.setStatus("SOLD_OUT");
    } else {
        existingListing.setStatus("AVAILABLE");
    }

    return foodListingRepository.save(existingListing);
}

    public void deleteListing(Long id, Long restaurantId) {
        FoodListing existingListing = getListing(id);

        if (!existingListing.getRestaurantId().equals(restaurantId)) {
            throw new RuntimeException("You can only delete your own food listings");
        }

        foodListingRepository.delete(existingListing);
    }
    
}