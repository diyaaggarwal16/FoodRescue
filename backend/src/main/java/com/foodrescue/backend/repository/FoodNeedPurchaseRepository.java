package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.FoodNeedPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface FoodNeedPurchaseRepository extends JpaRepository<FoodNeedPurchase, Long> {
    List<FoodNeedPurchase> findByFoodNeedIdIn(List<Long> foodNeedIds);
    List<FoodNeedPurchase> findByRequesterUserIdOrderByCreatedAtDesc(Long requesterUserId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from FoodNeedPurchase p where p.id = :id")
    Optional<FoodNeedPurchase> findByIdForUpdate(@Param("id") Long id);
}
