"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play,
  Pause,
  Heart,
  Bookmark,
  Share,
  MessageCircle,
  MoreHorizontal,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Eye,
  Clock,
  TrendingUp,
  User,
  Search,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Brain,
  BookOpen,
  Filter,
  Zap,
  Settings
} from "lucide-react"

// Mock user context for demo
const mockUser = {
  id: "user123",
  username: "learner",
  interests: ["tech", "learning", "motivation", "creativity"]
}

// YouTube API Types
interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    channelTitle: string
    channelId: string
    publishedAt: string
    description: string
    thumbnails: {
      maxres?: { url: string }
      high?: { url: string }
      medium: { url: string }
      default: { url: string }
    }
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  contentDetails: {
    duration: string
  }
  isLiked?: boolean
  isSaved?: boolean
  isSubscribed?: boolean
  category?: string
}

interface YouTubePlayer {
  playVideo: () => void
  pauseVideo: () => void
  destroy: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getVolume: () => number
  setVolume: (volume: number) => void
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
}

interface YouTubePlayerConfig {
  videoId: string
  width?: string | number
  height?: string | number
  playerVars?: {
    autoplay?: 0 | 1
    controls?: 0 | 1
    disablekb?: 0 | 1
    enablejsapi?: 0 | 1
    fs?: 0 | 1
    iv_load_policy?: 1 | 3
    modestbranding?: 0 | 1
    playsinline?: 0 | 1
    rel?: 0 | 1
    showinfo?: 0 | 1
  }
  events?: {
    onReady?: (event: any) => void
    onStateChange?: (event: any) => void
  }
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string | HTMLElement, config: YouTubePlayerConfig) => YouTubePlayer
      PlayerState: {
        ENDED: 0
        PLAYING: 1
        PAUSED: 2
        BUFFERING: 3
        CUED: 5
      }
      ready: (callback: () => void) => void
    }
    onYouTubeIframeAPIReady: () => void
  }
}

// Enhanced Header Component
const Header = ({ onAINewsClick, onProfileClick }: { 
  onAINewsClick: () => void
  onProfileClick: () => void 
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/25"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Glintly
            </h1>
            <p className="text-xs text-purple-300/70 font-medium">Learn & Grow</p>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
            <input
              type="text"
              placeholder="Search educational content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 pl-12 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAINewsClick}
            className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
          >
            <Zap className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-purple-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-300 hover:text-white hover:border-purple-400 transition-all duration-300"
          >
            <Settings className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onProfileClick}
            className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <User className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}

// YouTube Player Component
const YouTubePlayer = ({ 
  videoId, 
  isActive, 
  onReady, 
  onStateChange,
  className = ""
}: {
  videoId: string
  isActive: boolean
  onReady?: (event: any) => void
  onStateChange?: (event: any) => void
  className?: string
}) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const ytPlayerRef = useRef<YouTubePlayer | null>(null)

  useEffect(() => {
    if (!playerRef.current || typeof window === 'undefined' || !window.YT) return

    ytPlayerRef.current = new window.YT.Player(playerRef.current, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: isActive ? 1 : 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: onReady,
        onStateChange: onStateChange,
      },
    })

    return () => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        ytPlayerRef.current.destroy()
      }
    }
  }, [videoId])

  useEffect(() => {
    if (ytPlayerRef.current) {
      try {
        if (isActive) {
          ytPlayerRef.current.playVideo()
        } else {
          ytPlayerRef.current.pauseVideo()
        }
      } catch (error) {
        console.log('YouTube player not ready yet')
      }
    }
  }, [isActive])

  return <div ref={playerRef} className={className} />
}

