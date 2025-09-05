import { type NextRequest, NextResponse } from "next/server"

// Mock saved videos storage - in production this would be in database
const mockSavedVideos = [
  {
    id: "3",
    userId: "user-1", // In real app, get from auth session
    videoId: "3",
    title: "Morning Motivation: Start Your Day Right",
    channel: "MotivateDaily",
    thumbnail: "/inspiring-sunrise-landscape.jpg",
    likes: 892,
    savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: "motivation",
    duration: "3:45",
  },
  {
    id: "5",
    userId: "user-1",
    videoId: "5",
    title: "10-Minute Full Body Workout",
    channel: "FitQuick",
    thumbnail: "/person-doing-exercises-at-home.jpg",
    likes: 3421,
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: "fitness",
    duration: "10:12",
  },
]

// GET - Retrieve saved videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-1" // In real app, get from auth session
    const category = searchParams.get("category")

    let savedVideos = mockSavedVideos.filter((video) => video.userId === userId)

    // Filter by category if provided
    if (category && category !== "all") {
      savedVideos = savedVideos.filter((video) => video.category === category)
    }

    // Sort by most recently saved
    savedVideos.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())

    return NextResponse.json({
      savedVideos,
      total: savedVideos.length,
    })
  } catch (error) {
    console.error("Get saved videos error:", error)
    return NextResponse.json({ error: "Failed to fetch saved videos" }, { status: 500 })
  }
}

// POST - Save a video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, title, channel, thumbnail, likes, category, duration } = body
    const userId = "user-1" // In real app, get from auth session

    // Check if already saved
    const existingIndex = mockSavedVideos.findIndex((video) => video.videoId === videoId && video.userId === userId)

    if (existingIndex >= 0) {
      // Remove if already saved (toggle functionality)
      mockSavedVideos.splice(existingIndex, 1)
      return NextResponse.json({ saved: false, message: "Video removed from saved" })
    } else {
      // Add to saved videos
      const newSavedVideo = {
        id: `saved-${Date.now()}`,
        userId,
        videoId,
        title,
        channel,
        thumbnail,
        likes,
        category,
        duration,
        savedAt: new Date(),
      }
      mockSavedVideos.push(newSavedVideo)
      return NextResponse.json({ saved: true, message: "Video saved successfully" })
    }
  } catch (error) {
    console.error("Save video error:", error)
    return NextResponse.json({ error: "Failed to save video" }, { status: 500 })
  }
}
