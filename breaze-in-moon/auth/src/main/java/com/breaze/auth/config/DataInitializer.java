package com.breaze.auth.config;

import com.breaze.auth.model.Role;
import com.breaze.auth.model.User;
import com.breaze.auth.repository.RoleRepository;
import com.breaze.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }
        if (roleRepository.findByName("ROLE_CLIENT").isEmpty()) {
            Role clientRole = new Role();
            clientRole.setName("ROLE_CLIENT");
            roleRepository.save(clientRole);
        }
        if (userRepository.findByEmail("admin@breaze.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@breaze.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setActive(true);
            userRepository.save(admin);
            roleRepository.findByName("ROLE_ADMIN").ifPresent(role -> {
                admin.getRoles().add(role);
                userRepository.save(admin);
            });
        }
    }
}
