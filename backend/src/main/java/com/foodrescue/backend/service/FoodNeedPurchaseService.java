package com.foodrescue.backend.service;

import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.model.FoodNeedPurchase;
import com.foodrescue.backend.repository.FoodNeedPurchaseRepository;
import com.foodrescue.backend.repository.FoodNeedRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodNeedPurchaseService {
    private final FoodNeedRepository needs;
    private final FoodNeedPurchaseRepository purchases;

    public FoodNeedPurchaseService(FoodNeedRepository needs, FoodNeedPurchaseRepository purchases) {
        this.needs = needs;
        this.purchases = purchases;
    }

    @Transactional
    public FoodNeedPurchase request(Long needId, Long userId, String role, Integer quantity) {
        FoodNeed need = needs.findByIdForUpdate(needId)
                .orElseThrow(() -> new IllegalArgumentException("Food need not found"));
        if (!Boolean.TRUE.equals(need.getAllowPurchase()))
            throw new IllegalArgumentException("Purchases are not allowed for this food need");
        if (quantity == null || quantity <= 0)
            throw new IllegalArgumentException("Quantity must be greater than zero");
        if (!"OPEN".equals(need.getStatus()) && !"PARTIALLY_FULFILLED".equals(need.getStatus()))
            throw new IllegalArgumentException("Food need is no longer open");
        int fulfilled = need.getQuantityFulfilled() == null ? 0 : need.getQuantityFulfilled();
        int pending = purchases.findByFoodNeedIdIn(List.of(needId)).stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .mapToInt(FoodNeedPurchase::getQuantity).sum();
        int remaining = need.getQuantityNeeded() - fulfilled - pending;
        if (quantity > remaining)
            throw new IllegalArgumentException("Quantity exceeds the remaining available need (" + Math.max(remaining, 0) + ")");
        FoodNeedPurchase purchase = new FoodNeedPurchase();
        purchase.setFoodNeedId(needId);
        purchase.setRequesterUserId(userId);
        purchase.setRequesterRole(role);
        purchase.setQuantity(quantity);
        purchase.setStatus("PENDING");
        purchase.setCreatedAt(LocalDateTime.now());
        purchase.setUpdatedAt(LocalDateTime.now());
        return purchases.save(purchase);
    }

    public List<FoodNeedPurchase> forRequester(Long userId) {
        return purchases.findByRequesterUserIdOrderByCreatedAtDesc(userId);
    }

    public List<FoodNeedPurchase> forNgo(List<Long> needIds) {
        return needIds.isEmpty() ? List.of() : purchases.findByFoodNeedIdIn(needIds);
    }

    @Transactional
    public FoodNeedPurchase decide(Long purchaseId, Long ngoId, boolean approve) {
        FoodNeedPurchase purchase = purchases.findByIdForUpdate(purchaseId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase request not found"));
        FoodNeed need = needs.findByIdForUpdate(purchase.getFoodNeedId())
                .orElseThrow(() -> new IllegalArgumentException("Food need not found"));
        if (!ngoId.equals(need.getNgoId())) throw new SecurityException("You can only manage requests for your own food needs");
        if (!"PENDING".equals(purchase.getStatus())) throw new IllegalArgumentException("This request has already been handled");
        if (approve) {
            int fulfilled = need.getQuantityFulfilled() == null ? 0 : need.getQuantityFulfilled();
            int pendingOthers = purchases.findByFoodNeedIdIn(List.of(need.getId())).stream()
                    .filter(p -> "PENDING".equals(p.getStatus()) && !p.getId().equals(purchaseId))
                    .mapToInt(FoodNeedPurchase::getQuantity).sum();
            if (fulfilled + purchase.getQuantity() + pendingOthers > need.getQuantityNeeded())
                throw new IllegalArgumentException("Approving this request would exceed the remaining need");
            need.setQuantityFulfilled(fulfilled + purchase.getQuantity());
            need.setStatus(need.getQuantityFulfilled() >= need.getQuantityNeeded() ? "FULFILLED" : "PARTIALLY_FULFILLED");
            needs.save(need);
            purchase.setStatus("APPROVED");
        } else {
            purchase.setStatus("REJECTED");
        }
        purchase.setUpdatedAt(LocalDateTime.now());
        return purchases.save(purchase);
    }
}
