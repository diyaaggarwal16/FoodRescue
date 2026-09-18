package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.FoodNeed;
import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.FoodNeedRepository;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.FoodNeedFulfillmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/food-need-fulfillments")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodNeedFulfillmentController {

    private final FoodNeedFulfillmentService fulfillmentService;
    private final FoodNeedRepository foodNeedRepository;
    private final UserRepository userRepository;
    private final NGORepository ngoRepository;

    public FoodNeedFulfillmentController(
            FoodNeedFulfillmentService fulfillmentService,
            FoodNeedRepository foodNeedRepository,
            UserRepository userRepository,
            NGORepository ngoRepository
    ) {
        this.fulfillmentService =
                fulfillmentService;

        this.foodNeedRepository =
                foodNeedRepository;

        this.userRepository =
                userRepository;

        this.ngoRepository =
                ngoRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> fulfillNeed(
            @RequestParam Long foodNeedId,
            @RequestParam Long donatedMealId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            NGO ngo =
                    getLoggedInNgo(jwt);

            if (!"VERIFIED".equalsIgnoreCase(
                    ngo.getVerificationStatus()
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "Only verified NGOs can fulfill food needs"
                        );
            }

            FoodNeed foodNeed =
                    foodNeedRepository.findById(
                            foodNeedId
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Food need not found"
                            )
                    );

            if (!ngo.getId().equals(
                    foodNeed.getNgoId()
            )) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                "You can only fulfill your own food needs"
                        );
            }

            return ResponseEntity.ok(
                    fulfillmentService.fulfillNeed(
                            foodNeedId,
                            donatedMealId,
                            quantity
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
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