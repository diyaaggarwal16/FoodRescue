package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.FoodNeed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

import java.util.List;

public interface FoodNeedRepository
        extends JpaRepository<FoodNeed, Long> {

    List<FoodNeed> findByNgoId(Long ngoId);

    List<FoodNeed> findByStatus(String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select n from FoodNeed n where n.id = :id")
    Optional<FoodNeed> findByIdForUpdate(@Param("id") Long id);
}
