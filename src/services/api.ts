
import axios from "axios"
import { toast } from "react-toastify"
import { decryptUserFields } from "../utils/crypto.util"

// Only use REACT_APP_ variables in frontend
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send HTTP-only cookies with every request
})

// Request interceptor — token is now sent via HTTP-only cookie automatically.
// Keep Authorization header as fallback for backward compatibility.
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

      // If it's an object with _id, transform it (a MongoDB document)
      if (data && typeof data === "object" && "_id" in data) {
        const { _id, __v, ...rest } = data as MongoDocument
        const transformed = { id: _id, ...rest }
        // Decrypt encrypted user fields if present (email)
        if ("email" in transformed) {
          return decryptUserFields(transformed)
        }
        return transformed
      }

      // If it's a plain object (e.g. paginated response), recurse into its properties
      if (data && typeof data === "object" && !("_id" in data)) {
        const result: any = {}
        for (const key of Object.keys(data)) {
          result[key] = transformData(data[key])
        }
        return result
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