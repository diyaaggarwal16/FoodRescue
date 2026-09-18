package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "http://localhost:5173")
public class NGOController {

    private final NGORepository ngoRepository;
    private final UserRepository userRepository;

    public NGOController(
            NGORepository ngoRepository,
            UserRepository userRepository
    ) {
        this.ngoRepository = ngoRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> createProfile(
            @RequestBody NGO ngo,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (ngoRepository.findByUserId(
                user.getId()
        ).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "NGO profile already exists"
                    );
        }

        ngo.setUserId(user.getId());

        if (ngo.getVerificationStatus() == null) {
            ngo.setVerificationStatus("PENDING");
        }

        NGO savedNGO =
                ngoRepository.save(ngo);

        return ResponseEntity.ok(savedNGO);
    }

    @GetMapping("/my-profile")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> getMyProfile(
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return ngoRepository
                .findByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> updateProfile(
            @RequestBody NGO updatedNGO,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        NGO ngo =
                ngoRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "NGO profile not found"
                                )
                        );

        ngo.setNgoName(
                updatedNGO.getNgoName()
        );

        ngo.setAddress(
                updatedNGO.getAddress()
        );

        ngo.setPhone(
                updatedNGO.getPhone()
        );

        NGO savedNGO =
                ngoRepository.save(ngo);

        return ResponseEntity.ok(savedNGO);
    }
}