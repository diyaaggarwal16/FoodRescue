package com.foodrescue.backend.service;

import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        if (!user.get().getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password");
        }

        return user.get();
    }
}