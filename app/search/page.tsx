"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Search, Clock, Hash, User, Play, X } from "lucide-react"
import Link from "next/link"

// Mock search data
const mockVideos = [
  {
    id: "1",
    title: "5-Minute Pasta Recipe That Will Change Your Life",
    channel: "QuickCook",
    thumbnail: "/delicious-pasta-dish.jpg",
    likes: 1234,
    category: "cooking",
    duration: "5:23",
  },
  {
    id: "2",
    title: "React Hooks Explained in 60 Seconds",
    channel: "CodeMaster",
    thumbnail: "/react-code-on-screen.png",
    likes: 2156,
    category: "tech",
    duration: "1:00",
  },
  {
    id: "3",
    title: "Morning Motivation: Start Your Day Right",
    channel: "MotivateDaily",
    thumbnail: "/inspiring-sunrise-landscape.jpg",
    likes: 892,
    category: "motivation",
    duration: "3:45",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use What",
    channel: "WebDevPro",
    thumbnail: "/css-code-layout-examples.jpg",
    likes: 1567,
    category: "tech",
    duration: "7:30",
  },
]

const mockRecentSearches = [
  { id: "1", query: "pasta recipe", type: "search" },
  { id: "2", query: "CodeMaster", type: "channel" },
  { id: "3", query: "#cooking", type: "hashtag" },
  { id: "4", query: "react hooks", type: "search" },
  { id: "5", query: "MotivateDaily", type: "channel" },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof mockVideos>([])
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate search API call
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      const filteredResults = mockVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.channel.toLowerCase().includes(query.toLowerCase()) ||
          video.category.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filteredResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    // Add to recent searches if not already there
    if (searchQuery.trim() && !recentSearches.some((s) => s.query === searchQuery)) {
      setRecentSearches((prev) => [
        { id: Date.now().toString(), query: searchQuery, type: "search" },
        ...prev.slice(0, 4),
      ])
    }
  }

  const clearRecentSearch = (id: string) => {
    setRecentSearches((prev) => prev.filter((search) => search.id !== id))
  }

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "channel":
        return <User className="h-4 w-4" />
      case "hashtag":
        return <Hash className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-4 p-4">
          <Link href="/feed">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos, channels, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="p-4">
        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleSearch(search.query)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">{getSearchIcon(search.type)}</div>
                    <span className="text-sm">{search.query}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearRecentSearch(search.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{isLoading ? "Searching..." : `Results for "${query}"`}</h2>
              {!isLoading && results.length > 0 && (
                <span className="text-sm text-muted-foreground">{results.length} videos found</span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try searching for something else</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                {results.map((video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors cursor-pointer"
                  >
                    <div
                      className="relative aspect-[9/16] bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white ml-0.5" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>

                      {/* Video Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-gray-300 text-xs mb-1">@{video.channel}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{video.likes.toLocaleString()} likes</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular Searches */}
        {!query && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Popular Topics</h2>
            <div className="flex flex-wrap gap-2">
              {["#cooking", "#tech", "#motivation", "#fitness", "#productivity", "#design"].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(tag)}
                  className="bg-transparent hover:bg-accent/10 hover:border-accent"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
