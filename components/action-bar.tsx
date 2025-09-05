"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Heart, Bookmark, Share, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Video {
  id: string
  title: string
  channel: string
  videoUrl: string
  thumbnail: string
  likes: number
  isLiked: boolean
  isSaved: boolean
  category: string
}

interface ActionBarProps {
  video: Video
  onLike: () => void
  onSave: () => void
  onShare: () => void
  onComment: () => void
}

export function ActionBar({ video, onLike, onSave, onShare, onComment }: ActionBarProps) {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [isSaveAnimating, setIsSaveAnimating] = useState(false)

  const handleLike = () => {
    setIsLikeAnimating(true)
    onLike()
    setTimeout(() => setIsLikeAnimating(false), 600)
  }

  const handleSave = () => {
    setIsSaveAnimating(true)
    onSave()
    setTimeout(() => setIsSaveAnimating(false), 600)
  }

  const formatLikes = (likes: number) => {
    if (likes >= 1000000) {
      return `${(likes / 1000000).toFixed(1)}M`
    } else if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`
    }
    return likes.toString()
  }

  return (
    <motion.div
      className="absolute right-4 bottom-20 flex flex-col gap-4"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <motion.div
          animate={
            isLikeAnimating
              ? {
                  scale: [1, 1.4, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }
              : {}
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={`action-button transition-all duration-200 ${
              video.isLiked ? "text-red-500 bg-red-500/10" : "text-white hover:bg-white/10"
            }`}
            onClick={handleLike}
          >
            <motion.div animate={video.isLiked ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart className={`h-6 w-6 ${video.isLiked ? "fill-current" : ""}`} />
            </motion.div>
          </Button>
        </motion.div>

        <motion.span
          className="text-white text-xs mt-1 font-medium"
          key={video.likes}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatLikes(video.likes)}
        </motion.span>

        <AnimatePresence>
          {isLikeAnimating && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <motion.div
          animate={
            isSaveAnimating
              ? {
                  scale: [1, 1.3, 1],
                  rotateY: [0, 180, 360],
                }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={`action-button transition-all duration-200 ${
              video.isSaved ? "text-accent bg-accent/10" : "text-white hover:bg-white/10"
            }`}
            onClick={handleSave}
          >
            <Bookmark className={`h-6 w-6 ${video.isSaved ? "fill-current" : ""}`} />
          </Button>
        </motion.div>
        <span className="text-white text-xs mt-1 font-medium">Save</span>
      </motion.div>

      <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          className="action-button text-white hover:bg-white/10 transition-all duration-200"
          onClick={onShare}
        >
          <Share className="h-6 w-6" />
        </Button>
        <span className="text-white text-xs mt-1 font-medium">Share</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center"
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="action-button text-white hover:bg-white/10 transition-all duration-200"
          onClick={onComment}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <span className="text-white text-xs mt-1 font-medium">Comment</span>
      </motion.div>
    </motion.div>
  )
}
