"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Clock, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"

// Mock revisit videos data - videos saved >3 days ago
const mockRevisitVideos = [
  {
    id: "8",
    title: "JavaScript Tips Every Developer Should Know",
    channel: "CodeMaster",
    thumbnail: "/react-code-on-screen.png",
    likes: 2890,
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    category: "tech",
    duration: "8:15",
    lastWatched: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
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
    lastWatched: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "12",
    title: "Advanced CSS Animations Tutorial",
    channel: "WebDevPro",
    thumbnail: "/css-code-layout-examples.jpg",
    likes: 1890,
    savedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: "tech",
    duration: "12:30",
    lastWatched: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
  },
  {
    id: "15",
    title: "Meditation for Beginners",
    channel: "MindfulMoments",
    thumbnail: "/inspiring-sunrise-landscape.jpg",
    likes: 1234,
    savedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    category: "wellness",
    duration: "15:00",
    lastWatched: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

export default function RevisitPage() {
  const [revisitVideos, setRevisitVideos] = useState(mockRevisitVideos)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    return `${diffInDays} days ago`
  }

  // Sort by oldest saved first (ready for revisit)
  const sortedVideos = [...revisitVideos].sort((a, b) => a.savedAt.getTime() - b.savedAt.getTime())

  const handleRevisitVideo = (videoId: string) => {
    // TODO: Navigate to video in feed or open video player
    console.log("Revisiting video:", videoId)
  }

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
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-accent" />
                <h1 className="text-xl font-space-grotesk font-bold">Ready to Revisit</h1>
              </div>
              <p className="text-sm text-muted-foreground">{sortedVideos.length} videos waiting for you</p>
            </div>
          </div>
        </div>
      </header>

      {/* Revisit Videos */}
      <main className="p-4">
        {sortedVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nothing to revisit yet</h3>
            <p className="text-muted-foreground mb-4">
              Save some videos and come back in a few days to reinforce your learning
            </p>
            <Link href="/feed">
              <Button className="bg-accent hover:bg-accent/90">Explore Videos</Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Motivational Header */}
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl border border-accent/20">
              <Sparkles className="h-8 w-8 text-accent mx-auto mb-3" />
              <h2 className="text-lg font-space-grotesk font-bold mb-2">Time to Reinforce Your Learning!</h2>
              <p className="text-muted-foreground">
                Revisiting content helps strengthen memory and deepen understanding
              </p>
            </div>

            {/* Video List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedVideos.map((video, index) => (
                <Card
                  key={video.id}
                  className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all cursor-pointer group"
                  onClick={() => handleRevisitVideo(video.id)}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${video.thumbnail})` }}
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Play className="h-4 w-4 text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-muted-foreground text-xs mb-3">@{video.channel}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Saved {formatTimeAgo(video.savedAt)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-accent/20 rounded-full h-1">
                            <div className="bg-accent h-1 rounded-full w-3/4"></div>
                          </div>
                          <span className="text-xs text-accent font-medium">Ready!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
