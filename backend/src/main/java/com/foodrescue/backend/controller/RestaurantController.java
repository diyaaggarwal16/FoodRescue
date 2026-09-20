package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.Reservation;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.FoodListingRepository;
import com.foodrescue.backend.repository.ReservationRepository;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final FoodListingRepository foodListingRepository;
    private final ReservationRepository reservationRepository;

    public RestaurantController(
            RestaurantRepository restaurantRepository,
            UserRepository userRepository,
            FoodListingRepository foodListingRepository,
            ReservationRepository reservationRepository
    ) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.foodListingRepository = foodListingRepository;
        this.reservationRepository = reservationRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(
            @RequestBody Restaurant restaurant,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!"RESTAURANT".equalsIgnoreCase(
                user.getRole()
        )) {
            return ResponseEntity
                    .status(403)
                    .body(
                            "Only restaurant users can create a restaurant profile"
                    );
        }

        if (restaurantRepository
                .findByUserId(user.getId())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Restaurant profile already exists"
                    );
        }

        Restaurant newRestaurant =
                new Restaurant();

        newRestaurant.setUserId(
                user.getId()
        );

        newRestaurant.setRestaurantName(
                restaurant.getRestaurantName()
        );

        newRestaurant.setAddress(
                restaurant.getAddress()
        );

        newRestaurant.setPhone(
                restaurant.getPhone()
        );

        newRestaurant.setVerificationStatus(
                "PENDING"
        );

        Restaurant savedRestaurant =
                restaurantRepository.save(
                        newRestaurant
                );

        return ResponseEntity.ok(
                savedRestaurant
        );
    }

    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile(
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!"RESTAURANT".equalsIgnoreCase(
                user.getRole()
        )) {
            return ResponseEntity
                    .status(403)
                    .body(
                            "Only restaurant users can access a restaurant profile"
                    );
        }

        return restaurantRepository
                .findByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Restaurant updatedRestaurant,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!"RESTAURANT".equalsIgnoreCase(
                user.getRole()
        )) {
            return ResponseEntity
                    .status(403)
                    .body(
                            "Only restaurant users can update a restaurant profile"
                    );
        }

        Restaurant restaurant =
                restaurantRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Restaurant profile not found"
                                )
                        );

        restaurant.setRestaurantName(
                updatedRestaurant.getRestaurantName()
        );

        restaurant.setAddress(
                updatedRestaurant.getAddress()
        );

        restaurant.setPhone(
                updatedRestaurant.getPhone()
        );

        Restaurant savedRestaurant =
                restaurantRepository.save(
                        restaurant
                );

        return ResponseEntity.ok(
                savedRestaurant
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!"RESTAURANT".equalsIgnoreCase(
                user.getRole()
        )) {
            return ResponseEntity
                    .status(403)
                    .body(
                            "Only restaurant users can access the restaurant dashboard"
                    );
        }

        Restaurant restaurant =
                restaurantRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Restaurant profile not found"
                                )
                        );

        Long restaurantId =
                restaurant.getId();

        List<FoodListing> foodListings =
                foodListingRepository
                        .findByRestaurantId(
                                restaurantId
                        );

        int totalFoodListings =
                foodListings.size();

        int availableFoodListings = 0;

        int totalQuantity = 0;

        int remainingQuantity = 0;

        int totalReservations = 0;

        int reservedQuantity = 0;

        double totalRevenue = 0.0;

        for (FoodListing foodListing :
                foodListings) {

            if ("AVAILABLE".equalsIgnoreCase(
                    foodListing.getStatus()
            )) {
                availableFoodListings++;
            }

            if (foodListing.getQuantity() != null) {
                totalQuantity +=
                        foodListing.getQuantity();
            }

            if (foodListing.getRemainingQuantity() != null) {
                remainingQuantity +=
                        foodListing
                                .getRemainingQuantity();
            }

            List<Reservation> reservations =
                    reservationRepository
                            .findByFoodListingId(
                                    foodListing.getId()
                            );

            totalReservations +=
                    reservations.size();

            for (Reservation reservation :
                    reservations) {

                if (reservation.getQuantity() != null) {
                    reservedQuantity +=
                            reservation.getQuantity();
                }

                if (reservation.getTotalPrice() != null) {
                    totalRevenue +=
                            reservation
                                    .getTotalPrice();
                }
            }
        }

        Map<String, Object> dashboard =
                new HashMap<>();

        dashboard.put(
                "restaurantId",
                restaurantId
        );

        dashboard.put(
                "restaurantName",
                restaurant.getRestaurantName()
        );

        dashboard.put(
                "verificationStatus",
                restaurant.getVerificationStatus()
        );

        dashboard.put(
                "totalFoodListings",
                totalFoodListings
        );

        dashboard.put(
                "availableFoodListings",
                availableFoodListings
        );

        dashboard.put(
                "totalQuantity",
                totalQuantity
        );

        dashboard.put(
                "remainingQuantity",
                remainingQuantity
        );

        dashboard.put(
                "totalReservations",
                totalReservations
        );

        dashboard.put(
                "reservedQuantity",
                reservedQuantity
        );

        dashboard.put(
                "totalRevenue",
                totalRevenue
        );

        return ResponseEntity.ok(
                dashboard
        );
    }
}