"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Search, User, Menu, Newspaper } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function Header() {
  const [activeTab, setActiveTab] = useState("For You")

  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between p-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-colors">
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>

        <div className="flex items-center gap-6">
          {["Following", "For You"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/news">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-colors">
                <Newspaper className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-colors">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-colors">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
