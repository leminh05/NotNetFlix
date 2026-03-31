package com.example.demo.service; // Nhớ đổi tên package cho khớp project của bạn

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<Integer> toggleFavorite(String email, Integer movieId) throws Exception {
        // Tìm user theo email, nếu không tìm thấy thì ném lỗi
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));

        // Nếu danh sách yêu thích của user chưa tồn tại thì khởi tạo một danh sách mới
        if (user.getFavoriteMovies() == null) {
            user.setFavoriteMovies(new java.util.ArrayList<>());
        }

        // Lấy danh sách yêu thích hiện tại của user
        List<Integer> favorites = user.getFavoriteMovies();
        if (favorites.contains(movieId)) {
            favorites.remove(movieId); // Nếu đã có thì bỏ ra khỏi danh sách
        } else {
            favorites.add(movieId);    // Nếu chưa có thì thêm vào danh sách
        }

        // Lưu lại user với danh sách yêu thích đã được cập nhật
        userRepository.save(user);
        return favorites;
    }

    // Lấy tất cả người dùng (dành cho Admin)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Hàm tìm User theo email (dành cho lấy danh sách phim yêu thích)
    public List<Integer> getFavoriteMoviesByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        
        return user.getFavoriteMovies() != null ? user.getFavoriteMovies() : new ArrayList<>();
    }
    // 1. Xóa user (Giữ nguyên logic ObjectId của Minh)
    public void deleteUser(String id) {
        userRepository.deleteById(id); 
    }

    // 2. Đổi Role (Giữ nguyên logic an toàn của Minh)
    public User toggleRole(String id) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));

        String currentRole = user.getRole();
        String newRole = "ADMIN".equals(currentRole) ? "USER" : "ADMIN";
        
        user.setRole(newRole);
        return userRepository.save(user);
    }

    // 3. Đổi Status (Sửa tên thành toggleStatus để khớp với Controller)
    public User toggleStatus(String id) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
    
        // Nếu đang BANNED thì cho thành ACTIVE và ngược lại
        // Dùng equals an toàn để chống lỗi Null nếu status bị trống
        String newStatus = "BANNED".equals(user.getStatus()) ? "ACTIVE" : "BANNED";
        user.setStatus(newStatus);
        
        return userRepository.save(user);
    }
}