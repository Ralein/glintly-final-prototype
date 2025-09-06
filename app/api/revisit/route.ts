import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

const mockRevisitVideos = [
  {
    id: "revisit-1",
    userId: "user-1",
    videoId: "8",
    title: "JavaScript Tips Every Developer Should Know",
    channel: "CodeMaster",
    thumbnail: "/react-code-on-screen.png",
    likes: 2890,
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    category: "tech",
    duration: "8:15",
    lastWatched: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    priority: "high", // Based on time since saved and user engagement
  },
  {
    id: "revisit-2",
    userId: "user-1",
    videoId: "5",
    title: "10-Minute Full Body Workout",
    channel: "FitQuick",
    thumbnail: "/person-doing-exercises-at-home.jpg",
    likes: 3421,
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: "fitness",
    duration: "10:12",
    lastWatched: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    priority: "medium",
  },
  {
    id: "revisit-3",
    userId: "user-1",
    videoId: "12",
    title: "Advanced CSS Animations Tutorial",
    channel: "WebDevPro",
    thumbnail: "/css-code-layout-examples.jpg",
    likes: 1890,
    savedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: "tech",
    duration: "12:30",
    lastWatched: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    priority: "high",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-1" // In real app, get from auth session

    // Filter videos saved more than 3 days ago
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const revisitVideos = mockRevisitVideos.filter((video) => video.userId === userId && video.savedAt < threeDaysAgo)

    // Sort by priority and then by oldest saved first (spaced repetition)
    revisitVideos.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      if (priorityDiff !== 0) return priorityDiff

      // Then by oldest saved first
      return a.savedAt.getTime() - b.savedAt.getTime()
    })

    return NextResponse.json({
      revisitVideos,
      total: revisitVideos.length,
      recommendations: {
        totalReady: revisitVideos.length,
        highPriority: revisitVideos.filter((v) => v.priority === "high").length,
        mediumPriority: revisitVideos.filter((v) => v.priority === "medium").length,
      },
    })
  } catch (error) {
    console.error("Revisit API error:", error)
    return NextResponse.json({ error: "Failed to fetch revisit videos" }, { status: 500 })
  }
}
