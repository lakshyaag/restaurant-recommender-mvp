import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Helper to format distance
export const formatDistance = (distance?: number): string => {
	if (!distance) return "Unknown distance";
	const kilometers = distance / 1000;
	return `${kilometers.toFixed(1)} km away`;
};
