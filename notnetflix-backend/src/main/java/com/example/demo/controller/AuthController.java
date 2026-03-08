package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. SIGN UP
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("This email is already in use.");
        }
        userRepository.save(user);
        return ResponseEntity.ok("Account created successfully.");
    }

    // 2. SIGN IN
    @PostMapping("/signin")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            if (existingUser.getPassword() != null && existingUser.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok("Sign in successful.");
            } else {
                return ResponseEntity.status(401).body("Incorrect password. Please try again.");
            }
        } else {
            return ResponseEntity.status(404).body("Account not found.");
        }
    }

    // 3. CHECK EMAIL
    @PostMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestBody User request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        return ResponseEntity.ok(user.isPresent());
    }
}