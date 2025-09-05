import { type NextRequest, NextResponse } from "next/server"

// Mock video data - in production this would come from database
const mockVideos = [
  {
    id: "1",
    title: "5-Minute Pasta Recipe That Will Change Your Life",
    channel: "QuickCook",
    videoUrl: "/cooking-pasta-recipe-video.jpg",
    thumbnail: "/delicious-pasta-dish.jpg",
    likes: 1234,
    isLiked: false,
    isSaved: false,
    category: "cooking",
    duration: "5:23",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    title: "React Hooks Explained in 60 Seconds",
    channel: "CodeMaster",
    videoUrl: "/react-hooks-coding-tutorial.jpg",
    thumbnail: "/react-code-on-screen.png",
    likes: 2156,
    isLiked: true,
    isSaved: false,
    category: "tech",
    duration: "1:00",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "3",
    title: "Morning Motivation: Start Your Day Right",
    channel: "MotivateDaily",
    videoUrl: "/sunrise-motivation-video.jpg",
    thumbnail: "/inspiring-sunrise-landscape.jpg",
    likes: 892,
    isLiked: false,
    isSaved: true,
    category: "motivation",
    duration: "3:45",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use What",
    channel: "WebDevPro",
    videoUrl: "/css-grid-flexbox.png",
    thumbnail: "/css-code-layout-examples.jpg",
    likes: 1567,
    isLiked: false,
    isSaved: false,
    category: "tech",
    duration: "7:30",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "5",
    title: "10-Minute Full Body Workout",
    channel: "FitQuick",
    videoUrl: "/home-workout-exercise-video.jpg",
    thumbnail: "/person-doing-exercises-at-home.jpg",
    likes: 3421,
    isLiked: true,
    isSaved: true,
    category: "fitness",
    duration: "10:12",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
]

// Mock revisit videos for nudges
const mockRevisitVideos = [
  {
    id: "revisit-1",
    title: "JavaScript Tips Every Developer Should Know",
    channel: "CodeMaster",
    thumbnail: "/react-code-on-screen.png",
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    duration: "8:15",
    category: "tech",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const interests = searchParams.get("interests")?.split(",") || []

    // Simulate smart feed algorithm
    let feedVideos = [...mockVideos]

    // Filter by user interests if provided
    if (interests.length > 0) {
      feedVideos = feedVideos.filter((video) => interests.includes(video.category))
    }

    // Add revisit nudges every 7 videos
    const videosWithNudges = []
    for (let i = 0; i < feedVideos.length; i++) {
      videosWithNudges.push(feedVideos[i])

      // Insert revisit nudge every 7 videos
      if ((i + 1) % 7 === 0 && mockRevisitVideos.length > 0) {
        const revisitVideo = mockRevisitVideos[0]
        videosWithNudges.push({
          ...revisitVideo,
          id: `nudge-${i}`,
          type: "revisit-nudge",
          daysAgo: Math.floor((Date.now() - revisitVideo.savedAt.getTime()) / (1000 * 60 * 60 * 24)),
        })
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVideos = videosWithNudges.slice(startIndex, endIndex)

    return NextResponse.json({
      videos: paginatedVideos,
      pagination: {
        page,
        limit,
        total: videosWithNudges.length,
        hasMore: endIndex < videosWithNudges.length,
      },
    })
  } catch (error) {
    console.error("Feed API error:", error)
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 })
  }
}
