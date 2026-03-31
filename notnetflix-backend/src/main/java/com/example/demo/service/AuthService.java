package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service 
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Logic Check Email Existence
    public boolean checkEmailExists(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return userRepository.findByEmail(email).isPresent();
    }

    // 2. Logic Register (Updated with Status)
    public void registerUser(User user) throws Exception {
        if (checkEmailExists(user.getEmail())) {
            throw new Exception("This email is already in use.");
        }
        
        user.setRole("USER"); 
        user.setStatus("ACTIVE"); // Default status for new users
        
        // Hash password before saving to database
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
    }

    // 3. Logic Login (Updated with Banned Check)
    public User authenticateUser(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new Exception("Account not found.");
        }

        User existingUser = userOptional.get();
        
        // Check if the account is banned
        if ("BANNED".equals(existingUser.getStatus())) {
            throw new Exception("Your account has been suspended due to a violation of our terms.");
        }

        if (password == null || existingUser.getPassword() == null) {
            throw new Exception("Password cannot be empty.");
        }

        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new Exception("Incorrect password. Please try again.");
        }

        return existingUser; // Success
    }
}