"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Calendar,
  Bookmark,
  RotateCcw,
  Trophy,
  Flame,
  Target,
  Play,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/firebase-auth-provider"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

// Define a type for the user profile data from Firestore
interface UserProfile {
  username: string;
  bio: string;
  interests: string[];
  createdAt: string;
}

const mockSavedVideos = [
  {
    id: "1",
    title: "React Hooks Explained",
    thumbnail: "/react-code-on-screen.png",
    duration: "8:15",
  },
  {
    id: "2",
    title: "Quick Pasta Recipe",
    thumbnail: "/delicious-pasta-dish.jpg",
    duration: "5:23",
  },
  {
    id: "3",
    title: "Morning Motivation",
    thumbnail: "/inspiring-sunrise-landscape.jpg",
    duration: "3:45",
  },
]

const mockAchievements = [
  {
    id: "1",
    title: "First Save",
    description: "Saved your first video",
    icon: Bookmark,
    earned: true,
    earnedAt: new Date("2024-01-16"),
  },
  {
    id: "2",
    title: "Week Warrior",
    description: "7-day learning streak",
    icon: Flame,
    earned: true,
    earnedAt: new Date("2024-01-22"),
  },
  {
    id: "3",
    title: "Century Club",
    description: "Saved 100 videos",
    icon: Target,
    earned: true,
    earnedAt: new Date("2024-02-28"),
  },
  {
    id: "4",
    title: "Master Learner",
    description: "30-day learning streak",
    icon: Trophy,
    earned: false,
    earnedAt: null,
  },
]

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchUserProfile = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as UserProfile
          setUserProfile(profileData)
          setEditForm({
            username: profileData.username || "",
            bio: profileData.bio || "",
          })
        } else {
          // If no profile, maybe redirect to profile setup
          router.push("/profile-setup")
        }
      }
    }

    fetchUserProfile()
  }, [isAuthenticated, user, router])

  const handleSaveProfile = async () => {
    if (!user) return
    const userDocRef = doc(db, "users", user.uid)
    await updateDoc(userDocRef, {
      username: editForm.username,
      bio: editForm.bio,
    })
    setUserProfile((prev) => prev ? { ...prev, ...editForm } : null)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  if (!isAuthenticated || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  const mockStats = {
    daysActive: Math.floor((Date.now() - new Date(userProfile.createdAt).getTime()) / (1000 * 60 * 60 * 24)) || 1,
    videosSaved: 127,
    videosWatched: 892,
    currentStreak: 12,
    longestStreak: 28,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <Link href="/feed">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isEditing) {
                  setEditForm({ username: userProfile.username || "", bio: userProfile.bio || "" })
                }
                setIsEditing(!isEditing)
              }}
            >
              {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-400 hover:text-red-300">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6 bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.photoURL || "/placeholder.svg?height=100&width=100"} alt={userProfile.username} />
                <AvatarFallback className="bg-accent text-accent-foreground text-xl font-bold">
                  {userProfile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Username"
                      className="bg-input/50"
                    />
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Bio"
                      className="bg-input/50 min-h-[80px]"
                    />
                    <Button onClick={handleSaveProfile} className="bg-accent hover:bg-accent/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-space-grotesk font-bold mb-1">@{userProfile.username}</h2>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                      {userProfile.bio || "No bio added yet. Click edit to add one!"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(userProfile.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="bg-accent/10 text-accent">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{mockStats.daysActive}</div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{mockStats.videosSaved}</div>
              <div className="text-xs text-muted-foreground">Videos Saved</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{mockStats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{mockStats.videosWatched}</div>
              <div className="text-xs text-muted-foreground">Videos Watched</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Saved
            </TabsTrigger>
            <TabsTrigger
              value="revisit"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Revisit
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-6">
            <div className="grid grid-cols-3 gap-3">
              {mockSavedVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden bg-cover bg-center cursor-pointer group"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/saved">
                <Button variant="outline" className="bg-transparent">
                  View All Saved Videos
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="revisit" className="mt-6">
            <div className="text-center py-8">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Revisit</h3>
              <p className="text-muted-foreground mb-4">
                You have 3 videos ready for review to strengthen your learning
              </p>
              <Link href="/revisit">
                <Button className="bg-accent hover:bg-accent/90">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Revisiting
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAchievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card
                    key={achievement.id}
                    className={`bg-card/50 backdrop-blur-sm border-border/50 ${
                      achievement.earned ? "border-accent/30" : "opacity-60"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.earned ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          {achievement.earned && achievement.earnedAt && (
                            <p className="text-xs text-accent mt-1">Earned {formatDate(achievement.earnedAt)}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}