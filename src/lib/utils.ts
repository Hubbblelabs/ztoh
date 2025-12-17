import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingId(type: 'contact' | 'join'): string {
  // Format: YYYYMMDD-XXXX (e.g., 20231201-1234)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit random number

  return `${year}${month}${day}${random}`;
}
