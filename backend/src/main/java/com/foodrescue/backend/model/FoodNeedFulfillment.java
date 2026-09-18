package com.foodrescue.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_need_fulfillments")
public class FoodNeedFulfillment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long foodNeedId;

    private Long donatedMealId;

    private Integer quantity;

    private LocalDateTime createdAt;

    public FoodNeedFulfillment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodNeedId() {
        return foodNeedId;
    }

    public void setFoodNeedId(Long foodNeedId) {
        this.foodNeedId = foodNeedId;
    }

    public Long getDonatedMealId() {
        return donatedMealId;
    }

    public void setDonatedMealId(Long donatedMealId) {
        this.donatedMealId = donatedMealId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}