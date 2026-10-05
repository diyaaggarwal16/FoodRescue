package com.foodrescue.backend.controller;

import com.foodrescue.backend.model.FoodListing;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import com.foodrescue.backend.service.FoodListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodListingController {

    private final FoodListingService foodListingService;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    private final Path uploadDirectory =
            Paths.get("uploads", "food");

    public FoodListingController(
            FoodListingService foodListingService,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository
    ) {
        this.foodListingService = foodListingService;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> createListing(
            @RequestBody FoodListing foodListing,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email = jwt.getClaimAsString("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Restaurant restaurant =
                restaurantRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Restaurant profile not found"));

        foodListing.setRestaurantId(restaurant.getId());
        foodListing.setRestaurantName(
                restaurant.getRestaurantName()
        );

        FoodListing savedListing =
                foodListingService.createListing(foodListing);

        return ResponseEntity.ok(savedListing);
    }

    @GetMapping
    public ResponseEntity<List<FoodListing>> getAvailableFood() {
        return ResponseEntity.ok(
                foodListingService.getAvailableFood()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(
            @PathVariable Long id
    ) {
        try {
            return ResponseEntity.ok(
                    foodListingService.getListing(id)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodListing>> getRestaurantFood(
            @PathVariable Long restaurantId
    ) {
        return ResponseEntity.ok(
                foodListingService.getRestaurantFood(restaurantId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> updateListing(
            @PathVariable Long id,
            @RequestBody FoodListing foodListing,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            Long restaurantId = getRestaurantId(jwt);

            FoodListing updatedListing =
                    foodListingService.updateListing(
                            id,
                            foodListing,
                            restaurantId
                    );

            return ResponseEntity.ok(updatedListing);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> deleteListing(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            Long restaurantId = getRestaurantId(jwt);

            FoodListing food =
                    foodListingService.getListing(id);

            if (!food.getRestaurantId().equals(restaurantId)) {
                return ResponseEntity.badRequest()
                        .body("You can only delete your own food listings");
            }

            deleteFile(food.getImage1Url());
            deleteFile(food.getImage2Url());
            deleteFile(food.getImage3Url());

            foodListingService.deleteListing(id, restaurantId);

            return ResponseEntity.ok(
                    "Food listing deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> uploadImages(
            @PathVariable Long id,
            @RequestParam(value = "image1", required = false)
            MultipartFile image1,
            @RequestParam(value = "image2", required = false)
            MultipartFile image2,
            @RequestParam(value = "image3", required = false)
            MultipartFile image3,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            Long restaurantId = getRestaurantId(jwt);

            FoodListing food =
                    foodListingService.getListing(id);

            if (!food.getRestaurantId().equals(restaurantId)) {
                return ResponseEntity.badRequest()
                        .body("You can only edit your own food listings");
            }

            if (image1 != null && !image1.isEmpty()) {
                validateImage(image1);
                deleteFile(food.getImage1Url());
                food.setImage1Url(saveImage(image1));
            }

            if (image2 != null && !image2.isEmpty()) {
                validateImage(image2);
                deleteFile(food.getImage2Url());
                food.setImage2Url(saveImage(image2));
            }

            if (image3 != null && !image3.isEmpty()) {
                validateImage(image3);
                deleteFile(food.getImage3Url());
                food.setImage3Url(saveImage(image3));
            }

            return ResponseEntity.ok(
                    foodListingService.save(food)
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to save food image");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/images/{slot}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> removeImage(
            @PathVariable Long id,
            @PathVariable Integer slot,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            Long restaurantId = getRestaurantId(jwt);

            FoodListing food =
                    foodListingService.getListing(id);

            if (!food.getRestaurantId().equals(restaurantId)) {
                return ResponseEntity.badRequest()
                        .body("You can only edit your own food listings");
            }

            if (slot < 1 || slot > 3) {
                return ResponseEntity.badRequest()
                        .body("Image slot must be 1, 2 or 3");
            }

            if (slot == 1) {
                deleteFile(food.getImage1Url());
                food.setImage1Url(null);
            }

            if (slot == 2) {
                deleteFile(food.getImage2Url());
                food.setImage2Url(null);
            }

            if (slot == 3) {
                deleteFile(food.getImage3Url());
                food.setImage3Url(null);
            }

            return ResponseEntity.ok(
                    foodListingService.save(food)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    private String saveImage(MultipartFile file)
            throws IOException {

        Files.createDirectories(uploadDirectory);

        String originalName =
                file.getOriginalFilename();

        String extension = "";

        if (originalName != null &&
                originalName.contains(".")) {
            extension =
                    originalName.substring(
                            originalName.lastIndexOf(".")
                    );
        }

        String fileName =
                UUID.randomUUID() + extension;

        Path target =
                uploadDirectory.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                target,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/food/" + fileName;
    }

    private void validateImage(MultipartFile file) {
        String contentType =
                file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {
            throw new RuntimeException(
                    "Only image files are allowed"
            );
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException(
                    "Each image must be smaller than 5 MB"
            );
        }
    }

    private void deleteFile(String url) {
        if (url == null || url.isBlank()) {
            return;
        }

        try {
            String fileName =
                    url.substring(
                            url.lastIndexOf("/") + 1
                    );

            Path file =
                    uploadDirectory.resolve(fileName);

            Files.deleteIfExists(file);

        } catch (Exception ignored) {
        }
    }

    private Long getRestaurantId(Jwt jwt) {
        String email =
                jwt.getClaimAsString("email");

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        Restaurant restaurant =
                restaurantRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Restaurant profile not found"));

        return restaurant.getId();
    }
}