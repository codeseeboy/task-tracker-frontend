"use client"

import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick, hoverable = false }) => {
  const hoverClass = hoverable ? "hover:shadow-lg transition-shadow cursor-pointer" : ""
  const clickClass = onClick ? "cursor-pointer" : ""

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

export default Card
