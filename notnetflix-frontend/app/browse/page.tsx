"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      
      try {
        const res = await fetch("http://localhost:8080/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const exists = await res.json();
        setIsExistingUser(exists);
        setStep(2);
      } catch (error) {
        setIsError(true);
        setMessage("Connection failed. Please check your backend.");
      }
      return;
    }

    // STEP 2: PASSWORD VALIDATION & AUTH
    if (step === 2) {
      // Requirements: 12+ chars, Upper, Lower, Num, Special Symbol
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})/;

      if (!passwordRegex.test(password)) {
        setPasswordError("Password must be at least 12 characters with uppercase, lowercase, numbers, and symbols.");
        return;
      }
      
      setPasswordError("");
      setMessage("");

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
          setTimeout(() => router.push("/browse"), 1500);
        } else {
          setIsError(true);
          setMessage(data); // "Incorrect password" or "Email in use" from Backend
        }
      } catch (error) {
        setIsError(true);
        setMessage("Server error. Please try again later.");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#2b0808] to-black">
      <nav className="p-4 md:p-6 md:px-16">
        <h1 onClick={() => router.push('/')} className="font-bebas text-4xl md:text-5xl font-bold tracking-wider cursor-pointer text-red-600 inline-block">
          NOTNETFLIX
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

          {/* Clean Error Message UI */}
          {message && (
            <div className={`mb-4 flex items-center text-[14px] ${isError ? 'text-[#eb3942]' : 'text-green-500'}`}>
              {isError && (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
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
                  className={`w-full bg-zinc-800 border ${emailError ? 'border-red-600' : 'border-zinc-700'} text-white px-4 py-4 rounded focus:outline-none`}
                  value={email} onChange={(e) => {setEmail(e.target.value); setEmailError("");}}
                />
                {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  type="password" placeholder="Password"
                  className={`w-full bg-zinc-800 border ${passwordError ? 'border-red-600' : 'border-zinc-700'} text-white px-4 py-4 rounded focus:outline-none`}
                  value={password} onChange={(e) => {setPassword(e.target.value); setPasswordError("");}} autoFocus
                />
                {passwordError && <p className="text-red-600 text-xs mt-1 leading-relaxed">{passwordError}</p>}
              </div>
            )}

            <button type="submit" className="bg-[#E50914] text-white font-bold py-3.5 rounded hover:bg-red-700 transition">
              {step === 1 ? "Continue" : isExistingUser ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {step === 2 && (
             <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white mt-4 text-sm underline">
               Back to change email
             </button>
          )}
        </div>
      </div>
    </main>
  );
}