package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.Reservation;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public ReservationController(
            ReservationService reservationService,
            UserRepository userRepository
    ) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody Reservation reservation,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String loggedInEmail =
                    jwt.getClaimAsString("email");

            User user = userRepository
                    .findByEmail(loggedInEmail)
                    .orElseThrow(() ->
                            new RuntimeException("User not found")
                    );

            reservation.setCustomerEmail(
                    user.getEmail()
            );

            reservation.setCustomerName(
                    user.getFullName()
            );

            Reservation savedReservation =
                    reservationService.createReservation(
                            reservation
                    );

            return ResponseEntity.ok(savedReservation);

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
                    .body("You can only view your own reservations");
        }

        List<Reservation> reservations =
                reservationService.getReservationsByCustomer(
                        loggedInEmail
                );

        return ResponseEntity.ok(reservations);
    }
}