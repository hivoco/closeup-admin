import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const API_BASE_URL = "http://localhost:8000";
export const API_BASE_URL = "https://api.closeuplovetunes.in";
// export const API_BASE_URL = "http://localhost:8000";
