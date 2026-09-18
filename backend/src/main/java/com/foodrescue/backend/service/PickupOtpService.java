package com.foodrescue.backend.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class PickupOtpService {

    private final SecureRandom secureRandom =
            new SecureRandom();

    public String generateOtp() {
        int otp =
                100000 + secureRandom.nextInt(900000);

        return String.valueOf(otp);
    }

    public LocalDateTime getExpiryTime() {
        return LocalDateTime.now().plusMinutes(30);
    }

    public boolean isExpired(
            LocalDateTime expiryTime
    ) {
        return expiryTime == null ||
                LocalDateTime.now()
                        .isAfter(expiryTime);
    }
}