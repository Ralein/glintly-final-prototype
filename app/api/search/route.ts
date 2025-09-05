import { type NextRequest, NextResponse } from "next/server"

// Mock video database for search
const mockVideos = [
  {
    id: "1",
    title: "5-Minute Pasta Recipe That Will Change Your Life",
    channel: "QuickCook",
    thumbnail: "/delicious-pasta-dish.jpg",
    likes: 1234,
    category: "cooking",
    duration: "5:23",
    tags: ["pasta", "recipe", "quick", "cooking", "italian"],
  },
  {
    id: "2",
    title: "React Hooks Explained in 60 Seconds",
    channel: "CodeMaster",
    thumbnail: "/react-code-on-screen.png",
    likes: 2156,
    category: "tech",
    duration: "1:00",
    tags: ["react", "hooks", "javascript", "programming", "web development"],
  },
  {
    id: "3",
    title: "Morning Motivation: Start Your Day Right",
    channel: "MotivateDaily",
    thumbnail: "/inspiring-sunrise-landscape.jpg",
    likes: 892,
    category: "motivation",
    duration: "3:45",
    tags: ["motivation", "morning", "productivity", "mindset"],
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use What",
    channel: "WebDevPro",
    thumbnail: "/css-code-layout-examples.jpg",
    likes: 1567,
    category: "tech",
    duration: "7:30",
    tags: ["css", "grid", "flexbox", "layout", "web design"],
  },
  {
    id: "5",
    title: "10-Minute Full Body Workout",
    channel: "FitQuick",
    thumbnail: "/person-doing-exercises-at-home.jpg",
    likes: 3421,
    category: "fitness",
    duration: "10:12",
    tags: ["workout", "fitness", "exercise", "home", "bodyweight"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query.trim()) {
      return NextResponse.json({ results: [], total: 0 })
    }

    // Search algorithm - matches title, channel, category, and tags
    let results = mockVideos.filter((video) => {
      const matchesQuery =
        video.title.toLowerCase().includes(query) ||
        video.channel.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query) ||
        video.tags.some((tag) => tag.toLowerCase().includes(query))

      const matchesCategory = !category || video.category === category

      return matchesQuery && matchesCategory
    })

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase().includes(query) || a.channel.toLowerCase().includes(query)
      const bExactMatch = b.title.toLowerCase().includes(query) || b.channel.toLowerCase().includes(query)

      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1

      // Then sort by likes (popularity)
      return b.likes - a.likes
    })

    // Apply limit
    results = results.slice(0, limit)

    return NextResponse.json({
      results,
      total: results.length,
      query,
      suggestions: generateSearchSuggestions(query),
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

function generateSearchSuggestions(query: string): string[] {
  const suggestions = [
    "react hooks",
    "pasta recipe",
    "morning motivation",
    "css grid",
    "workout routine",
    "javascript tips",
    "cooking basics",
    "productivity hacks",
  ]

  return suggestions.filter((suggestion) => suggestion.includes(query.toLowerCase())).slice(0, 5)
}
