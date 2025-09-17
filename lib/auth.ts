"use client"

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface User {
  id: string
  email: string
  nickname: string
  role: string
}

class AuthManager {
  private refreshTimeout: NodeJS.Timeout | null = null

  // Token storage methods
  setTokens(tokens: AuthTokens) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
      
      // Also set as httpOnly cookies for middleware
      document.cookie = `access_token=${tokens.access_token}; path=/; max-age=${5 * 60}; secure; samesite=strict`
      document.cookie = `refresh_token=${tokens.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    }
    return null
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return null
  }

  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      
      // Clear cookies
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
      this.refreshTimeout = null
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken()
    return !!accessToken
  }

  // Login method
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const tokens: AuthTokens = await response.json()
    this.setTokens(tokens)
    this.scheduleTokenRefresh()
    return tokens
  }

  // Refresh token method
  async refreshAccessToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      this.clearTokens()
      return null
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const tokens: AuthTokens = await response.json()
      this.setTokens(tokens)
      this.scheduleTokenRefresh()
      return tokens
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokens()
      return null
    }
  }

  // Schedule automatic token refresh (4 minutes before expiry)
  scheduleTokenRefresh() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }

    // Schedule refresh 1 minute before expiry (token expires in 5 minutes)
    this.refreshTimeout = setTimeout(() => {
      this.refreshAccessToken()
    }, 4 * 60 * 1000) // 4 minutes
  }

  // Logout method
  async logout() {
    this.clearTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // Initialize auth (call on app start)
  initialize() {
    if (this.isAuthenticated()) {
      this.scheduleTokenRefresh()
    }
  }

  // Get user info from token (basic JWT decode)
  getUserFromToken(): User | null {
    const token = this.getAccessToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id: payload.id,
        email: payload.email,
        nickname: payload.nickname,
        role: payload.role,
      }
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }
}

export const authManager = new AuthManager()