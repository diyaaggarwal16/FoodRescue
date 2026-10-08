package com.foodrescue.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_need_purchases")
public class FoodNeedPurchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long foodNeedId;
    private Long requesterUserId;
    private String requesterRole;
    private Integer quantity;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFoodNeedId() { return foodNeedId; }
    public void setFoodNeedId(Long foodNeedId) { this.foodNeedId = foodNeedId; }
    public Long getRequesterUserId() { return requesterUserId; }
    public void setRequesterUserId(Long requesterUserId) { this.requesterUserId = requesterUserId; }
    public String getRequesterRole() { return requesterRole; }
    public void setRequesterRole(String requesterRole) { this.requesterRole = requesterRole; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
