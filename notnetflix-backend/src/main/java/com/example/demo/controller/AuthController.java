package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    // Inject AuthService để xử lý logic liên quan đến xác thực người dùng
    @Autowired
    private AuthService authService;

    // 1. SIGN UP
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            authService.registerUser(user); 
            return ResponseEntity.ok("Account created successfully."); 
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage()); 
        }
    }

    // 2. SIGN IN
    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            // 1. Gọi Service để xác thực người dùng (Nếu sai email hoặc mật khẩu sẽ ném ra lỗi)
            User existingUser = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

            // 2. Nếu có User, thì trả về email và role (ADMIN/USER) dưới dạng JSON cho Frontend.
            Map<String, String> response = new HashMap<>();
            response.put("email", existingUser.getEmail());
            response.put("role", existingUser.getRole()); // Gửi quyền ADMIN/USER

            return ResponseEntity.ok(response); // Trả về JSON: { "email": "...", "role": "..." }

        } catch (Exception e) {
            // Nếu có lỗi (Sai email hoặc mật khẩu), trả về lỗi 401 Unauthorized với thông điệp lỗi
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