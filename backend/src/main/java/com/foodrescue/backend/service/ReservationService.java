package com.foodrescue.backend.service;

import com.foodrescue.backend.dto.ReservationResponse;
import com.foodrescue.backend.model.DonatedMeal;
import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.Reservation;
import com.foodrescue.backend.repository.DonatedMealRepository;
import com.foodrescue.backend.repository.FoodListingRepository;
import com.foodrescue.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final FoodListingRepository foodListingRepository;
    private final DonatedMealRepository donatedMealRepository;
    private final PickupOtpService pickupOtpService;

    public ReservationService(
            ReservationRepository reservationRepository,
            FoodListingRepository foodListingRepository,
            DonatedMealRepository donatedMealRepository,
            PickupOtpService pickupOtpService
    ) {
        this.reservationRepository = reservationRepository;
        this.foodListingRepository = foodListingRepository;
        this.donatedMealRepository = donatedMealRepository;
        this.pickupOtpService = pickupOtpService;
    }

    public Reservation createReservation(
            Reservation reservation
    ) {

        FoodListing foodListing =
                foodListingRepository.findById(
                        reservation.getFoodListingId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Food listing not found"
                        )
                );

        if (!"AVAILABLE".equals(
                foodListing.getStatus()
        )) {
            throw new RuntimeException(
                    "Food listing is not available"
            );
        }

        if (reservation.getQuantity() == null ||
                reservation.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Invalid quantity"
            );
        }

        if (reservation.getQuantity() >
                foodListing.getRemainingQuantity()) {
            throw new RuntimeException(
                    "Not enough food available"
            );
        }

        double totalPrice =
                reservation.getQuantity()
                        * foodListing.getRescuePrice();

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

        Reservation savedReservation =
                reservationRepository.save(
                        reservation
                );

        if ("PAY_FORWARD".equals(
                savedReservation.getFulfillmentType()
        )) {
            DonatedMeal donatedMeal =
                    new DonatedMeal();

            donatedMeal.setReservationId(
                    savedReservation.getId()
            );

            donatedMeal.setFoodListingId(
                    savedReservation.getFoodListingId()
            );

            donatedMeal.setQuantity(
                    savedReservation.getQuantity()
            );

            donatedMeal.setStatus("AVAILABLE");

            donatedMealRepository.save(
                    donatedMeal
            );
        }

        return savedReservation;
    }

    public List<ReservationResponse> getReservationsByCustomer(
            String customerEmail
    ) {
        List<Reservation> reservations =
                reservationRepository
                        .findByCustomerEmail(customerEmail);

        return reservations.stream()
                .map(reservation -> {
                    FoodListing foodListing =
                            foodListingRepository.findById(
                                    reservation.getFoodListingId()
                            ).orElse(null);

                    ReservationResponse response =
                            new ReservationResponse();

                    response.setId(reservation.getId());
                    response.setFoodListingId(
                            reservation.getFoodListingId()
                    );
                    response.setQuantity(
                            reservation.getQuantity()
                    );
                    response.setTotalPrice(
                            reservation.getTotalPrice()
                    );
                    response.setFulfillmentType(
                            reservation.getFulfillmentType()
                    );
                    response.setPickupOtp(
        reservation.getPickupOtp()
);
                    response.setStatus(
                            reservation.getStatus()
                    );

                    if (foodListing != null) {
                        response.setFoodName(
                                foodListing.getFoodName()
                        );

                        response.setRestaurantName(
                                foodListing.getRestaurantName()
                        );

                        response.setRescuePrice(
                                foodListing.getRescuePrice()
                        );

                        response.setPickupDeadline(
                                foodListing.getPickupDeadline()
                        );

                        response.setAllergens(
                                foodListing.getAllergens()
                        );
                    }

                    return response;
                })
                .toList();
    }

    public List<DonatedMeal> getAvailableDonatedMeals() {
        return donatedMealRepository
                .findByStatus("AVAILABLE");
    }
}