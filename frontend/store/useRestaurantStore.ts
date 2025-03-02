import { create } from "zustand";
import type { SearchParams } from "@/components/SearchForm";

export interface Restaurant {
	id: string;
	name: string;
	image_url: string;
	url: string;
	review_count: number;
	rating: number;
	price?: string;
	categories: { alias: string; title: string }[];
	location: {
		address1: string;
		city: string;
		state: string;
		zip_code: string;
		display_address: string[];
	};
	display_phone: string;
	distance?: number;
	is_closed?: boolean;
	coordinates?: {
		latitude: number;
		longitude: number;
	};
	photos?: string[] | null;
	hours?: unknown;
	attributes?: {
		business_temp_closed?: boolean | null;
		menu_url?: string | null;
		open24_hours?: boolean | null;
		waitlist_reservation?: boolean | null;
	} | null;
	alias?: string;
	transactions?: string[];
	phone?: string;
}

interface RestaurantState {
	// Search state
	isLoading: boolean;
	error: string | null;
	searchParams: SearchParams;
	restaurants: Restaurant[];
	totalResults: number;
	hasSearched: boolean;
	map?: MapViewResponse;

	// Actions
	setSearchParams: (params: SearchParams) => void;
	searchRestaurants: (params: SearchParams) => Promise<void>;
	resetSearch: () => void;
}

interface RestaurantResponse {
	restaurants: Restaurant[];
	total: number;
	region: {
		center: {
			latitude: number;
			longitude: number;
		};
	};
	offset?: number;
	limit?: number;
	location?: string;
}

interface MapLocation {
	id: string;
	name: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	rating: number;
	price?: string;
	categories: string[];
	image_url?: string;
}

interface MapViewResponse {
	locations: MapLocation[];
	total: number;
	region: {
		center: {
			latitude: number;
			longitude: number;
		};
	};
}

interface ApiResponse {
	map: MapViewResponse;
	list: RestaurantResponse;
}

const defaultSearchParams: SearchParams = {
	location: "Toronto",
	term: "",
	radius: 2000,
	price: "",
	open_now: false,
	sort_by: "best_match" as const,
	limit: 20,
	offset: 0,
	view_type: "list" as const,
};

const useRestaurantStore = create<RestaurantState>((set, get) => ({
	// Initial state
	isLoading: false,
	error: null,
	searchParams: defaultSearchParams,
	restaurants: [],
	totalResults: 0,
	hasSearched: false,
	map: undefined,

	// Actions
	setSearchParams: (params) =>
		set((state) => ({
			searchParams: { ...state.searchParams, ...params },
		})),

	searchRestaurants: async (params) => {
		try {
			// Update search params in store
			set({
				isLoading: true,
				error: null,
				searchParams: params,
				hasSearched: true,
			});

			// Make API request
			const response = await fetch("/api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to fetch restaurants");
			}

			const data = (await response.json()) as ApiResponse;

			// Update store with results
			set({
				restaurants: data.list.restaurants || [],
				totalResults: data.list.total || 0,
				map: data.map,
				isLoading: false,
			});
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "An unknown error occurred",
				isLoading: false,
			});
		}
	},

	resetSearch: () =>
		set({
			searchParams: defaultSearchParams,
			restaurants: [],
			totalResults: 0,
			error: null,
			hasSearched: false,
		}),
}));

export default useRestaurantStore;
