import { NextResponse } from "next/server"

interface NewsPost {
  id: string
  title: string
  content: string
  category: string
  author: string
  publishedAt: string
  cardHtml: string
}

// Mock news data with proper cardHtml
const mockNews: NewsPost[] = [
  {
    id: "1",
    title: "AI Breakthrough in Natural Language Processing",
    content:
      "Researchers have developed a new AI model that can understand context better than ever before, revolutionizing how we interact with technology.",
    category: "AI",
    author: "Dr. Sarah Chen",
    publishedAt: "2024-01-15T10:00:00Z",
    cardHtml: `
      <div class="h-full bg-gradient-to-br from-blue-600 to-purple-700 p-6 flex flex-col justify-between text-white">
        <div>
          <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">AI</div>
          <h3 class="text-xl font-bold mb-3 leading-tight">AI Breakthrough in Natural Language Processing</h3>
        </div>
        <div class="space-y-2">
          <p class="text-sm opacity-90">Revolutionary context understanding</p>
          <div class="flex items-center justify-between text-xs opacity-75">
            <span>Dr. Sarah Chen</span>
            <span>Jan 15, 2024</span>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "2",
    title: "The Future of Remote Learning",
    content:
      "Educational institutions are embracing new technologies to create more engaging and effective remote learning experiences for students worldwide.",
    category: "Education",
    author: "Prof. Michael Rodriguez",
    publishedAt: "2024-01-14T14:30:00Z",
    cardHtml: `
      <div class="h-full bg-gradient-to-br from-green-500 to-teal-600 p-6 flex flex-col justify-between text-white">
        <div>
          <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">Education</div>
          <h3 class="text-xl font-bold mb-3 leading-tight">The Future of Remote Learning</h3>
        </div>
        <div class="space-y-2">
          <p class="text-sm opacity-90">Engaging digital experiences</p>
          <div class="flex items-center justify-between text-xs opacity-75">
            <span>Prof. M. Rodriguez</span>
            <span>Jan 14, 2024</span>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "3",
    title: "Productivity Hacks for 2024",
    content:
      "Discover the latest productivity techniques and tools that successful professionals are using to maximize their efficiency and achieve their goals.",
    category: "Productivity",
    author: "Lisa Thompson",
    publishedAt: "2024-01-13T09:15:00Z",
    cardHtml: `
      <div class="h-full bg-gradient-to-br from-orange-500 to-red-600 p-6 flex flex-col justify-between text-white">
        <div>
          <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">Productivity</div>
          <h3 class="text-xl font-bold mb-3 leading-tight">Productivity Hacks for 2024</h3>
        </div>
        <div class="space-y-2">
          <p class="text-sm opacity-90">Maximize your efficiency</p>
          <div class="flex items-center justify-between text-xs opacity-75">
            <span>Lisa Thompson</span>
            <span>Jan 13, 2024</span>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "4",
    title: "Tech Industry Trends to Watch",
    content:
      "From quantum computing to sustainable technology, explore the emerging trends that will shape the tech industry in the coming years.",
    category: "Technology",
    author: "Alex Kumar",
    publishedAt: "2024-01-12T16:45:00Z",
    cardHtml: `
      <div class="h-full bg-gradient-to-br from-purple-600 to-pink-600 p-6 flex flex-col justify-between text-white">
        <div>
          <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">Technology</div>
          <h3 class="text-xl font-bold mb-3 leading-tight">Tech Industry Trends to Watch</h3>
        </div>
        <div class="space-y-2">
          <p class="text-sm opacity-90">Quantum & sustainable tech</p>
          <div class="flex items-center justify-between text-xs opacity-75">
            <span>Alex Kumar</span>
            <span>Jan 12, 2024</span>
          </div>
        </div>
      </div>
    `,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let filteredPosts = mockNews

    if (category && category !== "all") {
      filteredPosts = mockNews.filter((post) => post.category.toLowerCase() === category.toLowerCase())
    }

    const categories = [...new Set(mockNews.map((post) => post.category))]

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
      categories,
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
