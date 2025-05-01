import { Link, LinkProps } from "react-router-dom";
import React from "react";

// Button.tsx
type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "warning";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  as?: React.ElementType | typeof Link;
  to?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & 
   Partial<LinkProps>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as: Component = "button",
      to,
      variant = "primary",
      size = "md",
      leftIcon,
      isLoading = false,
      fullWidth = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = "rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400"
    };

    const baseProps = Component === Link ? { to } : {};

    return (
      <Component
        ref={ref}
        {...baseProps}
        {...props}
        disabled={isLoading || props.disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </span>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;