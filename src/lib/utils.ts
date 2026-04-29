import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * combine Tailwind classname and resolve conflict
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
