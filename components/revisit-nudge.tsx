"use client"

import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { RotateCcw, Play } from "lucide-react"

interface RevisitNudgeProps {
  video: {
    id: string
    title: string
    channel: string
    thumbnail: string
    savedAt: Date
    duration: string
  }
  onRevisit: () => void
  onDismiss: () => void
}

export function RevisitNudge({ video, onRevisit, onDismiss }: RevisitNudgeProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    return diffInDays
  }

  const daysAgo = formatTimeAgo(video.savedAt)

  return (
    <div className="h-screen w-full snap-start flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="h-8 w-8 text-accent" />
          </div>

          <h3 className="text-lg font-space-grotesk font-bold mb-2">Ready to Revisit?</h3>

          <p className="text-muted-foreground text-sm mb-4">
            You saved this {daysAgo} days ago. Time to reinforce your learning!
          </p>

          {/* Video Preview */}
          <div className="relative w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${video.thumbnail})` }}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {video.duration}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h4>
            <p className="text-muted-foreground text-xs">@{video.channel}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onDismiss} className="flex-1 bg-transparent">
              Skip
            </Button>
            <Button onClick={onRevisit} className="flex-1 bg-accent hover:bg-accent/90">
              <RotateCcw className="h-4 w-4 mr-2" />
              Revisit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
