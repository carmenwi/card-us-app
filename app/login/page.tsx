"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/auth";
import { loadProfileData, saveProfileData } from "@/lib/profile-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    const cleanUsername = username.trim().startsWith("@") 
      ? username.trim() 
      : `@${username.trim()}`;
    
    saveUser(cleanUsername);
    
    // Load existing profile data and only update username
    const existingProfile = loadProfileData();
    saveProfileData({
      ...existingProfile,
      username: cleanUsername,
    });
    
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <img src="/mock-images/logo_lila.png" alt="CardUS Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Card•Us
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your username to start
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-foreground block mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-base shadow-lg"
            >
              Continue
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Your data stays on your device
          </p>
        </div>
      </div>
    </div>
  );
}
