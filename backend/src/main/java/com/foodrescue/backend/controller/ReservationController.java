package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.Reservation;
import com.foodrescue.backend.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService
    ) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody Reservation reservation
    ) {
        try {
            Reservation savedReservation =
                    reservationService.createReservation(reservation);

            return ResponseEntity.ok(savedReservation);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Reservation>> getCustomerReservations(
            @PathVariable String email
    ) {
        return ResponseEntity.ok(
                reservationService.getReservationsByCustomer(email)
        );
    }
}