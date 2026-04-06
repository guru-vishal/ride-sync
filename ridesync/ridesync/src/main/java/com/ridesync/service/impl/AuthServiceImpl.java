package com.ridesync.service.impl;

import com.ridesync.dto.LoginRequest;
import com.ridesync.dto.SignupRequest;
import com.ridesync.model.User;
import com.ridesync.repository.UserRepository;
import com.ridesync.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User signup(SignupRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        if (userRepository.findByMobile(request.getMobile()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mobile already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());

        // 🔥 Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {

        Optional<User> user = userRepository.findByEmail(request.getEmailOrMobile());

        if (user.isEmpty()) {
            user = userRepository.findByMobile(request.getEmailOrMobile());
        }

        User u = user.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        // 🔥 Check encrypted password
        if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return u;
    }
}