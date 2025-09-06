"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Sparkle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/firebase-auth-provider";

// Static Stars Background Component
const Stars = () => {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3); // Increased star count for better cosmic effect
    for (let i = 0; i < 5000; i++) {
      // Create a more spread out distribution for better cosmic feel
      const radius = Math.random() * 2.5 + 0.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  return (
    <group rotation={[0.2, 0.3, 0]}>
      <Points ref={ref} positions={sphere} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1], fov: 60 }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

// Static Cosmic Orbs Component
const StaticOrb = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`absolute w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm opacity-60 ${className}`}
    />
  );
};

// Enhanced Input Component
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  icon,
  className = "",
}: InputProps) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-sm group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 z-10 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${
            icon ? "pl-12" : "pl-4"
          } pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300 ${className}`}
        />
      </div>
    </div>
  );
};

// Enhanced Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
    outline:
      "border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20",
    ghost: "text-gray-300 hover:text-white hover:bg-white/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};

function GlintlyLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/profile-setup");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/feed");
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
        ? 'Invalid email or password. Please try again.' 
        : error.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      router.push("/feed");
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white relative overflow-hidden">
      {/* Static Stars Background */}
      <StarsCanvas />

      {/* Static Cosmic Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <StaticOrb className="top-20 left-20" />
        <StaticOrb className="top-40 right-32" />
        <StaticOrb className="bottom-32 left-16" />
        <StaticOrb className="bottom-20 right-20" />
        <StaticOrb className="top-1/3 left-1/2" />
        <StaticOrb className="bottom-1/3 right-1/4" />
      </div>

      {/* Cosmic Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="w-full max-w-md">
          {/* Welcome Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-sm">
              <Sparkle className="w-4 h-4 text-purple-400 fill-current" />
              <span className="text-sm font-medium text-purple-300">
                Glintly Access Portal
              </span>
            </div>
          </div>

          {/* Login Card */}
          <div className="relative">
            {/* Enhanced glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-3xl"></div>

            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-300 text-lg">
                  Sign in to continue your learning journey
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Google Login */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  className="w-full bg-white/5 hover:bg-white/10 border-white/30"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center w-full">
                    <Chrome className="w-5 h-5 mr-3" />
                    <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
                  </div>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-r from-black via-gray-900 to-black text-gray-400">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<Mail className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      icon={<Lock className="w-5 h-5" />}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full group"
                  disabled={isLoading || !email || !password}
                >
                  <span className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              {/* Footer Links */}
              <div className="text-center mt-8 space-y-4">
                <div className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <button
                    onClick={() => router.push("/signup")}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign up
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  <button
                    onClick={() => router.push("/forgot-password")}
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlintlyLoginPage;