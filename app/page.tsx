
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import {
  Menu,
  X,
  ArrowRight,
  Play,
  BookOpen,
  ChefHat,
  Code,
  TrendingUp,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Brain,
  Target,
  ChevronRight,
  Send,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/firebase-auth-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Animated Text Cycle Component
interface AnimatedTextCycleProps {
  words?: string[];
  interval?: number;
  className?: string;
}

function AnimatedTextCycle({
  words = ["Learn", "Grow", "Repeat", "Discover"],
  interval = 2500,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  return (
    <>
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span 
        className="relative inline-block"
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={{
              hidden: { 
                y: -20,
                opacity: 0,
                filter: "blur(8px)"
              },
              visible: {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  duration: 0.4,
                  ease: "easeOut"
                }
              },
              exit: { 
                y: 20,
                opacity: 0,
                filter: "blur(8px)",
                transition: { 
                  duration: 0.3, 
                  ease: "easeOut"
                }
              }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

// 3D Stars Background Component
const Stars = () => {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const radius = Math.random() * 1.5 + 0.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 100;
      ref.current.rotation.y -= delta / 125;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} frustumCulled={true}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

// Floating Orb Component
interface FloatingOrbProps {
  delay?: number;
  duration?: number;
}

const FloatingOrb = ({ delay = 0, duration = 4 }: FloatingOrbProps) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0.3 }}
      animate={{ 
        y: [-20, 20, -20],
        opacity: [0.3, 0.7, 0.3]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      className="absolute w-2 h-2 bg-purple-400 rounded-full blur-sm"
    />
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  onClick,
  ...props 
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25",
    outline: "border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 backdrop-blur-sm",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.button>
  );
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function GlintlyCyberpunkLanding() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Stars Background */}
      <StarsCanvas />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} duration={6} />
        <FloatingOrb delay={2} duration={8} />
        <FloatingOrb delay={4} duration={5} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 z-50 w-full border-b border-purple-500/10 bg-black/20 backdrop-blur-md transition-all duration-300 ${
          scrollY > 50 ? "shadow-lg shadow-purple-500/10 bg-black/40" : ""
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
            >
              <div className="relative">
                <motion.div
                
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">G</span>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-20 blur-md"></div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Glintly
              </span>
            </motion.div>
              
            
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                <Link href="/profile">
                  <Avatar className="w-10 h-10 cursor-pointer">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.username || "User"} />
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => router.push("/login")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
            
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={toggleMenu}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg md:hidden"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Glintly
                  </span>
                </div>
                <button onClick={toggleMenu}>
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </div>
              
              <motion.nav
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {["Features", "About", "Community", "Pricing"].map((item, index) => (
                  <motion.div key={index} variants={itemFadeIn}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:bg-purple-500/10 transition-colors"
                      onClick={toggleMenu}
                    >
                      <span className="text-xl font-medium">{item}</span>
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </a>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm"
              >
                <Sparkle className="w-4 h-4 text-purple-400 fill-current" />
                <span className="text-sm font-medium text-purple-300">Next-Gen Learning Platform</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl xl:text-8xl font-bold leading-tight"
              >
                <AnimatedTextCycle 
                  words={["Learn", "Grow", "Evolve", "Discover"]}
                  interval={2500}
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                />
                <br />
                <span className="text-gray-100">in the Digital Age</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 leading-relaxed"
              >
                Discover bite-sized learning content that fits your lifestyle — from motivation to mastery, all in short, engaging videos.

              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button 
                  size="lg" 
                  className="group"
                  onClick={() => router.push(isAuthenticated ? '/feed' : '/login')}
                >
                  <span className="flex items-center">
                    Initialize Learning
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
            
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm mb-6"
              >
                <span className="text-sm font-medium text-purple-300"> Categories</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <a href="/login"> Smart Learning </a>
                </span>{" "}
                <span className="text-gray-100">Modules</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience seamless knowledge transfer through advanced learning systems
              </p>
            </motion.div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
               {
  icon: Brain,
  title: "Adaptive Learning",
  description: "Personalized lessons that adjust to your pace and focus areas.",
  color: "from-purple-500 to-blue-500"
},
{
  icon: Code,
  title: "Coding Skills",
  description: "Hands-on programming lessons that build real-world projects.",
  color: "from-pink-500 to-purple-500"
},
{
  icon: ChefHat,
  title: "Practical Knowledge",
  description: "Real-world skills simplified into easy, engaging lessons.",
  color: "from-blue-500 to-cyan-500"
},
{
  icon: Rocket,
title: "Skill Growth",
description: "Set goals, track progress, and boost your learning.",
color: "from-purple-500 to-pink-500"
}
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    rotateY: 5
                  }}
                  className="group relative"
                >
                  <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 space-y-6">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                      </div>
                      
                      <motion.div
                        className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-sm font-medium">Initiate Protocol</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="max-w-4xl mx-auto space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 p-12">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    Ready to take{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      your 
                    </span>
                    {" "} digital presence to next level?
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                   Get in touch today to discuss how I can help you achieve your goals
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button size="lg" className="group" onClick={() => {}}>
                      <div className="flex items-center justify-between w-full">
                        <span>Let's get in touch</span>
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                    
                    
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Glintly
              </span>
            </div>
            
            <p className="text-gray-400 max-w-md mx-auto">
             Pioneering the future of learning experiences through personalized discovery.
            </p>
            
            <div className="border-t border-white/10 pt-8">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Glintly. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default GlintlyCyberpunkLanding;
