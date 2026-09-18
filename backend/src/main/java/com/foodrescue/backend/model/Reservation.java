package com.foodrescue.backend.model;

import java.time.LocalDateTime;


import jakarta.persistence.*;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long foodListingId;

    private String customerName;

    private String customerEmail;

    private Integer quantity;

    private Double totalPrice;

    private String status;

    private String fulfillmentType;
    private String pickupOtp;
private LocalDateTime pickupOtpExpiresAt;

    public Reservation() {
    }

    public Long getId() {
        return id;
    }

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFulfillmentType() {
        return fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }
    public String getPickupOtp() {
    return pickupOtp;
}

public void setPickupOtp(String pickupOtp) {
    this.pickupOtp = pickupOtp;
}

public LocalDateTime getPickupOtpExpiresAt() {
    return pickupOtpExpiresAt;
}

public void setPickupOtpExpiresAt(
        LocalDateTime pickupOtpExpiresAt
) {
    this.pickupOtpExpiresAt = pickupOtpExpiresAt;
}
}