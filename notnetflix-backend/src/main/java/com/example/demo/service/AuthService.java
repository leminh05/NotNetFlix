package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service // Nơi xử lý logic liên quan đến Authentication
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Logic Kiểm tra Email
    public boolean checkEmailExists(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return userRepository.findByEmail(email).isPresent();
    }

    // 2. Logic Đăng ký
    public void registerUser(User user) throws Exception {
        if (checkEmailExists(user.getEmail())) {
            throw new Exception("This email is already in use.");
        }
        // Băm mật khẩu và lưu
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
    }

    // 3. Logic Đăng nhập
    public User authenticateUser(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new Exception("Account not found.");
        }

        User existingUser = userOptional.get();
        if (password == null || existingUser.getPassword() == null) {
            throw new Exception("Password cannot be empty.");
        }

        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new Exception("Incorrect password. Please try again.");
        }

        return existingUser; // Thành công thì trả về thông tin user
    }
}