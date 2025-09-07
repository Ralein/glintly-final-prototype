"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import {
  ArrowLeft,
  User,
  BookOpen,
  ChefHat,
  Code,
  TrendingUp,
  DollarSign,
  Heart,
  Dumbbell,
  Briefcase,
  Lightbulb,
  Palette,
  Sparkles,
  Brain,
  Target,
  ArrowRight,
  Image,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/firebase-auth-provider";

// Static Stars Background Component
const Stars = () => {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
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

// Enhanced Textarea Component
interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
  rows?: number;
}

const Textarea = ({
  placeholder,
  value,
  onChange,
  required,
  className = "",
  rows = 3,
}: TextareaProps) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-sm group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={`w-full pl-4 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300 resize-none ${className}`}
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

// Interest Badge Component
interface InterestBadgeProps {
  interest: {
    id: string;
    name: string;
    icon: any;
    color: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const InterestBadge = ({ interest, isSelected, onClick }: InterestBadgeProps) => {
  const Icon = interest.icon;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group hover:scale-105 ${
        isSelected
          ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/20"
          : "border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${interest.color} flex items-center justify-center shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm font-medium text-center text-white">{interest.name}</span>
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </button>
  );
};

// Personalization Loading Screen
function PersonalizationLoadingScreen({ selectedInterests }: { selectedInterests: string[] }) {
  const interests = [
    { id: "learning", name: "Learning", icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { id: "motivation", name: "Motivation", icon: TrendingUp, color: "from-green-500 to-green-600" },
    { id: "cooking", name: "Cooking", icon: ChefHat, color: "from-orange-500 to-orange-600" },
    { id: "tech", name: "Tech", icon: Code, color: "from-purple-500 to-purple-600" },
    { id: "finance", name: "Finance", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
    { id: "wellness", name: "Wellness", icon: Heart, color: "from-pink-500 to-pink-600" },
    { id: "fitness", name: "Fitness", icon: Dumbbell, color: "from-red-500 to-red-600" },
    { id: "career", name: "Career Tips", icon: Briefcase, color: "from-indigo-500 to-indigo-600" },
    { id: "self-improvement", name: "Self-Improvement", icon: Lightbulb, color: "from-yellow-500 to-yellow-600" },
    { id: "creativity", name: "Design & Creativity", icon: Palette, color: "from-cyan-500 to-cyan-600" },
  ];

  const loadingSteps = [
    { icon: Brain, text: "Analyzing your interests..." },
    { icon: Target, text: "Curating personalized content..." },
    { icon: Sparkles, text: "Creating your perfect feed..." },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const selectedInterestNames = selectedInterests
    .map((id) => interests.find((interest) => interest.id === id)?.name)
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <StarsCanvas />
      <div className="relative text-center max-w-md mx-auto p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Personalizing Your Experience
          </h2>
          <p className="text-gray-300 text-lg">Based on your interests, we're curating the perfect content for you</p>
        </motion.div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3"
            >
              {React.createElement(loadingSteps[currentStep].icon, { 
                className: "h-6 w-6 text-purple-400" 
              })}
              <span className="text-lg font-medium text-white">{loadingSteps[currentStep].text}</span>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <p className="text-sm text-gray-300 mb-3">Your selected interests:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedInterestNames.map((name, index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                  >
                    {name}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProfileSetupPage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const interests = [
    { id: "learning", name: "Learning", icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { id: "motivation", name: "Motivation", icon: TrendingUp, color: "from-green-500 to-green-600" },
    { id: "cooking", name: "Cooking", icon: ChefHat, color: "from-orange-500 to-orange-600" },
    { id: "tech", name: "Tech", icon: Code, color: "from-purple-500 to-purple-600" },
    { id: "finance", name: "Finance", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
    { id: "wellness", name: "Wellness", icon: Heart, color: "from-pink-500 to-pink-600" },
    { id: "fitness", name: "Fitness", icon: Dumbbell, color: "from-red-500 to-red-600" },
    { id: "career", name: "Career Tips", icon: Briefcase, color: "from-indigo-500 to-indigo-600" },
    { id: "self-improvement", name: "Self-Improvement", icon: Lightbulb, color: "from-yellow-500 to-yellow-600" },
    { id: "creativity", name: "Design & Creativity", icon: Palette, color: "from-cyan-500 to-cyan-600" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setUsername(user.username || "");
    }
  }, [isAuthenticated, user, router]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedInterests.length === 0) {
      alert("Please select at least one interest");
      return;
    }

    if (!user || !user.id) {
      alert("You must be logged in to set up a profile.");
      return;
    }

    setIsLoading(true);

    const requestData: any = {
      uid: user.id,
      username,
      interests: selectedInterests,
      bio,
    };

    if (user.email) {
      requestData.email = user.email;
    }

    if (photoUrl) {
      requestData.photoUrl = photoUrl;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
      }

      router.push("/feed");
      
    } catch (error) {
      console.error("Error setting up profile:", error);
      alert("Failed to set up profile. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
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
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <PersonalizationLoadingScreen selectedInterests={selectedInterests} />}
      </AnimatePresence>

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
              onClick={() => router.push("/login")}
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
        <div className="w-full max-w-2xl">
          {/* Welcome Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400 fill-current" />
              <span className="text-sm font-medium text-purple-300">
                Welcome to Glintly
              </span>
            </div>
          </div>

          {/* Profile Setup Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-3xl"></div>

            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Complete Your Profile
                </h1>
                <p className="text-gray-300 text-lg">
                  Let's personalize your learning experience
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                    Personal Information
                  </h3>
                  
                  <div>
                    <Input
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      icon={<User className="w-5 h-5" />}
                    />
                  </div>

                  <div>
                    <Input
                      type="url"
                      placeholder="Profile picture URL (optional)"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      icon={<Image className="w-5 h-5" />}
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Tell us a bit about yourself... (optional)"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Interests Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      What interests you?
                    </h3>
                    <p className="text-gray-400">
                      Select topics you'd like to learn about (choose at least one)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {interests.map((interest) => (
                      <InterestBadge
                        key={interest.id}
                        interest={interest}
                        isSelected={selectedInterests.includes(interest.id)}
                        onClick={() => toggleInterest(interest.id)}
                      />
                    ))}
                  </div>

                  {selectedInterests.length > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-purple-300">
                        {selectedInterests.length} interest{selectedInterests.length > 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full group"
                  size="lg"
                  disabled={isLoading || selectedInterests.length === 0}
                >
                  <span className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Setting up your profile...
                      </>
                    ) : (
                      <>
                        Start Learning
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}