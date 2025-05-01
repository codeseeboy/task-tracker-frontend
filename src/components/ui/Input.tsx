import type React from "react"
import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, leftIcon, rightIcon, className = "", ...props }, ref) => {
    const widthClass = fullWidth ? "w-full" : ""
    const errorClass = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
    const iconPaddingLeft = leftIcon ? "pl-10" : ""
    const iconPaddingRight = rightIcon ? "pr-10" : ""

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm block ${widthClass} ${errorClass} ${iconPaddingLeft} ${iconPaddingRight} focus:outline-none focus:ring-2 py-2 px-3`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
