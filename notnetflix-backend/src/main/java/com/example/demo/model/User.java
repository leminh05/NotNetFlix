package com.example.demo.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data 
@Document(collection = "users") 
public class User {
    
    @Id
    private String id;
    private String status = "ACTIVE"; // Mặc định là ACTIVE
    private String email;
    private String password;
    private String role; // "USER" hoặc "ADMIN"
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    private List<Integer> favoriteMovies = new ArrayList<>(); // Danh sách ID phim yêu thích

    public List<Integer> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void setFavoriteMovies(List<Integer> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }
}
