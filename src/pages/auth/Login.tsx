"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import Card, { CardBody, CardHeader, CardFooter } from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Alert from "../../components/ui/Alert"
import { useAuth } from "../../hooks/useAuth"
import type { UserLoginDto } from "../../types/auth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const Login: React.FC = () => {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: UserLoginDto) => {
    try {
      setIsLoading(true)
      setError(null)
      await login(data)
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login to TaskTracker</h1>
        </CardHeader>
        <CardBody>
          {error && (
            <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              {...register("password")}
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Login
            </Button>
          </form>
        </CardBody>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default Login
