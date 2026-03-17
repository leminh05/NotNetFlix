"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../../auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  
  // STATE MỚI: Quản lý trạng thái Loading
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailText: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STEP 1: EMAIL CHECK
    if (step === 1) {
      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address.");
        return;
      }
      setEmailError("");
      setIsLoading(true); // Bật Loading
      
      try {
        const res = await fetch("http://localhost:8080/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          cache: "no-store", 
        });
        
       
        const data = await res.text(); 
        
       
        const isExist = data === "true"; 
        
        setIsExistingUser(isExist);
        setStep(2);
      } catch (error) {
        setIsError(true);
        setMessage("Connection failed. Please check your backend.");
      } finally {
        setIsLoading(false); // Tắt Loading dù thành công hay thất bại
      }
      return;
    }

    // STEP 2: PASSWORD VALIDATION & AUTH
    if (step === 2) {
      if (!isExistingUser) {
        if (password.length < 6) {
          setPasswordError("Password must be at least 6 characters.");
          return;
        }
      } else {
        if (password.trim() === "") {
          setPasswordError("Please enter your password.");
          return;
        }
      }
      
      setPasswordError("");
      setMessage("");
      setIsLoading(true); // Bật Loading khi bắt đầu gửi API

      const endpoint = isExistingUser ? "/api/auth/signin" : "/api/auth/signup";
      
      try {
        const res = await fetch(`http://localhost:8080${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.text();

        if (res.ok) {
          setIsError(false);
          setMessage("Success! Redirecting...");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          // Không tắt Loading ở đây để nút cứ xoay cho đến khi chuyển trang xong
          setTimeout(() => router.push("/browse"), 1500);
        } else {
          setIsError(true);
          setMessage(data || "Incorrect password. Please try again."); 
          setIsLoading(false); // Chỉ tắt Loading nếu đăng nhập sai
        }
      } catch (error) {
        setIsError(true);
        setMessage("Server error. Please try again later.");
        setIsLoading(false); // Tắt Loading nếu lỗi server
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#2b0808] to-black">
      <nav className="p-4 md:p-6 md:px-16">
        <h1 onClick={() => router.push('/')} className="font-bebas text-4xl md:text-5xl font-bold tracking-wider cursor-pointer inline-block">
          <span className="text-white">NOT</span>
          <span className="text-red-600">NETFLIX</span>
        </h1>
      </nav>

      <div className="flex-grow flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-[400px]">
          <h1 className="text-white text-[32px] font-bold mb-2">
            {step === 1 ? "Sign In" : isExistingUser ? "Welcome Back!" : "Create a Password"}
          </h1>
          <p className="text-gray-200 text-[17px] mb-6 font-light">
            {step === 1 ? "Sign in to your account." : `Account: ${email}`}
          </p>

          {message && (
            <div className={`mb-4 flex items-center p-3 rounded text-[14px] transition-all ${isError ? 'bg-[#e87c03]/10 text-[#e87c03] border border-[#e87c03]/50' : 'bg-green-500/10 text-green-500 border border-green-500/50'}`}>
              {isError && (
                <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 1 && (
              <div>
                <input
                  type="text" placeholder="Email"
                  disabled={isLoading}
                  className={`w-full bg-zinc-800/70 border ${emailError ? 'border-[#eb3942]' : 'border-zinc-700'} text-white px-4 py-4 rounded focus:outline-none focus:border-white transition disabled:opacity-50`}
                  value={email} onChange={(e) => {setEmail(e.target.value); setEmailError("");}}
                />
                {emailError && <p className="text-[#eb3942] text-xs mt-1">{emailError}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col">
                <input
                  type="password" placeholder="Password"
                  disabled={isLoading}
                  className={`w-full bg-zinc-800/70 border ${passwordError || isError ? 'border-[#eb3942]' : 'border-zinc-700'} text-white px-4 py-4 rounded focus:outline-none focus:border-white transition disabled:opacity-50`}
                  value={password} onChange={(e) => {setPassword(e.target.value); setPasswordError(""); setIsError(false); setMessage("");}} autoFocus
                />
                {passwordError && <p className="text-[#eb3942] text-xs mt-1 leading-relaxed">{passwordError}</p>}
                
                {isExistingUser && (
                  <div className="text-right mt-2">
                    <span className="text-sm text-gray-400 hover:text-gray-200 cursor-pointer transition underline decoration-transparent hover:decoration-gray-200">
                      Forgot password?
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* NÚT SUBMIT CÓ HIỆU ỨNG LOADING */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#E50914] text-white font-bold h-[52px] rounded hover:bg-red-700 transition mt-2 flex items-center justify-center disabled:bg-[#E50914]/70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                step === 1 ? "Continue" : isExistingUser ? "Sign In" : "Sign Up"
              )}
            </button>
          </form>

          {step === 2 && !isLoading && (
            <button onClick={() => {setStep(1); setMessage(""); setPasswordError(""); setIsError(false); setPassword("");}} className="text-gray-400 hover:text-white mt-4 text-sm underline">
              Back to change email
            </button>
          )}
        </div>
      </div>
    </main>
  );
}