package com.foodrescue.backend.service;

import com.foodrescue.backend.dto.RegistrationRequest;
import com.foodrescue.backend.model.NGO;
import com.foodrescue.backend.model.Restaurant;
import com.foodrescue.backend.model.User;
import com.foodrescue.backend.repository.NGORepository;
import com.foodrescue.backend.repository.RestaurantRepository;
import com.foodrescue.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final NGORepository ngoRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            NGORepository ngoRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.ngoRepository = ngoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerCustomer(
            RegistrationRequest request
    ) {
        validateBasicRegistration(request);

        checkEmailAlreadyRegistered(request.getEmail());

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setRole("CUSTOMER");

        return userRepository.save(user);
    }

    @Transactional
    public User registerRestaurant(
            RegistrationRequest request
    ) {
        validateBasicRegistration(request);

        if (isBlank(request.getRestaurantName())) {
            throw new RuntimeException(
                    "Restaurant name is required"
            );
        }

        if (isBlank(request.getPhone())) {
            throw new RuntimeException(
                    "Phone number is required"
            );
        }

        if (isBlank(request.getAddress())) {
            throw new RuntimeException(
                    "Restaurant address is required"
            );
        }

        checkEmailAlreadyRegistered(request.getEmail());

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setRole("RESTAURANT");

        User savedUser =
                userRepository.save(user);

        Restaurant restaurant = new Restaurant();

        restaurant.setUserId(
                savedUser.getId()
        );

        restaurant.setRestaurantName(
                request.getRestaurantName()
        );

        restaurant.setPhone(
                request.getPhone()
        );

        restaurant.setAddress(
                request.getAddress()
        );

        restaurant.setVerificationStatus(
                "PENDING"
        );

        restaurantRepository.save(restaurant);

        return savedUser;
    }

    @Transactional
    public User registerNGO(
            RegistrationRequest request
    ) {
        validateBasicRegistration(request);

        if (isBlank(request.getNgoName())) {
            throw new RuntimeException(
                    "NGO name is required"
            );
        }

        if (isBlank(request.getPhone())) {
            throw new RuntimeException(
                    "Phone number is required"
            );
        }

        if (isBlank(request.getAddress())) {
            throw new RuntimeException(
                    "NGO address is required"
            );
        }

        checkEmailAlreadyRegistered(request.getEmail());

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setRole("NGO");

        User savedUser =
                userRepository.save(user);

        NGO ngo = new NGO();

        ngo.setUserId(
                savedUser.getId()
        );

        ngo.setNgoName(
                request.getNgoName()
        );

        ngo.setPhone(
                request.getPhone()
        );

        ngo.setAddress(
                request.getAddress()
        );

        ngo.setVerificationStatus(
                "PENDING"
        );

        ngoRepository.save(ngo);

        return savedUser;
    }

    public User loginUser(
            String email,
            String password
    ) {
        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        if (!passwordEncoder.matches(
                password,
                user.get().getPassword()
        )) {
            throw new RuntimeException(
                    "Incorrect password"
            );
        }

        return user.get();
    }

    private void validateBasicRegistration(
            RegistrationRequest request
    ) {
        if (request == null) {
            throw new RuntimeException(
                    "Registration data is required"
            );
        }

        if (isBlank(request.getFullName())) {
            throw new RuntimeException(
                    "Name is required"
            );
        }

        if (isBlank(request.getEmail())) {
            throw new RuntimeException(
                    "Email is required"
            );
        }

        if (isBlank(request.getPassword())) {
            throw new RuntimeException(
                    "Password is required"
            );
        }
    }

    private void checkEmailAlreadyRegistered(
            String email
    ) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }
    }

    private boolean isBlank(String value) {
        return value == null
                || value.trim().isEmpty();
    }
}