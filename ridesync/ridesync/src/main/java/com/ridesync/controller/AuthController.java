package com.ridesync.controller;

import com.ridesync.config.JwtUtil;
import com.ridesync.dto.AuthResponse;
import com.ridesync.dto.LoginRequest;
import com.ridesync.dto.SignupRequest;
import com.ridesync.dto.UserResponse;
import com.ridesync.model.User;
import com.ridesync.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {
        User user = authService.signup(request);
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, toUserResponse(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        User user = authService.login(request);
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, toUserResponse(user));
    }

    private static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getMobile());
    }
}