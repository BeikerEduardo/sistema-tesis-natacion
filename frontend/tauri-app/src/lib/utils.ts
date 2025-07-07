// src/lib/utils.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de forma segura y resuelve duplicados de Tailwind.
 *
 * @example
 *   cn("p-4", condition && "text-red-500", "p-2") // → "text-red-500 p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
