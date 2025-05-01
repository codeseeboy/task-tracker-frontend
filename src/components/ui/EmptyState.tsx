"use client"

import type React from "react"
import Button from "./Button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, actionLabel, onAction, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {icon && <div className="text-gray-400 dark:text-gray-500 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
