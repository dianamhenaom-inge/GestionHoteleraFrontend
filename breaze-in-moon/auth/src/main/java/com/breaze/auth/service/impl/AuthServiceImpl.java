package com.breaze.auth.service.impl;

import com.breaze.auth.audit.AuditClient;
import com.breaze.auth.dto.AuthResponse;
import com.breaze.auth.dto.LoginRequest;
import com.breaze.auth.dto.RegisterRequest;
import com.breaze.auth.model.User;
import com.breaze.auth.repository.RoleRepository;
import com.breaze.auth.repository.UserRepository;
import com.breaze.auth.security.JwtUtil;
import com.breaze.auth.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuditClient auditClient;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        userRepository.save(user);

        roleRepository.findByName("ROLE_CLIENT").ifPresent(role -> {
            user.getRoles().add(role);
            userRepository.save(user);
        });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        AuthResponse response = buildResponse(userDetails);

        return response;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        AuthResponse response = buildResponse(userDetails);

        auditClient.send("USER_LOGIN", request.getEmail(), Map.of("email", request.getEmail()));
        return response;
    }

    private AuthResponse buildResponse(UserDetails userDetails) {
        String token = jwtUtil.generateToken(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return new AuthResponse(token, userDetails.getUsername(), roles);
    }
}
