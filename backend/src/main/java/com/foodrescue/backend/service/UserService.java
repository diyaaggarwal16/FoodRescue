package com.foodrescue.backend.service;

import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(
                password,
                user.get().getPassword()
        )) {
            throw new RuntimeException("Incorrect password");
        }

        return user.get();
    }
}