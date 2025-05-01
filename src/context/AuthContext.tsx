"use client"

import type React from "react"
import { createContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import type { UserSignupDto, UserLoginDto } from "../types/auth"
import type { User } from "../types/user"
import { authService } from "../services/authService"
import { userService } from "../services/userService"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: UserLoginDto) => Promise<void>
  register: (data: UserSignupDto) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await userService.getProfile()
          // Handle both possible response formats
          const userData = response.data || response
          setUser(userData)
        } catch (error) {
          console.error("Failed to fetch user profile:", error)
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (data: UserLoginDto) => {
    try {
      setIsLoading(true)
      const response = await authService.login(data)
      console.log("Login successful, response:", response)
      
      localStorage.setItem("token", response.token)
      setUser(response.user)
      toast.success("Login successful!")
    } catch (error) {
      console.error("Login failed:", error)
      toast.error(error instanceof Error ? error.message : "Login failed. Please check your credentials.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const register = async (data: UserSignupDto) => {
    try {
      setIsLoading(true)
      
      console.log("Registering with data:", data)
      const response = await authService.register(data)
      console.log("Registration successful, response:", response)
      
      localStorage.setItem("token", response.token)
      setUser(response.user)
      toast.success("Registration successful!")
    } catch (error: any) {
      console.error("Registration failed:", error)
      toast.error(error.message || "Registration failed. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.info("You have been logged out")
  }

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}