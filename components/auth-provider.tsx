"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authManager, User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth manager
    authManager.initialize()
    
    // Get user from token
    const currentUser = authManager.getUserFromToken()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const logout = async () => {
    await authManager.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}