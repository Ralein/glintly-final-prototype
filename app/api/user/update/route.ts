import { type NextRequest, NextResponse } from "next/server"

// Mock user data storage - in production this would be in database
const mockUsers = [
  {
    id: "user-1",
    username: "learner_alex",
    email: "alex@example.com",
    bio: "Passionate about learning new skills every day. Currently focusing on web development and cooking!",
    avatar: "/placeholder.svg?height=100&width=100",
    interests: ["Learning", "Tech", "Cooking", "Motivation"],
    joinedAt: new Date("2024-01-15"),
    stats: {
      daysActive: 45,
      videosSaved: 127,
      videosWatched: 892,
      currentStreak: 12,
      longestStreak: 28,
    },
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "user-1", username, bio, interests } = body

    // Find user
    const userIndex = mockUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user data
    const updatedUser = {
      ...mockUsers[userIndex],
      ...(username && { username }),
      ...(bio && { bio }),
      ...(interests && { interests }),
      updatedAt: new Date(),
    }

    mockUsers[userIndex] = updatedUser

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-1"

    const user = mockUsers.find((user) => user.id === userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
