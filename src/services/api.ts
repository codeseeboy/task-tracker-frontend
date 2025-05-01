import axios from "axios"
import { toast } from "react-toastify"

const API_URL = "https://task-tracker-rzm0.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Define a type for MongoDB documents with _id
interface MongoDocument {
  _id: string;
  __v?: number;
  [key: string]: any;
}

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Transform the data to convert _id to id
    const transformData = (data: any): any => {
      if (!data) return data

      // If it's an array, map through each item
      if (Array.isArray(data)) {
        return data.map((item) => transformData(item))
      }

      // If it's an object with _id, transform it
      if (data && typeof data === "object" && "_id" in data) {
        const { _id, __v, ...rest } = data as MongoDocument
        return { id: _id, ...rest }
      }

      return data
    }

    return transformData(response.data)
  },
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong"

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
        toast.error("Your session has expired. Please log in again.")
      }
    }

    return Promise.reject(message)
  },
)

export default api