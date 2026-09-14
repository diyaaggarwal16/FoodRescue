package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.service.FoodListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodListingController {

    private final FoodListingService foodListingService;

    public FoodListingController(FoodListingService foodListingService) {
        this.foodListingService = foodListingService;
    }

    @PostMapping
    public ResponseEntity<FoodListing> createListing(
            @RequestBody FoodListing foodListing
    ) {
        FoodListing savedListing =
                foodListingService.createListing(foodListing);

        return ResponseEntity.ok(savedListing);
    }

    @GetMapping
    public ResponseEntity<List<FoodListing>> getAvailableFood() {
        return ResponseEntity.ok(
                foodListingService.getAvailableFood()
        );
    }
}