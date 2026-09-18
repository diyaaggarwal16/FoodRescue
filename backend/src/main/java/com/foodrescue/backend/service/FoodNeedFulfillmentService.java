package com.foodrescue.backend.service;

import com.foodrescue.backend.model.DonatedMeal;
import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.model.FoodNeedFulfillment;
import com.foodrescue.backend.repository.DonatedMealRepository;
import com.foodrescue.backend.repository.FoodNeedFulfillmentRepository;
import com.foodrescue.backend.repository.FoodNeedRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FoodNeedFulfillmentService {

    private final FoodNeedRepository foodNeedRepository;
    private final DonatedMealRepository donatedMealRepository;
    private final FoodNeedFulfillmentRepository fulfillmentRepository;

    public FoodNeedFulfillmentService(
            FoodNeedRepository foodNeedRepository,
            DonatedMealRepository donatedMealRepository,
            FoodNeedFulfillmentRepository fulfillmentRepository
    ) {
        this.foodNeedRepository = foodNeedRepository;
        this.donatedMealRepository = donatedMealRepository;
        this.fulfillmentRepository =
                fulfillmentRepository;
    }

    public FoodNeedFulfillment fulfillNeed(
            Long foodNeedId,
            Long donatedMealId,
            Integer quantity
    ) {

        FoodNeed foodNeed =
                foodNeedRepository.findById(
                        foodNeedId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Food need not found"
                        )
                );

        DonatedMeal donatedMeal =
                donatedMealRepository.findById(
                        donatedMealId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Donated meal not found"
                        )
                );

        if (!"OPEN".equals(
                foodNeed.getStatus()
        ) &&
                !"PARTIALLY_FULFILLED".equals(
                        foodNeed.getStatus()
                )) {
            throw new RuntimeException(
                    "Food need cannot be fulfilled"
            );
        }

        if (!"AVAILABLE".equals(
                donatedMeal.getStatus()
        )) {
            throw new RuntimeException(
                    "Donated meal is not available"
            );
        }

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Invalid fulfillment quantity"
            );
        }

        int fulfilled =
                foodNeed.getQuantityFulfilled() == null
                        ? 0
                        : foodNeed.getQuantityFulfilled();

        int remainingNeed =
                foodNeed.getQuantityNeeded()
                        - fulfilled;

        if (quantity > remainingNeed) {
            throw new RuntimeException(
                    "Fulfillment quantity exceeds remaining need"
            );
        }

        int donatedQuantity =
                donatedMeal.getQuantity() == null
                        ? 0
                        : donatedMeal.getQuantity();

        if (quantity > donatedQuantity) {
            throw new RuntimeException(
                    "Fulfillment quantity exceeds donated meal quantity"
            );
        }

        FoodNeedFulfillment fulfillment =
                new FoodNeedFulfillment();

        fulfillment.setFoodNeedId(
                foodNeedId
        );

        fulfillment.setDonatedMealId(
                donatedMealId
        );

        fulfillment.setQuantity(
                quantity
        );

        fulfillment.setCreatedAt(
                LocalDateTime.now()
        );

        FoodNeedFulfillment savedFulfillment =
                fulfillmentRepository.save(
                        fulfillment
                );

        int updatedFulfilled =
                fulfilled + quantity;

        foodNeed.setQuantityFulfilled(
                updatedFulfilled
        );

        if (updatedFulfilled >=
                foodNeed.getQuantityNeeded()) {

            foodNeed.setStatus(
                    "FULFILLED"
            );

        } else {

            foodNeed.setStatus(
                    "PARTIALLY_FULFILLED"
            );
        }

        foodNeedRepository.save(
                foodNeed
        );

        int remainingDonatedQuantity =
                donatedQuantity - quantity;

        donatedMeal.setQuantity(
                remainingDonatedQuantity
        );

        if (remainingDonatedQuantity == 0) {
            donatedMeal.setStatus(
                    "COLLECTED"
            );
        }

        donatedMealRepository.save(
                donatedMeal
        );

        return savedFulfillment;
    }
}