// Video Player Component
const VideoPlayer = ({ 
  video, 
  isActive, 
  onLike, 
  onSave, 
  onShare, 
  onComment,
  onSubscribe
}: {
  video: YouTubeVideo
  isActive: boolean
  onLike: () => void
  onSave: () => void
  onShare: () => void
  onComment: () => void
  onSubscribe: () => void
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const formatNumber = (num: string) => {
    const number = parseInt(num || '0')
    if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M'
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K'
    return number.toString()
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = (match?.[1] || '').replace('H', '')
    const minutes = (match?.[2] || '').replace('M', '')
    const seconds = (match?.[3] || '').replace('S', '')
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`
  }

  const getCategoryColor = (category?: string) => {
    const colors = {
      'tech': 'from-purple-500 to-blue-500',
      'learning': 'from-blue-500 to-cyan-500',
      'motivation': 'from-green-500 to-emerald-500',
      'creativity': 'from-pink-500 to-rose-500',
      'career': 'from-indigo-500 to-purple-500',
      'fitness': 'from-red-500 to-orange-500',
      'default': 'from-purple-500 to-pink-500'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  const handlePlayerReady = (event: any) => {
    if (isActive) {
      event.target.playVideo()
      setIsPlaying(true)
    }
  }

  const handleStateChange = (event: any) => {
    setIsPlaying(event.data === 1)
  }

  return (
    <div 
      className="h-screen w-full snap-start relative bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950 overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* YouTube Player Background */}
      <div className="absolute inset-0">
        <YouTubePlayer
          videoId={video.id}
          isActive={isActive}
          onReady={handlePlayerReady}
          onStateChange={handleStateChange}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />
      </div>

      {/* Educational Badge */}
      <div className="absolute top-6 left-6 z-30">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-full">
          <BookOpen className="w-4 h-4 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Educational</span>
        </div>
      </div>

      {/* Side Panel */}
      <div className="absolute right-0 top-0 h-full w-20 flex flex-col items-center justify-end pb-8 space-y-6 bg-gradient-to-l from-black/50 to-transparent">
        {/* Channel Avatar */}
        <motion.div 
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubscribe}
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(video.category)} flex items-center justify-center shadow-xl border-2 border-white/20`}>
            <span className="text-white font-bold text-lg">
              {video.snippet.channelTitle.charAt(0)}
            </span>
          </div>
          <motion.div 
            className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-white text-xs font-bold">+</span>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-5">
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className="group flex flex-col items-center"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              video.isLiked 
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-2 border-pink-400' 
                : 'bg-black/60 backdrop-blur-sm text-white hover:bg-pink-500/20 border-2 border-white/20 hover:border-pink-500/40'
            }`}>
              <Heart className={`w-6 h-6 ${video.isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-white text-xs mt-2 font-semibold">
              {formatNumber(video.statistics.likeCount)}
            </span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onComment}
            className="group flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-white hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-white text-xs mt-2 font-semibold">
              {formatNumber(video.statistics.commentCount)}
            </span>
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="group flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-white hover:bg-green-500/20 hover:border-green-500/40 transition-all duration-300 shadow-lg">
              <Share className="w-6 h-6" />
            </div>
            <span className="text-white text-xs mt-2 font-semibold">Share</span>
          </motion.button>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
            className="group flex flex-col items-center"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              video.isSaved 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-2 border-yellow-400' 
                : 'bg-black/60 backdrop-blur-sm text-white hover:bg-yellow-500/20 border-2 border-white/20 hover:border-yellow-500/40'
            }`}>
              <Bookmark className={`w-6 h-6 ${video.isSaved ? 'fill-current' : ''}`} />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Bottom Content Panel */}
      <div className="absolute bottom-0 left-0 right-24 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="space-y-4">
          {/* Channel Info */}
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(video.category)} flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-sm">
                {video.snippet.channelTitle.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">{video.snippet.channelTitle}</h3>
              <div className="flex items-center space-x-3 text-white/70 text-sm">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(video.statistics.viewCount)} views</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title */}
          <div className="space-y-3">
            <h2 className="text-white text-xl font-bold leading-tight line-clamp-2">
              {video.snippet.title}
            </h2>
            
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {formatDuration(video.contentDetails.duration)}
                </span>
              </div>
              
              {video.category && (
                <div className={`inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r ${getCategoryColor(video.category)}/20 backdrop-blur-sm border border-purple-500/30 rounded-full`}>
                  <Brain className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 text-sm font-medium capitalize">{video.category}</span>
                </div>
              )}
              
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex items-center space-x-4 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-black/80"
              >
                <SkipBack className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-black/80"
              >
                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-black/80"
              >
                <SkipForward className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controls */}
      <div className="absolute top-6 right-24 flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  )
}

// Navigation Button Component
const NavButton = ({ 
  direction, 
  onClick, 
  visible 
}: { 
  direction: 'up' | 'down'
  onClick: () => void
  visible: boolean
}) => {
  const Icon = direction === 'up' ? ChevronUp : ChevronDown
  const positionClass = direction === 'up' ? 'top-1/3' : 'bottom-1/3'

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.9)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={`fixed right-6 ${positionClass} -translate-y-1/2 z-30 w-14 h-14 bg-black/70 backdrop-blur-md border border-purple-500/20 rounded-2xl flex items-center justify-center text-white hover:border-purple-400/40 transition-all duration-300 shadow-2xl`}
        >
          <Icon className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Progress Bar Component
const VideoProgressBar = ({ 
  totalVideos, 
  currentIndex 
}: { 
  totalVideos: number
  currentIndex: number
}) => {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30">
      <div className="relative">
        <div className="w-1 h-40 bg-white/10 rounded-full backdrop-blur-sm">
          <motion.div
            className="w-full bg-gradient-to-b from-purple-500 via-pink-500 to-purple-600 rounded-full origin-top shadow-lg"
            style={{ height: `${((currentIndex + 1) / totalVideos) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        
        <motion.div
          className="absolute -left-2 w-5 h-5 bg-white rounded-full shadow-xl border-2 border-purple-500"
          style={{ top: `${(currentIndex / Math.max(totalVideos - 1, 1)) * 160 - 10}px` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          animate={{ scale: [1, 1.1, 1] }}
        />
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xs text-white/70 font-semibold bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full border border-purple-500/20">
          {currentIndex + 1}/{totalVideos}
        </div>
      </div>
    </div>
  )
}

// Loading Component
const LoadingScreen = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
      <div className="relative mb-8">
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 25px 50px -12px rgba(168, 85, 247, 0.25)",
              "0 25px 50px -12px rgba(168, 85, 247, 0.4)",
              "0 25px 50px -12px rgba(168, 85, 247, 0.25)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-12 w-12 text-white" />
        </motion.div>
      </div>
      
      <div className="flex space-x-2 mb-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-purple-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.5, 1, 0.5],
              backgroundColor: ["#a855f7", "#ec4899", "#a855f7"]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.3,
              ease: "easeInOut" 
            }}
          />
        ))}
      </div>
      
      <p className="text-slate-300 font-medium text-xl tracking-wide">{text}</p>
      <p className="text-slate-500 text-sm mt-2">Personalized Learning Experience</p>
    </div>
  )
}

