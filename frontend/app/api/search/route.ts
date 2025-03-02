import { type NextRequest, NextResponse } from "next/server";
import type { SearchParams } from "@/components/SearchForm";
import { API_URL } from "@/lib/api";

export async function POST(request: NextRequest) {
	try {
		// Get search params from request body
		const searchParams: SearchParams = await request.json();

		// Convert search params to URL query parameters
		const queryParams = new URLSearchParams();

		// Add all non-empty search parameters to the query
		for (const [key, value] of Object.entries(searchParams)) {
			if (value !== undefined && value !== null && value !== "") {
				// Handle boolean values
				if (typeof value === "boolean") {
					queryParams.append(key, value.toString());
				} else {
					queryParams.append(key, value.toString());
				}
			}
		}

		const response = await fetch(
			`${API_URL}/restaurants?${queryParams.toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Search API error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
