"use client"

import { useState, useEffect, useRef } from "react"
import { VideoPlayer } from "@/components/video-player"
import { Header } from "@/components/header"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/firebase-auth-provider"
import { useRouter } from "next/navigation"

// Mock video data - in real app this would come from API
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
  },
]

export default function FeedPage() {
  const [videos, setVideos] = useState(mockVideos)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, isLoading: userLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/login")
      return
    }
  }, [isAuthenticated, user, userLoading, router])

  // Handle scroll to change videos
  const handleScroll = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const videoHeight = container.clientHeight
    const newIndex = Math.round(scrollTop / videoHeight)

    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex)
    }
  }

  // Load more videos when near the end
  const loadMoreVideos = () => {
    if (isLoading) return
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newVideos = mockVideos.map((video, index) => ({
        ...video,
        id: `${video.id}-${videos.length + index}`,
      }))
      setVideos((prev) => [...prev, ...newVideos])
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    // Load more videos when approaching the end
    if (currentVideoIndex >= videos.length - 2) {
      loadMoreVideos()
    }
  }, [currentVideoIndex])

  const handleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video,
      ),
    )
  }

  const handleSave = (videoId: string) => {
    setVideos((prev) => prev.map((video) => (video.id === videoId ? { ...video, isSaved: !video.isSaved } : video)))
  }

  const handleShare = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId)
    if (video) {
      if (navigator.share) {
        navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        // TODO: Show toast notification
        alert("Link copied to clipboard!")
      }
    }
  }

  const handleComment = (videoId: string) => {
    // TODO: Open comment drawer
    console.log("Opening comments for video:", videoId)
  }

  if (userLoading || !isAuthenticated || !user) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading your personalized feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Header />

      <motion.div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="h-screen w-full snap-start relative flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <VideoPlayer
                video={video}
                isActive={index === currentVideoIndex}
                onLike={() => handleLike(video.id)}
                onSave={() => handleSave(video.id)}
                onShare={() => handleShare(video.id)}
                onComment={() => handleComment(video.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="h-screen w-full snap-start flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Loading more videos...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
