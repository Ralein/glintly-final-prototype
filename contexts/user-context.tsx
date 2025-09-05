"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  bio?: string
  interests: string[]
  setupComplete: boolean
  createdAt: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (userData: Partial<User>) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("glintly_user")
        const authToken = localStorage.getItem("glintly_auth_token")

        if (storedUser && authToken) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error)
        // Clear corrupted data
        localStorage.removeItem("glintly_user")
        localStorage.removeItem("glintly_auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || `user_${Date.now()}`,
      username: userData.username || "",
      email: userData.email || "",
      bio: userData.bio || "",
      interests: userData.interests || [],
      setupComplete: userData.setupComplete || false,
      createdAt: userData.createdAt || new Date().toISOString(),
    }

    setUser(newUser)

    // Store in localStorage
    localStorage.setItem("glintly_user", JSON.stringify(newUser))
    localStorage.setItem("glintly_auth_token", `token_${Date.now()}`)

    // Store session info
    sessionStorage.setItem("glintly_session", "active")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("glintly_user")
    localStorage.removeItem("glintly_auth_token")
    sessionStorage.removeItem("glintly_session")
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("glintly_user", JSON.stringify(updatedUser))
  }

  const value: UserContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
