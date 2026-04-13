package com.breaze.auth.service;

import com.breaze.auth.dto.AuthResponse;
import com.breaze.auth.dto.LoginRequest;
import com.breaze.auth.dto.RegisterRequest;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
