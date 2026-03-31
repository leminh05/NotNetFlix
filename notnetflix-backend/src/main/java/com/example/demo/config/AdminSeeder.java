package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@notnetflix.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            System.out.println("⚠️ Admin account not found! Provisioning default Admin account...");

            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123456"));
            admin.setRole("ADMIN");

            userRepository.save(admin);
            System.out.println("✅ Default Admin account created successfully: " + adminEmail);
        } else {
            System.out.println("✅ Admin account already exists in the system.");
        }
    }
}
