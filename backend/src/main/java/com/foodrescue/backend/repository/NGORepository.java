package com.foodrescue.backend.repository;

import com.foodrescue.backend.model.NGO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NGORepository extends JpaRepository<NGO, Long> {

    Optional<NGO> findByUserId(Long userId);

}