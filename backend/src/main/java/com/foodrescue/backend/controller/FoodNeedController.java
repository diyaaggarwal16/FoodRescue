package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.FoodNeedService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-needs")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodNeedController {

    private final FoodNeedService foodNeedService;
    private final UserRepository userRepository;
    private final NGORepository ngoRepository;

    public FoodNeedController(
            FoodNeedService foodNeedService,
            UserRepository userRepository,
            NGORepository ngoRepository
    ) {
        this.foodNeedService = foodNeedService;
        this.userRepository = userRepository;
        this.ngoRepository = ngoRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> createNeed(
            @RequestBody FoodNeed foodNeed,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            NGO ngo = getLoggedInNgo(jwt);

            if (!"VERIFIED".equalsIgnoreCase(
                    ngo.getVerificationStatus()
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Only verified NGOs can create food needs"
                        );
            }

            foodNeed.setNgoId(ngo.getId());

            FoodNeed savedNeed =
                    foodNeedService.createNeed(
                            foodNeed
                    );

            return ResponseEntity.ok(savedNeed);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> getMyNeeds(
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            NGO ngo = getLoggedInNgo(jwt);

            List<FoodNeed> needs =
                    foodNeedService.getNeedsByNgo(
                            ngo.getId()
                    );

            return ResponseEntity.ok(needs);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> getOpenNeeds() {
        return ResponseEntity.ok(
                foodNeedService.getOpenNeeds()
        );
    }

    private NGO getLoggedInNgo(
            Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return ngoRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "NGO profile not found"
                        )
                );
    }
}