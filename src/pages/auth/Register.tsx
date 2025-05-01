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
import type { UserSignupDto } from "../../types/auth"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
})

const Register: React.FC = () => {
  const { register: registerUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignupDto>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: UserSignupDto) => {
    try {
      setIsLoading(true)
      setError(null)
      await registerUser(data)
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create an Account</h1>
        </CardHeader>
        <CardBody>
          {error && (
            <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your full name"
              error={errors.name?.message}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
              {...register("name")}
            />
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
              placeholder="Create a password"
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
            <Input
              label="Country"
              placeholder="Enter your country"
              error={errors.country?.message}
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
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              }
              {...register("country")}
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Register
            </Button>
          </form>
        </CardBody>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default Register
