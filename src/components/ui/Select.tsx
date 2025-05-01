"use client"

import type React from "react"
import { forwardRef } from "react"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string
  error?: string
  fullWidth?: boolean
  options: SelectOption[]
  onChange?: (value: string) => void
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = true, options, onChange, className = "", ...props }, ref) => {
    const widthClass = fullWidth ? "w-full" : ""
    const errorClass = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm block ${widthClass} ${errorClass} focus:outline-none focus:ring-2 py-2 px-3 appearance-none`}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"

export default Select
