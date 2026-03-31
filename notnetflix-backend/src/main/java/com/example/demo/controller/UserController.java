package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // API để Admin xem danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("Role") String role) {
        // Lính gác kiểm tra quyền Admin
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Access Denied: You are not an Admin.");
        }

        List<User> users = userService.getAllUsers();
        
        // Bảo mật: Xóa mật khẩu trước khi gửi về giao diện
        for (User u : users) {
            u.setPassword(null);
        }

        return ResponseEntity.ok(users);
    }

    // API để thêm hoặc xóa phim yêu thích (Toggle Favorite)
    @PostMapping("/favorites")
    public ResponseEntity<?> toggleFavorite(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            Integer movieId = (Integer) request.get("movieId");
            
            List<Integer> updatedFavorites = userService.toggleFavorite(email, movieId);
            
            return ResponseEntity.ok(updatedFavorites);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // Lấy danh sách ID phim yêu thích của 1 User cụ thể
    @GetMapping("/favorites/{email}")
    public ResponseEntity<?> getFavorites(@PathVariable String email) {
        try {
            List<Integer> favoriteMovies = userService.getFavoriteMoviesByEmail(email); // Giả sử bạn đã có hàm tìm user theo email
            return ResponseEntity.ok(favoriteMovies);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    // 1. API Xóa User (Chỉ Admin mới có quyền gọi)
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable String id, @RequestHeader("Role") String role) {
    if (!"ADMIN".equals(role)) {
        return ResponseEntity.status(403).body("Access Denied");
    }
    userService.deleteUser(id);
    return ResponseEntity.ok().build();
}

// 2. API Đổi quyền hạn (Admin/User)
@PutMapping("/{id}/role")
public ResponseEntity<?> toggleRole(@PathVariable String id, @RequestHeader("Role") String role) {
    if (!"ADMIN".equals(role)) {
        return ResponseEntity.status(403).body("Access Denied");
    }
    try {
        User updatedUser = userService.toggleRole(id);
        return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}
// 3. API Đổi trạng thái Active/Banned (NÂNG CAO)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id, @RequestHeader("Role") String role) {
        // Kiểm tra quyền Admin
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }
        
        try {
            // Gọi hàm toggleStatus trong UserService
            User updatedUser = userService.toggleStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}