package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.FoodNeedFulfillment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodNeedFulfillmentRepository
        extends JpaRepository<FoodNeedFulfillment, Long> {

    List<FoodNeedFulfillment> findByFoodNeedId(
            Long foodNeedId
    );

    List<FoodNeedFulfillment> findByDonatedMealId(
            Long donatedMealId
    );
}