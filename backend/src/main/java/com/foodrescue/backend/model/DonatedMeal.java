package com.foodrescue.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "donated_meals")
public class DonatedMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reservationId;

    private Long foodListingId;

    private Integer quantity;

    private String status;

    private Long claimedByNgoId;
    private String pickupOtp;
private LocalDateTime pickupOtpExpiresAt;

    public DonatedMeal() {
    }

    public Long getId() {
        return id;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getClaimedByNgoId() {
        return claimedByNgoId;
    }

    public void setClaimedByNgoId(Long claimedByNgoId) {
        this.claimedByNgoId = claimedByNgoId;
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