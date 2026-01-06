import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosError,
} from "axios"
import { getSession } from "next-auth/react"

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token from NextAuth session
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    console.log("DDDDDDDDDD", session)
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    if (config.data instanceof FormData) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.delete("Content-Type")
      } else if (config.headers) {
        delete (config.headers as Record<string, string>)["Content-Type"]
        delete (config.headers as Record<string, string>)["content-type"]
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
