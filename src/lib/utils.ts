import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// --- FRONTEND LAYER ---
// Dynamic Tailwind Class Conditional Merging & Conflict Resolver Utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}