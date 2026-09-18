package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.FoodNeed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodNeedRepository
        extends JpaRepository<FoodNeed, Long> {

    List<FoodNeed> findByNgoId(Long ngoId);

    List<FoodNeed> findByStatus(String status);
}