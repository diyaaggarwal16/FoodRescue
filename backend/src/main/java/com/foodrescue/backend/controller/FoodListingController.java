package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.FoodListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodListingController {

    private final FoodListingService foodListingService;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public FoodListingController(
            FoodListingService foodListingService,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository
    ) {
        this.foodListingService = foodListingService;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> createListing(
            @RequestBody FoodListing foodListing,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email = jwt.getClaimAsString("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Restaurant profile not found"));

        foodListing.setRestaurantId(restaurant.getId());
        foodListing.setRestaurantName(restaurant.getRestaurantName());

        FoodListing savedListing =
                foodListingService.createListing(foodListing);

        return ResponseEntity.ok(savedListing);
    }

    @GetMapping
    public ResponseEntity<List<FoodListing>> getAvailableFood() {
        return ResponseEntity.ok(foodListingService.getAvailableFood());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(
            @PathVariable Long id
    ) {
        try {
            return ResponseEntity.ok(
                    foodListingService.getListing(id)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodListing>> getRestaurantFood(
            @PathVariable Long restaurantId
    ) {
        return ResponseEntity.ok(
                foodListingService.getRestaurantFood(restaurantId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> updateListing(
            @PathVariable Long id,
            @RequestBody FoodListing foodListing,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            Long restaurantId = getRestaurantId(jwt);

            FoodListing updatedListing =
                    foodListingService.updateListing(
                            id,
                            foodListing,
                            restaurantId
                    );

            return ResponseEntity.ok(updatedListing);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> deleteListing(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            Long restaurantId = getRestaurantId(jwt);

            foodListingService.deleteListing(id, restaurantId);

            return ResponseEntity.ok(
                    "Food listing deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Long getRestaurantId(Jwt jwt) {
        String email = jwt.getClaimAsString("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Restaurant profile not found"));

        return restaurant.getId();
    }
}