package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.FoodNeedRepository;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.FoodNeedPurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-need-purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodNeedPurchaseController {
    private final FoodNeedPurchaseService service;
    private final UserRepository users;
    private final NGORepository ngos;
    private final FoodNeedRepository needs;

    public FoodNeedPurchaseController(FoodNeedPurchaseService service, UserRepository users,
                                      NGORepository ngos, FoodNeedRepository needs) {
        this.service = service;
        this.users = users;
        this.ngos = ngos;
        this.needs = needs;
    }

    @PostMapping("/needs/{foodNeedId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'RESTAURANT')")
    public ResponseEntity<?> request(@PathVariable Long foodNeedId, @RequestBody Map<String, Integer> body,
                                     @AuthenticationPrincipal Jwt jwt) {
        try {
            User user = currentUser(jwt);
            return ResponseEntity.ok(service.request(foodNeedId, user.getId(), user.getRole(), body.get("quantity")));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'RESTAURANT')")
    public ResponseEntity<?> my(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.forRequester(currentUser(jwt).getId()));
    }

    @GetMapping("/incoming")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> incoming(@AuthenticationPrincipal Jwt jwt) {
        NGO ngo = currentNgo(jwt);
        return ResponseEntity.ok(service.forNgo(needs.findByNgoId(ngo.getId()).stream().map(n -> n.getId()).toList()));
    }

    @PutMapping("/{purchaseId}/approve")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> approve(@PathVariable Long purchaseId, @AuthenticationPrincipal Jwt jwt) {
        return decide(purchaseId, jwt, true);
    }

    @PutMapping("/{purchaseId}/reject")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> reject(@PathVariable Long purchaseId, @AuthenticationPrincipal Jwt jwt) {
        return decide(purchaseId, jwt, false);
    }

    private ResponseEntity<?> decide(Long id, Jwt jwt, boolean approve) {
        try {
            NGO ngo = currentNgo(jwt);
            if (!"VERIFIED".equalsIgnoreCase(ngo.getVerificationStatus()))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only verified NGOs can manage purchase requests");
            return ResponseEntity.ok(service.decide(id, ngo.getId(), approve));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User currentUser(Jwt jwt) {
        return users.findByEmail(jwt.getClaimAsString("email"))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private NGO currentNgo(Jwt jwt) {
        User user = currentUser(jwt);
        return ngos.findByUserId(user.getId()).orElseThrow(() -> new IllegalArgumentException("NGO profile not found"));
    }
}
