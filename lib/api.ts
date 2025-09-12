import { authManager } from './auth'

const API_BASE_URL = 'http://localhost:3000/api'

type Company = {
  id: string
  name: string
  email: string
  createdAt: string
}

type Station = {
  id: string
  name: string
  location: string
  companyId: string
  createdAt: string
}

export class ApiClient {
  private baseURL: string

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get access token
    const accessToken = authManager.getAccessToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // If unauthorized, try to refresh token
      if (response.status === 401 && accessToken) {
        const refreshed = await authManager.refreshAccessToken()
        if (refreshed) {
          // Retry the request with new token
          const newConfig: RequestInit = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${refreshed.access_token}`,
            },
          }
          const retryResponse = await fetch(url, newConfig)
          
          if (!retryResponse.ok) {
            if (retryResponse.status === 401) {
              // If still unauthorized, logout
              await authManager.logout()
            }
            throw new Error(`HTTP error! status: ${retryResponse.status}`)
          }
          
          return await retryResponse.json()
        } else {
          // Refresh failed, logout
          await authManager.logout()
          throw new Error('Authentication failed')
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Company API methods
  async getCompanies() {
    return this.request<Company[]>('/company/all')
  }

  async getCompany(id: string) {
    return this.request(`/company/${id}`)
  }

  async createCompany(data: { name: string; email: string }) {
    return this.request('/company', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCompany(id: string, data: { name?: string; email?: string }) {
    return this.request(`/company/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteCompany(id: string) {
    return this.request(`/company/${id}`, {
      method: 'DELETE',
    })
  }

  // Station API methods (assuming similar structure)
  async getStations() {
    return this.request<Station[]>('/station/all')
  }

  async getStation(id: string) {
    return this.request(`/station/${id}`)
  }

  async createStation(data: { name: string; location: string; companyId: string }) {
    return this.request('/station', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStation(id: string, data: { name?: string; location?: string; companyId?: string }) {
    return this.request(`/station/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteStation(id: string) {
    return this.request(`/station/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()