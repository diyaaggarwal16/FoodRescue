package com.foodrescue.backend.service;

import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final long OTP_VALIDITY_SECONDS = 300;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom =
            new SecureRandom();

    private final Map<String, PasswordResetData> resetRequests =
            new ConcurrentHashMap<>();

    public PasswordResetService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void generateOtp(String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Email is required"
            );
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        User user =
                userRepository.findByEmail(
                        normalizedEmail
                ).orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email"
                        )
                );

        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        Instant expiresAt =
                Instant.now().plusSeconds(
                        OTP_VALIDITY_SECONDS
                );

        resetRequests.put(
                normalizedEmail,
                new PasswordResetData(
                        otp,
                        expiresAt,
                        false
                )
        );

        System.out.println(
                "========================================"
        );

        System.out.println(
                "PASSWORD RESET OTP"
        );

        System.out.println(
                "Email: " + user.getEmail()
        );

        System.out.println(
                "OTP: " + otp
        );

        System.out.println(
                "Expires in: 5 minutes"
        );

        System.out.println(
                "========================================"
        );
    }

    public void verifyOtp(
            String email,
            String otp
    ) {

        String normalizedEmail =
                normalizeEmail(email);

        PasswordResetData resetData =
                resetRequests.get(normalizedEmail);

        if (resetData == null) {
            throw new RuntimeException(
                    "No password reset request found"
            );
        }

        if (resetData.used()) {
            throw new RuntimeException(
                    "OTP has already been used"
            );
        }

        if (Instant.now().isAfter(
                resetData.expiresAt()
        )) {
            resetRequests.remove(
                    normalizedEmail
            );

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        if (!resetData.otp().equals(otp)) {
            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        resetRequests.put(
                normalizedEmail,
                new PasswordResetData(
                        resetData.otp(),
                        resetData.expiresAt(),
                        true
                )
        );
    }

    public void resetPassword(
            String email,
            String otp,
            String newPassword
    ) {

        if (newPassword == null ||
                newPassword.isBlank()) {

            throw new RuntimeException(
                    "New password is required"
            );
        }

        String normalizedEmail =
                normalizeEmail(email);

        PasswordResetData resetData =
                resetRequests.get(normalizedEmail);

        if (resetData == null) {
            throw new RuntimeException(
                    "No password reset request found"
            );
        }

        if (!resetData.used()) {
            throw new RuntimeException(
                    "OTP has not been verified"
            );
        }

        if (Instant.now().isAfter(
                resetData.expiresAt()
        )) {
            resetRequests.remove(
                    normalizedEmail
            );

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        if (!resetData.otp().equals(otp)) {
            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        User user =
                userRepository.findByEmail(
                        normalizedEmail
                ).orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);

        resetRequests.remove(
                normalizedEmail
        );
    }

    private String normalizeEmail(String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Email is required"
            );
        }

        return email.trim().toLowerCase();
    }

    private record PasswordResetData(
            String otp,
            Instant expiresAt,
            boolean used
    ) {
    }
}