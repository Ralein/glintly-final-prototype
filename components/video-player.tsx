"use client"

import { useState, useRef, useEffect } from "react"
import { ActionBar } from "./action-bar"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "./ui/button"
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

interface VideoPlayerProps {
  video: Video
  isActive: boolean
  onLike: () => void
  onSave: () => void
  onShare: () => void
  onComment: () => void
}

export function VideoPlayer({ video, isActive, onLike, onSave, onShare, onComment }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true)
      setShowControls(false)
    } else {
      setIsPlaying(false)
    }
  }, [isActive])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVideoClick = () => {
    togglePlay()
    setShowControls(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="w-full h-full bg-cover bg-center cursor-pointer relative overflow-hidden"
        style={{ backgroundImage: `url(${video.thumbnail})` }}
        onClick={handleVideoClick}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  key={isPlaying ? "pause" : "play"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10 text-white" />
                  ) : (
                    <Play className="h-10 w-10 text-white ml-1" />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="absolute top-4 right-4" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="action-button transition-all duration-200 hover:bg-black/40"
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
          >
            <motion.div
              key={isMuted ? "muted" : "unmuted"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="text-white">
            <motion.h3
              className="font-semibold text-lg mb-1 leading-tight text-balance"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {video.title}
            </motion.h3>
            <motion.p
              className="text-gray-200 text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              @{video.channel}
            </motion.p>
          </div>
        </motion.div>

        <ActionBar video={video} onLike={onLike} onSave={onSave} onShare={onShare} onComment={onComment} />
      </motion.div>
    </motion.div>
  )
}
