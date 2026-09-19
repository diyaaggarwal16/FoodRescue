package com.foodrescue.backend.controller;

import com.foodrescue.backend.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/password-reset")
@CrossOrigin(origins = "http://localhost:5173")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService
    ) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestReset(
            @RequestBody Map<String, String> request
    ) {
        try {
            String email = request.get("email");

            passwordResetService.generateOtp(email);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP generated successfully"
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request
    ) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");

            passwordResetService.verifyOtp(
                    email,
                    otp
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP verified successfully"
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request
    ) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            String newPassword =
                    request.get("newPassword");

            passwordResetService.resetPassword(
                    email,
                    otp,
                    newPassword
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password reset successfully"
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}