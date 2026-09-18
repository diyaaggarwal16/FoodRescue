package com.foodrescue.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "food_listings")
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

    private String description;

    private Integer quantity;

    private Integer remainingQuantity;

    private Double originalPrice;

    private Double rescuePrice;

    private String pickupDeadline;

    private String allergens;

    private String restaurantName;

    private Long restaurantId;

    private String status;

    public FoodListing() {
    }

    public Long getId() {
        return id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getRemainingQuantity() {
        return remainingQuantity;
    }

    public void setRemainingQuantity(Integer remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Double getRescuePrice() {
        return rescuePrice;
    }

    public void setRescuePrice(Double rescuePrice) {
        this.rescuePrice = rescuePrice;
    }

    public String getPickupDeadline() {
        return pickupDeadline;
    }

    public void setPickupDeadline(String pickupDeadline) {
        this.pickupDeadline = pickupDeadline;
    }

    public String getAllergens() {
        return allergens;
    }

    public void setAllergens(String allergens) {
        this.allergens = allergens;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}