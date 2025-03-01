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

	// Actions
	setSearchParams: (params: SearchParams) => void;
	searchRestaurants: (params: SearchParams) => Promise<void>;
	resetSearch: () => void;
}

interface ApiResponse {
	restaurants: Restaurant[];
	total: number;
	region: {
		center: {
			latitude: number;
			longitude: number;
		}
	};
	offset?: number;
	limit?: number;
	location?: string;
}

const defaultSearchParams: SearchParams = {
	location: "Toronto",
	term: "",
	radius: 10000,
	price: "",
	open_now: false,
	sort_by: "best_match",
	limit: 20,
	offset: 0,
	view_type: "list",
};

const useRestaurantStore = create<RestaurantState>((set, get) => ({
	// Initial state
	isLoading: false,
	error: null,
	searchParams: defaultSearchParams,
	restaurants: [],
	totalResults: 0,

	// Actions
	setSearchParams: (params) =>
		set((state) => ({
			searchParams: { ...state.searchParams, ...params },
		})),

	searchRestaurants: async (params) => {
		try {
			// Update search params in store
			set({ isLoading: true, error: null, searchParams: params });

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

			const data = await response.json() as ApiResponse;

			// Update store with results
			set({
				restaurants: data.restaurants || [],
				totalResults: data.total || 0,
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
		}),
}));

export default useRestaurantStore;