// Main Feed Component
export default function GlintlyFeed() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showNavButtons, setShowNavButtons] = useState(false)
  const [nextPageToken, setNextPageToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(mockUser.interests)
  const containerRef = useRef<HTMLDivElement>(null)

  // YouTube API configuration - Replace with your actual API key
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  const YOUTUBE_API_BASE_URL = process.env.NEXT_PUBLIC_YOUTUBE_API_URL

  // Interest-based search terms for educational content
  const getSearchTermsForInterests = (interests: string[]) => {
    const interestMap = {
      'tech': ['programming tutorial', 'web development', 'machine learning explained', 'coding bootcamp'],
      'learning': ['study techniques', 'learning methods', 'how to learn faster', 'memory techniques'],
      'motivation': ['motivation speech', 'success mindset', 'productivity tips', 'goal setting'],
      'cooking': ['cooking tutorial', 'healthy recipes', 'culinary techniques', 'chef tips'],
      'finance': ['personal finance', 'investing basics', 'budgeting tips', 'financial literacy'],
      'wellness': ['mental health', 'mindfulness meditation', 'stress management', 'self care'],
      'fitness': ['workout routine', 'exercise tutorial', 'fitness tips', 'health advice'],
      'career': ['career advice', 'job interview tips', 'professional development', 'leadership skills'],
      'creativity': ['design tutorial', 'creative process', 'art techniques', 'innovation methods'],
      'self-improvement': ['personal development', 'life skills', 'habit formation', 'self growth']
    }

    const searchTerms: string[] = []
    interests.forEach(interest => {
      const terms = interestMap[interest as keyof typeof interestMap]
      if (terms) {
        searchTerms.push(...terms)
      }
    })

    return searchTerms.length > 0 ? searchTerms : ['educational content', 'tutorial', 'how to learn']
  }

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeAPI = (): Promise<void> => {
      if (typeof window !== 'undefined' && window.YT) {
        return Promise.resolve()
      }
      
      return new Promise((resolve) => {
        if (typeof window === 'undefined') return
        
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.onload = () => resolve()
        document.head.appendChild(script)
        
        window.onYouTubeIframeAPIReady = () => resolve()
      })
    }

    loadYouTubeAPI().then(() => {
      fetchEducationalVideos()
    })
  }, [selectedInterests])

  // Fetch educational videos based on user interests
  const fetchEducationalVideos = async (pageToken = '') => {
    try {
      setIsLoading(true)
      setError(null)

      const searchTerms = getSearchTermsForInterests(selectedInterests)
      const randomSearchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]

      // Search for educational videos based on interests
      const searchResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(randomSearchTerm + ' tutorial educational')}&` +
        `type=video&` +
        `videoDuration=medium&` +
        `videoDefinition=high&` +
        `maxResults=10&` +
        `pageToken=${pageToken}&` +
        `key=${YOUTUBE_API_KEY}`
      )

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json()
        throw new Error(errorData.error?.message || 'Failed to search videos')
      }

      const searchData = await searchResponse.json()
      
      if (!searchData.items || searchData.items.length === 0) {
        throw new Error('No educational videos found')
      }

      // Get video IDs for detailed information
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')
      
      // Fetch detailed video information
      const detailsResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/videos?` +
        `part=snippet,statistics,contentDetails&` +
        `id=${videoIds}&` +
        `key=${YOUTUBE_API_KEY}`
      )

      if (!detailsResponse.ok) {
        const errorData = await detailsResponse.json()
        throw new Error(errorData.error?.message || 'Failed to fetch video details')
      }

      const detailsData = await detailsResponse.json()

      // Categorize videos based on user interests
      const categorizeVideo = (title: string, description: string) => {
        const content = (title + ' ' + description).toLowerCase()
        
        for (const interest of selectedInterests) {
          const keywords = {
            'tech': ['programming', 'coding', 'software', 'development', 'computer', 'technology'],
            'learning': ['study', 'learn', 'education', 'tutorial', 'course', 'lesson'],
            'motivation': ['motivation', 'inspiration', 'success', 'mindset', 'productivity'],
            'cooking': ['cooking', 'recipe', 'chef', 'culinary', 'food', 'kitchen'],
            'finance': ['finance', 'money', 'investing', 'business', 'economics', 'budget'],
            'wellness': ['wellness', 'health', 'meditation', 'mindfulness', 'mental health'],
            'fitness': ['fitness', 'workout', 'exercise', 'training', 'gym', 'health'],
            'career': ['career', 'job', 'professional', 'leadership', 'work', 'business'],
            'creativity': ['design', 'art', 'creative', 'drawing', 'innovation', 'artistic'],
            'self-improvement': ['improvement', 'development', 'growth', 'habits', 'skills']
          }
          
          const interestKeywords = keywords[interest as keyof typeof keywords] || []
          if (interestKeywords.some(keyword => content.includes(keyword))) {
            return interest
          }
        }
        
        return 'learning' // default category
      }

      const videosWithState = detailsData.items.map((video: any) => ({
        ...video,
        isLiked: false,
        isSaved: false,
        isSubscribed: false,
        category: categorizeVideo(video.snippet.title, video.snippet.description)
      }))

      if (pageToken) {
        setVideos(prev => [...prev, ...videosWithState])
      } else {
        setVideos(videosWithState)
      }

      setNextPageToken(searchData.nextPageToken || '')
    } catch (err) {
      console.error('Error fetching educational videos:', err)
      setError(err instanceof Error ? err.message : 'Failed to load educational videos')
    } finally {
      setIsLoading(false)
    }
  }

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

  // Navigate to specific video
  const scrollToVideo = (index: number) => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const videoHeight = container.clientHeight
    container.scrollTo({
      top: index * videoHeight,
      behavior: 'smooth'
    })
  }

  // Navigation functions
  const goToPrevious = () => {
    if (currentVideoIndex > 0) {
      scrollToVideo(currentVideoIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      scrollToVideo(currentVideoIndex + 1)
    }
  }

  // Load more videos when near the end
  useEffect(() => {
    if (currentVideoIndex >= videos.length - 3 && nextPageToken && !isLoading) {
      fetchEducationalVideos(nextPageToken)
    }
  }, [currentVideoIndex, nextPageToken, isLoading])

  // Handle video interactions
  const handleLike = (videoId: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              statistics: {
                ...video.statistics,
                likeCount: video.isLiked 
                  ? (parseInt(video.statistics.likeCount) - 1).toString()
                  : (parseInt(video.statistics.likeCount) + 1).toString()
              }
            }
          : video
      )
    )
  }

  const handleSave = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, isSaved: !video.isSaved } : video
      )
    )
  }

  const handleSubscribe = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, isSubscribed: !video.isSubscribed } : video
      )
    )
  }

  const handleShare = (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    if (video) {
      const shareUrl = `https://www.youtube.com/watch?v=${videoId}`
      
      if (navigator.share) {
        navigator.share({
          title: video.snippet.title,
          text: `Check out this educational video: ${video.snippet.title}`,
          url: shareUrl,
        })
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Video link copied to clipboard!')
        })
      }
    }
  }

  const handleComment = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  const handleAINews = () => {
    alert('AI News feature coming soon! Stay tuned for the latest in AI and technology.')
  }

  const handleProfile = () => {
    alert('Profile settings coming soon! Here you can manage your learning preferences.')
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentVideoIndex])

  // Error state
  if (error && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Unable to load educational content</h2>
          <p className="text-slate-400 max-w-md">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchEducationalVideos()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold transition-colors shadow-lg"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  // Loading state for videos
  if (isLoading && videos.length === 0) {
    return <LoadingScreen text="Curating educational content for you..." />
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <Header onAINewsClick={handleAINews} onProfileClick={handleProfile} />

      {/* Main Feed Container */}
      <div 
        className="relative h-screen overflow-hidden"
        onMouseEnter={() => setShowNavButtons(true)}
        onMouseLeave={() => setShowNavButtons(false)}
      >
        {/* Vertical Scroll Container */}
        <motion.div
          ref={containerRef}
          className="h-full overflow-y-scroll overflow-x-hidden scrollbar-hide snap-y snap-mandatory"
          onScroll={handleScroll}
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none"
          }}
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
                  delay: index * 0.05,
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
                  onSubscribe={() => handleSubscribe(video.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading more videos indicator */}
          <AnimatePresence>
            {isLoading && videos.length > 0 && (
              <motion.div
                className="h-screen w-full snap-start flex items-center justify-center bg-gradient-to-br from-slate-950 to-purple-950/20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-4">
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 bg-purple-500 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1], 
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.3,
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 font-medium">Loading more educational content...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <NavButton
          direction="up"
          onClick={goToPrevious}
          visible={showNavButtons && currentVideoIndex > 0}
        />
        <NavButton
          direction="down"
          onClick={goToNext}
          visible={showNavButtons && currentVideoIndex < videos.length - 1}
        />

        {/* Progress Bar */}
        {videos.length > 0 && (
          <VideoProgressBar
            totalVideos={videos.length}
            currentIndex={currentVideoIndex}
          />
        )}
      </div>

      {/* Global CSS for hiding scrollbars */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}