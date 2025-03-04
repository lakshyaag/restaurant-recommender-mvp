export interface SearchParams {
	location?: string;
	latitude?: number;
	longitude?: number;
	term?: string;
	radius?: number;
	categories?: string;
	locale?: string;
	price?: string;
	open_now?: boolean;
	open_at?: number;
	attributes?: string;
	sort_by?: "best_match" | "rating" | "review_count" | "distance";
	limit?: number;
	offset?: number;
	reservation_date?: string;
	reservation_time?: string;
	reservation_covers?: number;
	view_type?: "list" | "map";
}

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

export interface Region {
	center: {
		latitude: number;
		longitude: number;
	};
}

export interface RestaurantResponse {
	restaurants: Restaurant[];
	total: number;
	region: Region;
	offset?: number;
	limit?: number;
	location?: string;
}
