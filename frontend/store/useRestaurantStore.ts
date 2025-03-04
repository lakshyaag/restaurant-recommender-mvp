import { create } from "zustand";
import type {
	Region,
	Restaurant,
	RestaurantResponse,
	SearchParams,
} from "@/lib/types";

interface RestaurantState {
	// Search state
	isLoading: boolean;
	error: string | null;
	searchParams: SearchParams;
	restaurants: Restaurant[];
	totalResults: number;
	hasSearched: boolean;
	region: Region;

	// Actions
	setSearchParams: (params: SearchParams) => void;
	searchRestaurants: (params: SearchParams) => Promise<void>;
	resetSearch: () => void;
}

const defaultSearchParams: SearchParams = {
	location: "2 Bloor St E, Toronto, ON M4W 1A8",
	term: "",
	radius: 500,
	price: "",
	open_now: false,
	sort_by: "best_match" as const,
	limit: 10,
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
	region: {
		center: {
			latitude: 0,
			longitude: 0,
		},
	},

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

			const data = (await response.json()) as RestaurantResponse;

			// Update store with results
			set({
				restaurants: data.restaurants || [],
				region: data.region,
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
			hasSearched: false,
		}),
}));

export default useRestaurantStore;
