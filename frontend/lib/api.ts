import { useState } from "react";

// Restaurant and response types
export interface Restaurant {
	id: string;
	name: string;
	image_url: string;
	url: string;
	review_count: number;
	rating: number;
	price?: string;
	categories: string[];
	address: string;
	city: string;
	zip_code: string;
	phone: string;
	latitude: number;
	longitude: number;
	distance?: number;
	is_closed: boolean;
	hours?: {
		open: { day: number; start: string; end: string; is_overnight: boolean }[];
		is_open_now: boolean;
	}[];
}

export interface RestaurantResponse {
	restaurants: Restaurant[];
	total: number;
	region?: {
		center: {
			latitude: number;
			longitude: number;
		};
	};
}

export type SortBy = "best_match" | "rating" | "review_count" | "distance";

export interface SearchParams {
	// Location parameters (at least one is required)
	location?: string;
	latitude?: number;
	longitude?: number;

	// Search parameters
	term?: string;
	radius?: number;
	categories?: string;
	locale?: string;

	// Price and availability filters
	price?: string;
	open_now?: boolean;
	open_at?: number;

	// Additional filters
	attributes?: string;

	// Sorting and pagination
	sort_by?: SortBy;
	limit?: number;
	offset?: number;

	// Reservation parameters
	reservation_date?: string;
	reservation_time?: string;
	reservation_covers?: number;
}

// API URL - local for now
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Searches for restaurants using the backend API
 */
export async function searchRestaurants(
	params: SearchParams,
): Promise<RestaurantResponse> {
	// Filter out undefined values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([_, value]) => value !== undefined),
	);

	const queryParams = new URLSearchParams(
		cleanParams as Record<string, string>,
	);

	try {
		const response = await fetch(`${API_BASE_URL}/restaurants?${queryParams}`);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || "Failed to fetch restaurants");
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching restaurants:", error);
		throw error;
	}
}

/**
 * A hook to handle restaurant search state
 */
export function useRestaurantSearch() {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [region, setRegion] = useState<{
		center: { latitude: number; longitude: number };
	} | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const search = async (params: SearchParams) => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await searchRestaurants(params);
			setRestaurants(data.restaurants);
			setTotal(data.total);
			setRegion(data.region || null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred",
			);
			setRestaurants([]);
			setTotal(0);
			setRegion(null);
		} finally {
			setIsLoading(false);
		}
	};

	// Convenience method for backward compatibility
	const searchByLocation = (
		location: string,
		options: Omit<SearchParams, "location"> = {},
	) => {
		return search({ location, ...options });
	};

	return {
		restaurants,
		total,
		region,
		isLoading,
		error,
		search,
		searchByLocation,
	};
}
