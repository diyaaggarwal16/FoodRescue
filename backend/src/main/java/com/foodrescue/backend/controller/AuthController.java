package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.AuthResponse;
import com.foodrescue.backend.dto.RegistrationRequest;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.service.JwtService;
import com.foodrescue.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(
            @RequestBody RegistrationRequest request
    ) {
        try {
            User registeredUser =
                    userService.registerCustomer(request);

            AuthResponse response = new AuthResponse(
                    registeredUser.getId(),
                    registeredUser.getFullName(),
                    registeredUser.getEmail(),
                    registeredUser.getRole(),
                    null
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/register/restaurant")
    public ResponseEntity<?> registerRestaurant(
            @RequestBody RegistrationRequest request
    ) {
        try {
            User registeredUser =
                    userService.registerRestaurant(request);

            AuthResponse response = new AuthResponse(
                    registeredUser.getId(),
                    registeredUser.getFullName(),
                    registeredUser.getEmail(),
                    registeredUser.getRole(),
                    null
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/register/ngo")
    public ResponseEntity<?> registerNGO(
            @RequestBody RegistrationRequest request
    ) {
        try {
            User registeredUser =
                    userService.registerNGO(request);

            AuthResponse response = new AuthResponse(
                    registeredUser.getId(),
                    registeredUser.getFullName(),
                    registeredUser.getEmail(),
                    registeredUser.getRole(),
                    null
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody Map<String, String> loginData
    ) {
        try {
            String email =
                    loginData.get("email");

            String password =
                    loginData.get("password");

            User user =
                    userService.loginUser(
                            email,
                            password
                    );

            String token =
                    jwtService.generateToken(
                            user.getId(),
                            user.getEmail(),
                            user.getRole()
                    );

            AuthResponse response = new AuthResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole(),
                    token
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}