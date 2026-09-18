package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.DonatedMealResponse;
import com.foodrescue.backend.model.DonatedMeal;
import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.DonatedMealRepository;
import com.foodrescue.backend.repository.FoodListingRepository;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.PickupOtpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donated-meals")
@CrossOrigin(origins = "http://localhost:5173")
public class DonatedMealController {

    private final DonatedMealRepository donatedMealRepository;
    private final NGORepository ngoRepository;
    private final UserRepository userRepository;
    private final FoodListingRepository foodListingRepository;
    private final RestaurantRepository restaurantRepository;
    private final PickupOtpService pickupOtpService;

    public DonatedMealController(
            DonatedMealRepository donatedMealRepository,
            NGORepository ngoRepository,
            UserRepository userRepository,
            FoodListingRepository foodListingRepository,
            RestaurantRepository restaurantRepository,
            PickupOtpService pickupOtpService
    ) {
        this.donatedMealRepository =
                donatedMealRepository;

        this.ngoRepository =
                ngoRepository;

        this.userRepository =
                userRepository;

        this.foodListingRepository =
                foodListingRepository;

        this.restaurantRepository =
                restaurantRepository;

        this.pickupOtpService =
                pickupOtpService;
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<DonatedMealResponse>>
    getAvailableMeals() {

        List<DonatedMeal> meals =
                donatedMealRepository
                        .findByStatus("AVAILABLE");

        List<DonatedMealResponse> response =
                meals.stream()
                        .map(meal -> {

                            DonatedMealResponse item =
                                    new DonatedMealResponse();

                            item.setId(
                                    meal.getId()
                            );

                            item.setFoodListingId(
                                    meal.getFoodListingId()
                            );

                            item.setQuantity(
                                    meal.getQuantity()
                            );

                            item.setStatus(
                                    meal.getStatus()
                            );

                            FoodListing food =
                                    foodListingRepository
                                            .findById(
                                                    meal.getFoodListingId()
                                            )
                                            .orElse(null);

                            if (food != null) {

                                item.setFoodName(
                                        food.getFoodName()
                                );

                                item.setRestaurantName(
                                        food.getRestaurantName()
                                );

                                item.setPickupDeadline(
                                        food.getPickupDeadline()
                                );

                                item.setAllergens(
                                        food.getAllergens()
                                );
                            }

                            return item;
                        })
                        .toList();

        return ResponseEntity.ok(
                response
        );
    }

    @PutMapping("/{id}/claim")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> claimMeal(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email =
                    jwt.getClaimAsString("email");

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            NGO ngo =
                    ngoRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "NGO profile not found"
                                    )
                            );

            if (!"VERIFIED".equalsIgnoreCase(
                    ngo.getVerificationStatus()
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Only verified NGOs can claim donated meals"
                        );
            }

