package com.ridesync.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String mobile;
    private String password;
    private String confirmPassword;
}