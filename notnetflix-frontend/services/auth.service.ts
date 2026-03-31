// auth.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const AuthService = {
  // 1. Gọi API Kiểm tra Email
  checkEmail: async (email: string) => {
    const res = await fetch(`${API_URL}/api/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Lỗi server khi kiểm tra email");
    return res.text(); // Trả về "true" hoặc "false"
  },

  // 2. Gọi API Đăng ký
  signUp: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg);
    }
    return res.text();
  },

  // 3. Gọi API Đăng nhập
  signIn: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg); // Trả về lỗi nếu đăng nhập thất bại
    }
    return res.json();
  }
};