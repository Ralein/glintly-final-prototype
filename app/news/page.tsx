"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Newspaper, Filter, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface NewsPost {
  id: string
  title: string
  content: string
  category: string
  author: string
  publishedAt: string
  cardHtml: string
}

interface NewsResponse {
  posts: NewsPost[]
  total: number
  categories: string[]
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const url = selectedCategory === "all" ? "/api/news" : `/api/news?category=${selectedCategory}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: NewsResponse = await response.json()
      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts)
        setCategories(data.categories || [])
        setCurrentIndex(0)
      } else {
        console.error("Invalid data structure received:", data)
        setPosts([])
        setCategories([])
      }
    } catch (error) {
      console.error("Failed to fetch news:", error)
      setPosts([])
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const nextPost = () => {
    if (posts.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % posts.length)
    }
  }

  const prevPost = () => {
    if (posts.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
    }
  }

  const goToPost = (index: number) => {
    if (index >= 0 && index < posts.length) {
      setCurrentIndex(index)
    }
  }

  const currentPost = posts[currentIndex]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading latest news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-space-grotesk font-bold text-xl">AI News</h1>
                <p className="text-sm text-muted-foreground">Stay updated with the latest</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="flex-shrink-0"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* News Carousel */}
        {posts.length > 0 && currentPost && (
          <div className="max-w-md mx-auto">
            {/* Main Card Display */}
            <div className="relative mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-square"
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0 h-full">
                      <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: currentPost.cardHtml || "" }} />
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {posts.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPost}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPost}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Post Indicators */}
            {posts.length > 1 && (
              <div className="flex justify-center gap-2 mb-6">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPost(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex ? "bg-accent w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Post Details */}
            <motion.div
              key={`details-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center space-y-3"
            >
              <h2 className="font-space-grotesk font-bold text-xl">{currentPost.title || "Untitled"}</h2>
              <p className="text-muted-foreground leading-relaxed">{currentPost.content || "No content available"}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>By {currentPost.author || "Unknown"}</span>
                <span>•</span>
                <span>
                  {currentPost.publishedAt ? new Date(currentPost.publishedAt).toLocaleDateString() : "No date"}
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No news available</h3>
            <p className="text-muted-foreground">
              {selectedCategory === "all"
                ? "Check back later for the latest updates"
                : `No news found in ${selectedCategory} category`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
