package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    // Controller này sẽ nhận request từ frontend và gọi service để xử lý logic
    @Autowired
    private AuthService authService;

    // 1. SIGN UP
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            authService.registerUser(user); 
            return ResponseEntity.ok("Account created successfully."); // Trả về thông báo thành công
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage()); // Trả về lỗi nếu có vấn đề
        }
    }

    // 2. SIGN IN
    @PostMapping("/signin")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        try {
            authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok("Sign in successful.");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    // 3. CHECK EMAIL
    @PostMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestBody User request) {
        boolean isExist = authService.checkEmailExists(request.getEmail());
        return ResponseEntity.ok(isExist);
    }
}