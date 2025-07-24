import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the application URL dynamically
 * Uses Vercel's built-in VERCEL_URL in production, localhost in development
 */
export function getAppUrl(): string {
  // In production on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // In development
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }
  
  // Fallback
  return 'https://visaplace-demo.vercel.app'
}
