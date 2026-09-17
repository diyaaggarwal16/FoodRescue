package com.foodrescue.backend.controller;

import com.foodrescue.backend.dto.AuthResponse;
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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {
        try {
            User registeredUser =
                    userService.registerUser(user);

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
            String email = loginData.get("email");
            String password = loginData.get("password");

            User user =
                    userService.loginUser(email, password);

            String token = jwtService.generateToken(
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