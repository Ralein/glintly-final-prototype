"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Clock, Heart } from "lucide-react"
import Link from "next/link"

// Mock saved videos data - in real app this would come from API
const mockSavedVideos = [
  {
    id: "3",
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
    title: "10-Minute Full Body Workout",
    channel: "FitQuick",
    thumbnail: "/person-doing-exercises-at-home.jpg",
    likes: 3421,
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: "fitness",
    duration: "10:12",
  },
  {
    id: "7",
    title: "Quick Breakfast Ideas for Busy Mornings",
    channel: "QuickCook",
    thumbnail: "/delicious-pasta-dish.jpg",
    likes: 1567,
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    category: "cooking",
    duration: "4:30",
  },
  {
    id: "8",
    title: "JavaScript Tips Every Developer Should Know",
    channel: "CodeMaster",
    thumbnail: "/react-code-on-screen.png",
    likes: 2890,
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    category: "tech",
    duration: "8:15",
  },
]

export default function SavedPage() {
  const [savedVideos, setSavedVideos] = useState(mockSavedVideos)
  const [filter, setFilter] = useState("all")

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    return `${diffInDays} days ago`
  }

  const filteredVideos = savedVideos.filter((video) => {
    if (filter === "all") return true
    return video.category === filter
  })

  const categories = ["all", "cooking", "tech", "motivation", "fitness"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/feed">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-space-grotesk font-bold">Saved Videos</h1>
              <p className="text-sm text-muted-foreground">{filteredVideos.length} videos saved</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
                className={`whitespace-nowrap ${
                  filter === category ? "bg-accent text-accent-foreground" : "bg-transparent"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Saved Videos Grid */}
      <main className="p-4">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved videos</h3>
            <p className="text-muted-foreground mb-4">Start saving videos you want to watch later</p>
            <Link href="/feed">
              <Button className="bg-accent hover:bg-accent/90">Explore Videos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {filteredVideos.map((video) => (
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
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-300 text-xs mb-1">@{video.channel}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>Saved {formatTimeAgo(video.savedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
