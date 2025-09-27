// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

// Base API configuration - Updated to match Django backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // For cookie-based auth with Django
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available (JWT from localStorage or cookies)
        const token = localStorage.getItem('access_token') || this.getCookie('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add CSRF token for Django (if needed for certain operations)
        const csrfToken = this.getCookie('csrftoken')
        if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
          config.headers['X-CSRFToken'] = csrfToken
        }

        // Log requests in development
        if (import.meta.env.DEV) {
          console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
            headers: config.headers
          })
        }

        return config
      },
      (error) => {
        console.error('❌ Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log responses in development
        if (import.meta.env.DEV) {
          console.log(`🟢 API Response: ${response.status}`, {
            url: response.config.url,
            data: response.data,
            headers: response.headers
          })
        }

        return response
      },
      (error) => {
        // Enhanced error handling for Django REST Framework responses
        if (error.response) {
          const status = error.response.status
          const data = error.response.data

          // Handle different types of Django/DRF errors
          switch (status) {
            case 400:
              console.error('❌ Bad Request:', data)
              break
            case 401:
              console.error('❌ Unauthorized - clearing auth tokens')
              this.clearAuthTokens()
              // Only redirect to login in production to avoid disrupting development
              if (import.meta.env.PROD) {
                window.location.href = '/login'
              }
              break
            case 403:
              console.error('❌ Forbidden:', data)
              break
            case 404:
              console.error('❌ Not Found:', error.config?.url)
              break
            case 429:
              console.error('❌ Rate Limited:', data)
              break
            case 500:
              console.error('❌ Server Error:', data)
              break
            default:
              console.error(`❌ HTTP ${status} Error:`, data)
          }

          // Log full error details in development
          if (import.meta.env.DEV) {
            console.error('Full error details:', {
              status,
              statusText: error.response.statusText,
              data,
              config: error.config,
              headers: error.response.headers
            })
          }
        } else if (error.request) {
          console.error('❌ Network Error - No response received:', error.request)
        } else {
          console.error('❌ Request Setup Error:', error.message)
        }

        return Promise.reject(error)
      }
    )
  }

  // Helper method to get cookies (for CSRF and auth tokens)
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  // Generic request method with enhanced error handling
  private async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config)

      // Return consistent API response format
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error: any) {
      // Enhanced error message extraction for Django/DRF
      let errorMessage = 'An unexpected error occurred'
      let errorDetails = null

      if (error.response?.data) {
        const data = error.response.data

        // Handle Django REST Framework error formats
        if (typeof data === 'string') {
          errorMessage = data
        } else if (data.detail) {
          // DRF standard error format
          errorMessage = data.detail
        } else if (data.error) {
          // Custom error format
          errorMessage = data.error
        } else if (data.message) {
          // Custom message format
          errorMessage = data.message
        } else if (data.non_field_errors) {
          // DRF validation errors
          errorMessage = Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(', ')
            : data.non_field_errors
        } else if (typeof data === 'object') {
          // Field-specific validation errors
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`
              }
              return `${field}: ${errors}`
            })
            .join('; ')

          if (fieldErrors) {
            errorMessage = fieldErrors
            errorDetails = data
          }
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        error: errorMessage,
        status: error.response?.status || 500,
        data: errorDetails as T
      }
    }
  }

  // HTTP methods with proper typing
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    })
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    })
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    })
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    })
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    })
  }

  // File upload with proper FormData handling
  async upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase timeout for file uploads
      timeout: 60000,
    })
  }

  // Authentication methods for Django JWT
  async login(credentials: { username: string; password: string }): Promise<ApiResponse<any>> {
    const response = await this.post('/api/token/', credentials)

    if (response.data?.access) {
      this.setAuthTokens(response.data.access, response.data.refresh)
    }

    return response
  }

  async refreshToken(): Promise<ApiResponse<any>> {
    const refreshToken = localStorage.getItem('refresh_token') || this.getCookie('refresh_token')

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await this.post('/api/token/refresh/', { refresh: refreshToken })

    if (response.data?.access) {
      this.setAuthToken(response.data.access)
    }

    return response
  }

  async logout(): Promise<void> {
    // If you have a logout endpoint that blacklists tokens
    try {
      await this.post('/api/auth/logout/')
    } catch (error) {
      console.warn('Logout endpoint not available or failed:', error)
    }

    this.clearAuthTokens()
  }

  // Token management methods
  setAuthTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }

    // Also set as default header
    this.client.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  setAuthToken(token: string): void {
    localStorage.setItem('access_token', token)
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  clearAuthTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    delete this.client.defaults.headers.common.Authorization

    // Clear cookies if they exist
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token') || this.getCookie('access_token')
    return !!token
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem('access_token') || this.getCookie('access_token')
  }

  // Update base URL if needed
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL
  }

  // Get current base URL
  getBaseURL(): string {
    return this.client.defaults.baseURL || BASE_URL
  }

  // Health check method
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get('/health/')
  }

  // Method to handle API versioning
  async getApiInfo(): Promise<ApiResponse<any>> {
    return this.get('/api/system-info/')
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

// Auto-refresh token on 401 errors
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

// Add response interceptor for automatic token refresh
apiClient['client'].interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient['client'](originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await apiClient.refreshToken()
        const newToken = refreshResponse.data?.access

        if (newToken) {
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient['client'](originalRequest)
        } else {
          processQueue(error, null)
          apiClient.clearAuthTokens()
          return Promise.reject(error)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        apiClient.clearAuthTokens()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
