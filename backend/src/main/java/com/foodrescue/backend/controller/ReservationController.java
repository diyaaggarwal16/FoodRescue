package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.ReservationResponse;
import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.Reservation;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.FoodListingRepository;
import com.foodrescue.backend.repository.ReservationRepository;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.PickupOtpService;
import com.foodrescue.backend.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final FoodListingRepository foodListingRepository;
    private final RestaurantRepository restaurantRepository;
    private final PickupOtpService pickupOtpService;

    public ReservationController(
            ReservationService reservationService,
            UserRepository userRepository,
            ReservationRepository reservationRepository,
            FoodListingRepository foodListingRepository,
            RestaurantRepository restaurantRepository,
            PickupOtpService pickupOtpService
    ) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
        this.foodListingRepository = foodListingRepository;
        this.restaurantRepository = restaurantRepository;
        this.pickupOtpService = pickupOtpService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createReservation(
            @RequestBody Reservation reservation,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String loggedInEmail =
                    jwt.getClaimAsString("email");

            User user =
                    userRepository
                            .findByEmail(loggedInEmail)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            reservation.setCustomerEmail(
                    user.getEmail()
            );

            reservation.setCustomerName(
                    user.getFullName()
            );

            String fulfillmentType =
                    reservation.getFulfillmentType();

            if (!"SELF_PICKUP".equals(
                    fulfillmentType
            ) && !"PAY_FORWARD".equals(
                    fulfillmentType
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Fulfillment type must be SELF_PICKUP or PAY_FORWARD"
                        );
            }

            Reservation savedReservation =
                    reservationService.createReservation(
                            reservation
                    );

            return ResponseEntity.ok(
                    savedReservation
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/customer/{email}")
    public ResponseEntity<?> getCustomerReservations(
            @PathVariable String email,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String loggedInEmail =
                jwt.getClaimAsString("email");

        if (!loggedInEmail.equalsIgnoreCase(email)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "You can only view your own reservations"
                    );
        }

        List<ReservationResponse> reservations =
                reservationService
                        .getReservationsByCustomer(
                                loggedInEmail
                        );

        return ResponseEntity.ok(
                reservations
        );
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> getRestaurantReservations(
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
                                "You can only view your own reservations"
                        );
            }

            List<Reservation> allReservations =
                    reservationRepository.findAll();

            List<Reservation> restaurantReservations =
                    allReservations.stream()
                            .filter(reservation -> {
                                FoodListing food =
                                        foodListingRepository
                                                .findById(
                                                        reservation
                                                                .getFoodListingId()
                                                )
                                                .orElse(null);

                                return food != null
                                        && restaurantId.equals(
                                                food.getRestaurantId()
                                        );
                            })
                            .toList();

            return ResponseEntity.ok(
                    restaurantReservations
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

            Reservation reservation =
                    reservationRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Reservation not found"
                                    )
                            );

            FoodListing foodListing =
                    foodListingRepository
                            .findById(
                                    reservation.getFoodListingId()
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
                                "You can only manage reservations for your own food listings"
                        );
            }

            if (!"RESERVED".equals(
                    reservation.getStatus()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Only reserved orders can be marked ready"
                        );
            }

            String otp =
                    pickupOtpService.generateOtp();

            reservation.setPickupOtp(otp);

            reservation.setPickupOtpExpiresAt(
                    pickupOtpService.getExpiryTime()
            );

            reservation.setStatus(
                    "READY_FOR_PICKUP"
            );

            Reservation savedReservation =
                    reservationRepository.save(
                            reservation
                    );

            return ResponseEntity.ok(
                    savedReservation
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}/verify-otp")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> verifyReservationOtp(
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

            Reservation reservation =
                    reservationRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Reservation not found"
                                    )
                            );

            FoodListing foodListing =
                    foodListingRepository
                            .findById(
                                    reservation.getFoodListingId()
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
                                "You can only verify your own reservations"
                        );
            }

            if (!"READY_FOR_PICKUP".equals(
                    reservation.getStatus()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Reservation is not ready for pickup"
                        );
            }

            String enteredOtp =
                    otp.trim().replace("\"", "");

            if (!enteredOtp.equals(
                    reservation.getPickupOtp()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid pickup OTP"
                        );
            }

            if (pickupOtpService.isExpired(
                    reservation.getPickupOtpExpiresAt()
            )) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Pickup OTP has expired"
                        );
            }

            reservation.setStatus(
                    "COMPLETED"
            );

            reservation.setPickupOtp(null);
            reservation.setPickupOtpExpiresAt(null);

            Reservation savedReservation =
                    reservationRepository.save(
                            reservation
                    );

            return ResponseEntity.ok(
                    savedReservation
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}