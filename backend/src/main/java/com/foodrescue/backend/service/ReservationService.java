package com.foodrescue.backend.service;

import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.Reservation;
import com.foodrescue.backend.repository.FoodListingRepository;
import com.foodrescue.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final FoodListingRepository foodListingRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            FoodListingRepository foodListingRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.foodListingRepository = foodListingRepository;
    }

    public Reservation createReservation(Reservation reservation) {

        FoodListing foodListing =
                foodListingRepository.findById(
                        reservation.getFoodListingId()
                ).orElseThrow(() ->
                        new RuntimeException("Food listing not found")
                );

        if (!"AVAILABLE".equals(foodListing.getStatus())) {
            throw new RuntimeException("Food listing is not available");
        }

        if (reservation.getQuantity() == null ||
                reservation.getQuantity() <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        if (reservation.getQuantity() >
                foodListing.getRemainingQuantity()) {
            throw new RuntimeException("Not enough food available");
        }

        double totalPrice =
                reservation.getQuantity() *
                foodListing.getRescuePrice();

        foodListing.setRemainingQuantity(
                foodListing.getRemainingQuantity()
                        - reservation.getQuantity()
        );

        if (foodListing.getRemainingQuantity() == 0) {
            foodListing.setStatus("SOLD_OUT");
        }

        reservation.setTotalPrice(totalPrice);
        reservation.setStatus("RESERVED");

        foodListingRepository.save(foodListing);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByCustomer(
            String customerEmail
    ) {
        return reservationRepository
                .findByCustomerEmail(customerEmail);
    }
}