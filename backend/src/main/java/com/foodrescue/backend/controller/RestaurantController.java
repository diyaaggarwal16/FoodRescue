package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantController(
            RestaurantRepository restaurantRepository,
            UserRepository userRepository
    ) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(
            @RequestBody Restaurant restaurant,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email = jwt.getClaimAsString("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!"RESTAURANT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity
                    .status(403)
                    .body("Only restaurant users can create a restaurant profile");
        }

        if (restaurantRepository.findByUserId(user.getId()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Restaurant profile already exists");
        }

        restaurant.setUserId(user.getId());

        if (restaurant.getVerificationStatus() == null) {
            restaurant.setVerificationStatus("PENDING");
        }

        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        return ResponseEntity.ok(savedRestaurant);
    }

    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile(
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email = jwt.getClaimAsString("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return restaurantRepository
                .findByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}