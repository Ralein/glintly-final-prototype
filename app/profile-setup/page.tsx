"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/firebase-auth-provider"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"

const interests = [
  { id: "learning", name: "Learning", icon: BookOpen, color: "bg-blue-500" },
  { id: "motivation", name: "Motivation", icon: TrendingUp, color: "bg-green-500" },
  { id: "cooking", name: "Cooking", icon: ChefHat, color: "bg-orange-500" },
  { id: "tech", name: "Tech", icon: Code, color: "bg-purple-500" },
  { id: "finance", name: "Finance", icon: DollarSign, color: "bg-emerald-500" },
  { id: "wellness", name: "Wellness", icon: Heart, color: "bg-pink-500" },
  { id: "fitness", name: "Fitness", icon: Dumbbell, color: "bg-red-500" },
  { id: "career", name: "Career Tips", icon: Briefcase, color: "bg-indigo-500" },
  { id: "self-improvement", name: "Self-Improvement", icon: Lightbulb, color: "bg-yellow-500" },
  { id: "creativity", name: "Design & Creativity", icon: Palette, color: "bg-cyan-500" },
]

function PersonalizationLoadingScreen({ selectedInterests }: { selectedInterests: string[] }) {
  const loadingSteps = [
    { icon: Brain, text: "Analyzing your interests..." },
    { icon: Target, text: "Curating personalized content..." },
    { icon: Sparkles, text: "Creating your perfect feed..." },
  ]

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const selectedInterestNames = selectedInterests
    .map((id) => interests.find((interest) => interest.id === id)?.name)
    .filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center max-w-md mx-auto p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-space-grotesk font-bold mb-2">Personalizing Your Experience</h2>
          <p className="text-muted-foreground">Based on your interests, we're filtering the perfect Glints for you</p>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3"
            >
              {React.createElement(loadingSteps[currentStep].icon, { className: "h-6 w-6 text-accent" })}
              <span className="text-lg font-medium">{loadingSteps[currentStep].text}</span>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
            />
          </div>

          <div className="bg-card/50 rounded-2xl p-4 border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Your selected interests:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedInterestNames.map((name, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    {name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProfileSetupPage() {
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [photoUrl, setPhotoUrl] = useState("") // New state for photoUrl
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("🔍 ProfileSetup useEffect - Auth state:", {
      isAuthenticated,
      user: user ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified
      } : null
    })

    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login")
      router.push("/login")
      return
    }

    if (user) {
      console.log("✅ User found, setting username:", user.displayName || "")
      setUsername(user.displayName || "")
    }
  }, [isAuthenticated, user, router])

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("🚀 Form submission started")
    console.log("📊 Current state:", {
      username,
      bio,
      selectedInterests,
      user: user ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email
      } : null,
      isAuthenticated
    })

    if (selectedInterests.length === 0) {
      console.log("❌ No interests selected")
      alert("Please select at least one interest")
      return
    }

    if (!user || !user.uid) {
      console.log("❌ No user or user.uid:", { user: !!user, uid: user?.uid })
      alert("You must be logged in to set up a profile.")
      return
    }

    console.log("✅ Validation passed, proceeding with API call")
    setIsLoading(true)

    const requestData: any = {
      uid: user.uid,
      username,
    };

    if (user.email) {
      requestData.email = user.email;
    }

    if (photoUrl) {
      requestData.photoUrl = photoUrl;
    }

    console.log("📤 Request data being sent:", requestData)
    console.log("📝 JSON.stringify result:", JSON.stringify(requestData))
    console.log("📏 JSON string length:", JSON.stringify(requestData).length)

    try {
      console.log("🌐 Making fetch request to /api/user")
      
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("📥 Response received:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("❌ Response not ok, error text:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`)
      } else {
        const responseData = await response.json()
        console.log("✅ Success response:", responseData)
      }

      // Optionally update the user's display name in Firebase Auth
      // await updateProfile(user, { displayName: username });

      setTimeout(() => {
        console.log("🔄 Redirecting to feed after delay")
        setIsLoading(false);
        router.push("/feed");
      }, 4500);
    } catch (error) {
      console.error("💥 Error setting up profile:", error);
      alert("Failed to set up profile. Please try again.");
      setIsLoading(false);
    }
  }

  // Add debug info to the UI during development
  const isDebugMode = process.env.NODE_ENV === 'development'

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading...</p>
          {isDebugMode && (
            <div className="mt-4 text-xs text-muted-foreground">
              Debug: isAuthenticated={String(isAuthenticated)}, user={user ? 'exists' : 'null'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <AnimatePresence>
        {isLoading && <PersonalizationLoadingScreen selectedInterests={selectedInterests} />}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="font-space-grotesk font-bold text-2xl">Glintly</span>
          </div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Welcome to Glintly</h1>
          <p className="text-muted-foreground">Let's personalize your learning experience</p>
          
         
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>This information will help us customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-input/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="photoUrl" className="text-sm font-medium">
                  Profile Picture URL (optional)
                </label>
                <Input
                  id="photoUrl"
                  placeholder="e.g., https://example.com/your-photo.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="bg-input/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio (optional)
                </label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-input/50 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>What interests you?</CardTitle>
              <CardDescription>Select topics you'd like to learn about (choose at least one)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((interest) => {
                  const Icon = interest.icon
                  const isSelected = selectedInterests.includes(interest.id)
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-lg scale-105"
                          : "border-border/50 hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-xl ${interest.color} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-center">{interest.name}</span>
                        {isSelected && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-semibold"
            disabled={isLoading || selectedInterests.length === 0}
          >
            {isLoading ? "Setting up your profile..." : "Start Learning"}
          </Button>
        </form>
      </div>
    </div>
  )
}