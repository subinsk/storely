"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SimpleAuth({ authType }: { authType: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authType === "login") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/");
        } else {
          alert("Login failed");
        }
      } else {
        // Handle signup
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          alert("Account created! Please login.");
          router.push("/auth/login");
        } else {
          alert("Signup failed");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1>{authType === "login" ? "Login" : "Sign Up"}</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{ width: "100%", padding: 12, marginBottom: 16 }}
        >
          {isLoading ? "Loading..." : authType === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <button
        onClick={() => signIn("google")}
        style={{ width: "100%", padding: 12 }}
      >
        Continue with Google
      </button>
    </div>
  );
}
