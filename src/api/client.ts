// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

// Base API configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // For cookie-based auth
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log requests in development
        if (import.meta.env.DEV) {
          console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }

        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log responses in development
        if (import.meta.env.DEV) {
          console.log(`API Response: ${response.status}`, response.data)
        }

        return response
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - clear auth
          localStorage.removeItem('auth_token')
          // Don't redirect in development to avoid disrupting the demo
          if (import.meta.env.PROD) {
            window.location.href = '/login'
          }
        }

        console.error('Response error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  // Generic request method
  private async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config)
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.message ||
                          'An unexpected error occurred'

      return {
        error: errorMessage,
        status: error.response?.status || 500,
      }
    }
  }

  // HTTP methods
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

  // File upload
  async upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Update base URL
  setBaseURL(baseURL: string) {
    this.client.defaults.baseURL = baseURL
  }

  // Set auth token
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token)
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  // Clear auth token
  clearAuthToken() {
    localStorage.removeItem('auth_token')
    delete this.client.defaults.headers.common.Authorization
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()
export default apiClient
