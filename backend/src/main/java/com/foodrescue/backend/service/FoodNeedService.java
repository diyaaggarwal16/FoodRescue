package com.foodrescue.backend.service;

import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.model.FoodNeedPurchase;
import com.foodrescue.backend.repository.FoodNeedPurchaseRepository;
import com.foodrescue.backend.repository.FoodNeedRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FoodNeedService {

    private final FoodNeedRepository foodNeedRepository;
    private final FoodNeedPurchaseRepository purchaseRepository;

    public FoodNeedService(
            FoodNeedRepository foodNeedRepository,
            FoodNeedPurchaseRepository purchaseRepository
    ) {
        this.foodNeedRepository = foodNeedRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public FoodNeed createNeed(FoodNeed foodNeed) {

        if (foodNeed.getFoodType() == null ||
                foodNeed.getFoodType().trim().isEmpty()) {
            throw new RuntimeException(
                    "Food type is required"
            );
        }

        if (foodNeed.getQuantityNeeded() == null ||
                foodNeed.getQuantityNeeded() <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        if (foodNeed.getNeededBy() == null) {
            throw new RuntimeException(
                    "Needed-by deadline is required"
            );
        }

        if (foodNeed.getNeededBy()
                .isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Needed-by deadline must be in the future"
            );
        }

        if (foodNeed.getLocation() == null ||
                foodNeed.getLocation().trim().isEmpty()) {
            throw new RuntimeException(
                    "Location is required"
            );
        }

        if (foodNeed.getUrgency() == null ||
                foodNeed.getUrgency().trim().isEmpty()) {
            throw new RuntimeException(
                    "Urgency is required"
            );
        }

        if (foodNeed.getAllowPurchase() == null) {
            foodNeed.setAllowPurchase(false);
        }

        foodNeed.setQuantityFulfilled(0);
        foodNeed.setStatus("OPEN");
        foodNeed.setCreatedAt(LocalDateTime.now());

        return foodNeedRepository.save(foodNeed);
    }

    public List<FoodNeed> getNeedsByNgo(
            Long ngoId
    ) {
        List<FoodNeed> needs = foodNeedRepository.findByNgoId(ngoId);
        addReservedQuantities(needs);
        return needs;
    }

    public List<FoodNeed> getOpenNeeds() {
        List<FoodNeed> open = foodNeedRepository.findByStatus("OPEN");
        open.addAll(foodNeedRepository.findByStatus("PARTIALLY_FULFILLED"));
        addReservedQuantities(open);
        return open;
    }

    private void addReservedQuantities(List<FoodNeed> needs) {
        if (needs.isEmpty()) return;
        List<Long> needIds = needs.stream().map(FoodNeed::getId).toList();
        Map<Long, Integer> reservedByNeed = purchaseRepository.findByFoodNeedIdIn(needIds).stream()
                .filter(purchase -> "PENDING".equals(purchase.getStatus()))
                .collect(Collectors.groupingBy(
                        FoodNeedPurchase::getFoodNeedId,
                        Collectors.summingInt(FoodNeedPurchase::getQuantity)
                ));
        needs.forEach(need -> need.setQuantityReserved(reservedByNeed.getOrDefault(need.getId(), 0)));
    }
}
