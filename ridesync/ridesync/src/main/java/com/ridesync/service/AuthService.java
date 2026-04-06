package com.ridesync.service;

import com.ridesync.dto.LoginRequest;
import com.ridesync.dto.SignupRequest;
import com.ridesync.model.User;

public interface AuthService {
    User signup(SignupRequest request);
    User login(LoginRequest request);
}