            DonatedMeal meal =
                    donatedMealRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Donated meal not found"
                                    )
                            );

            if (!"AVAILABLE".equals(
                    meal.getStatus()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "This meal is no longer available"
                        );
            }

            meal.setClaimedByNgoId(
                    ngo.getId()
            );

            meal.setStatus(
                    "CLAIMED"
            );

            DonatedMeal savedMeal =
                    donatedMealRepository.save(
                            meal
                    );

            return ResponseEntity.ok(
                    savedMeal
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/my-claimed")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> getMyClaimedMeals(
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email =
                    jwt.getClaimAsString("email");

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            NGO ngo =
                    ngoRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "NGO profile not found"
                                    )
                            );

            List<DonatedMeal> meals =
                    donatedMealRepository
                            .findByClaimedByNgoId(
                                    ngo.getId()
                            );

            List<DonatedMealResponse> response =
                    meals.stream()
                            .map(meal -> {

                                DonatedMealResponse item =
                                        new DonatedMealResponse();

                                item.setId(
                                        meal.getId()
                                );

                                item.setFoodListingId(
                                        meal.getFoodListingId()
                                );

                                item.setQuantity(
                                        meal.getQuantity()
                                );

                                item.setStatus(
                                        meal.getStatus()
                                );

                                if ("READY_FOR_PICKUP".equals(
                                        meal.getStatus()
                                )) {
                                    item.setPickupOtp(
                                            meal.getPickupOtp()
                                    );
                                }

                                FoodListing food =
                                        foodListingRepository
                                                .findById(
                                                        meal.getFoodListingId()
                                                )
                                                .orElse(null);

                                if (food != null) {

                                    item.setFoodName(
                                            food.getFoodName()
                                    );

                                    item.setRestaurantName(
                                            food.getRestaurantName()
                                    );

                                    item.setPickupDeadline(
                                            food.getPickupDeadline()
                                    );

                                    item.setAllergens(
                                            food.getAllergens()
                                    );
                                }

                                return item;
                            })
                            .toList();

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> getRestaurantDonatedMeals(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email =
                    jwt.getClaimAsString("email");

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            Restaurant restaurant =
                    restaurantRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Restaurant profile not found"
                                    )
                            );

            if (!restaurant.getId().equals(
                    restaurantId
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can only view your own donated meals"
                        );
            }

            List<DonatedMeal> meals =
                    donatedMealRepository.findAll();

            List<DonatedMealResponse> response =
                    meals.stream()
                            .map(meal -> {

                                FoodListing food =
                                        foodListingRepository
                                                .findById(
                                                        meal.getFoodListingId()
                                                )
                                                .orElse(null);

                                if (food == null ||
                                        !restaurantId.equals(
                                                food.getRestaurantId()
                                        )) {
                                    return null;
                                }

                                DonatedMealResponse item =
                                        new DonatedMealResponse();

                                item.setId(
                                        meal.getId()
                                );

                                item.setFoodListingId(
                                        meal.getFoodListingId()
                                );

                                item.setQuantity(
                                        meal.getQuantity()
                                );

                                item.setStatus(
                                        meal.getStatus()
                                );

                                item.setFoodName(
                                        food.getFoodName()
                                );

                                item.setRestaurantName(
                                        food.getRestaurantName()
                                );

                                item.setPickupDeadline(
                                        food.getPickupDeadline()
                                );

                                item.setAllergens(
                                        food.getAllergens()
                                );

                                return item;
                            })
                            .filter(item -> item != null)
                            .toList();

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/ready")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> markReadyForPickup(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email =
                    jwt.getClaimAsString("email");

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            Restaurant restaurant =
                    restaurantRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Restaurant profile not found"
                                    )
                            );

            DonatedMeal meal =
                    donatedMealRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Donated meal not found"
                                    )
                            );

            FoodListing foodListing =
                    foodListingRepository
                            .findById(
                                    meal.getFoodListingId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Food listing not found"
                                    )
                            );

            if (!restaurant.getId().equals(
                    foodListing.getRestaurantId()
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can only manage meals from your own restaurant"
                        );
            }

            if (!"CLAIMED".equals(
                    meal.getStatus()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Only claimed meals can be marked ready"
                        );
            }

            String otp =
                    pickupOtpService.generateOtp();

            meal.setPickupOtp(
                    otp
            );

            meal.setPickupOtpExpiresAt(
                    pickupOtpService.getExpiryTime()
            );

            meal.setStatus(
                    "READY_FOR_PICKUP"
            );

            DonatedMeal savedMeal =
                    donatedMealRepository.save(
                            meal
                    );

            return ResponseEntity.ok(
                    savedMeal
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/verify-otp")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> verifyDonatedMealOtp(
            @PathVariable Long id,
            @RequestBody String otp,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email =
                    jwt.getClaimAsString("email");

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            Restaurant restaurant =
                    restaurantRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Restaurant profile not found"
                                    )
                            );

            DonatedMeal meal =
                    donatedMealRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Donated meal not found"
                                    )
                            );

            FoodListing foodListing =
                    foodListingRepository
                            .findById(
                                    meal.getFoodListingId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Food listing not found"
                                    )
                            );

            if (!restaurant.getId().equals(
                    foodListing.getRestaurantId()
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can only verify meals from your own restaurant"
                        );
            }

            if (!"READY_FOR_PICKUP".equals(
                    meal.getStatus()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Meal is not ready for pickup"
                        );
            }

            String enteredOtp =
                    otp.trim().replace("\"", "");

            if (!enteredOtp.equals(
                    meal.getPickupOtp()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid pickup OTP"
                        );
            }

            if (pickupOtpService.isExpired(
                    meal.getPickupOtpExpiresAt()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Pickup OTP has expired"
                        );
            }

            meal.setStatus(
                    "COLLECTED"
            );

            meal.setPickupOtp(
                    null
            );

            meal.setPickupOtpExpiresAt(
                    null
            );

            DonatedMeal savedMeal =
                    donatedMealRepository.save(
                            meal
                    );

            return ResponseEntity.ok(
                    savedMeal
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}