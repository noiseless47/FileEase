"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gradient";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = "relative font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none";
  
  // Size variations
  const sizeStyles = {
    xs: "text-xs h-7 px-2.5 rounded-lg",
    sm: "text-sm h-8 px-3 rounded-lg",
    md: "text-sm h-10 px-4 rounded-lg",
    lg: "text-base h-12 px-6 rounded-lg",
    xl: "text-lg h-14 px-8 rounded-xl",
  };
  
  // Variant styles
  const variantStyles = {
    primary: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700 text-white shadow-sm hover:shadow",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 shadow-sm hover:shadow",
    outline: "border border-solid border-pink-500 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 shadow-sm hover:shadow",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    gradient: "bg-gradient-to-r from-pink-600 to-violet-600 text-white hover:shadow-md hover:opacity-90",
  };

  // Width style
  const widthStyle = fullWidth ? "w-full" : "";

  // Loading spinner
  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingSpinner}
      {icon && iconPosition === "left" && !loading && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex items-center">{icon}</span>}
    </button>
  );
} 