package com.foodrescue.backend.dto;

public class ReservationResponse {

    private Long id;
    private Long foodListingId;
    private String foodName;
    private String restaurantName;
    private Integer quantity;
    private Double rescuePrice;
    private Double totalPrice;
    private String pickupDeadline;
    private String allergens;
    private String fulfillmentType;
    private String status;
    private String pickupOtp;

    public ReservationResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getRescuePrice() {
        return rescuePrice;
    }

    public void setRescuePrice(Double rescuePrice) {
        this.rescuePrice = rescuePrice;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
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

    public String getFulfillmentType() {
        return fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public String getPickupOtp() {
    return pickupOtp;
}

public void setPickupOtp(String pickupOtp) {
    this.pickupOtp = pickupOtp;
}
}