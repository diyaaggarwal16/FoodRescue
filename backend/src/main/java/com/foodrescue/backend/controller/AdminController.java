package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.Admin;
import com.foodrescue.backend.model.DonatedMeal;
import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.AdminRepository;
import com.foodrescue.backend.repository.DonatedMealRepository;
import com.foodrescue.backend.repository.FoodListingRepository;
import com.foodrescue.backend.repository.FoodNeedRepository;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.ReservationRepository;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final NGORepository ngoRepository;
    private final FoodListingRepository foodListingRepository;
    private final ReservationRepository reservationRepository;
    private final DonatedMealRepository donatedMealRepository;
    private final FoodNeedRepository foodNeedRepository;

    public AdminController(
            AdminRepository adminRepository,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            NGORepository ngoRepository,
            FoodListingRepository foodListingRepository,
            ReservationRepository reservationRepository,
            DonatedMealRepository donatedMealRepository,
            FoodNeedRepository foodNeedRepository
    ) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.ngoRepository = ngoRepository;
        this.foodListingRepository =
                foodListingRepository;
        this.reservationRepository =
                reservationRepository;
        this.donatedMealRepository =
                donatedMealRepository;
        this.foodNeedRepository =
                foodNeedRepository;
    }

    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile(
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

            Admin admin =
                    adminRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Admin profile not found"
                                    )
                            );

            return ResponseEntity.ok(admin);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users =
                userRepository.findAll()
                        .stream()
                        .peek(user ->
                                user.setPassword(null)
                        )
                        .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/food-listings")
    public ResponseEntity<?> getFoodListings() {
        return ResponseEntity.ok(
                foodListingRepository.findAll()
        );
    }

    @GetMapping("/reservations")
    public ResponseEntity<?> getReservations() {
        return ResponseEntity.ok(
                reservationRepository.findAll()
        );
    }

    @GetMapping("/donated-meals")
    public ResponseEntity<List<DonatedMeal>> getDonatedMeals() {
        return ResponseEntity.ok(
                donatedMealRepository.findAll()
        );
    }

    @GetMapping("/food-needs")
    public ResponseEntity<List<FoodNeed>> getFoodNeeds() {
        return ResponseEntity.ok(
                foodNeedRepository.findAll()
        );
    }

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(
            @RequestBody Admin admin,
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

            if (adminRepository
                    .findByUserId(user.getId())
                    .isPresent()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Admin profile already exists"
                        );
            }

            admin.setUserId(user.getId());

            if (admin.getAdminName() == null
                    || admin.getAdminName().isBlank()) {

                admin.setAdminName(
                        user.getFullName()
                );
            }

            Admin savedAdmin =
                    adminRepository.save(admin);

            return ResponseEntity.ok(savedAdmin);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Admin admin,
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

            Admin existingAdmin =
                    adminRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Admin profile not found"
                                    )
                            );

            if (admin.getAdminName() != null
                    && !admin.getAdminName().isBlank()) {

                existingAdmin.setAdminName(
                        admin.getAdminName()
                );
            }

            Admin savedAdmin =
                    adminRepository.save(existingAdmin);

            return ResponseEntity.ok(savedAdmin);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getRestaurants() {
        return ResponseEntity.ok(
                restaurantRepository.findAll()
        );
    }

    @GetMapping("/restaurants/pending")
    public ResponseEntity<List<Restaurant>> getPendingRestaurants() {
        List<Restaurant> restaurants =
                restaurantRepository
                        .findAll()
                        .stream()
                        .filter(restaurant ->
                                "PENDING".equalsIgnoreCase(
                                        restaurant.getVerificationStatus()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(restaurants);
    }

    @PutMapping("/restaurants/{id}/verify")
    public ResponseEntity<?> verifyRestaurant(
            @PathVariable Long id
    ) {
        try {
            Restaurant restaurant =
                    restaurantRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Restaurant not found"
                                    )
                            );

            restaurant.setVerificationStatus(
                    "VERIFIED"
            );

            return ResponseEntity.ok(
                    restaurantRepository.save(restaurant)
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/ngos")
    public ResponseEntity<List<NGO>> getNGOs() {
        return ResponseEntity.ok(
                ngoRepository.findAll()
        );
    }

    @GetMapping("/ngos/pending")
    public ResponseEntity<List<NGO>> getPendingNGOs() {
        List<NGO> ngos =
                ngoRepository
                        .findAll()
                        .stream()
                        .filter(ngo ->
                                "PENDING".equalsIgnoreCase(
                                        ngo.getVerificationStatus()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(ngos);
    }

    @PutMapping("/ngos/{id}/verify")
    public ResponseEntity<?> verifyNGO(
            @PathVariable Long id
    ) {
        try {
            NGO ngo =
                    ngoRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "NGO not found"
                                    )
                            );

            ngo.setVerificationStatus(
                    "VERIFIED"
            );

            return ResponseEntity.ok(
                    ngoRepository.save(ngo)
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}