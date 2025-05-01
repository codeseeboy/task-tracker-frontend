"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const Logo: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const homePath = isAuthenticated ? "/dashboard" : "/login"

  return (
    <Link to={homePath} className="flex items-center">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">TaskTracker</span>
    </Link>
  )
}

export default Logo
