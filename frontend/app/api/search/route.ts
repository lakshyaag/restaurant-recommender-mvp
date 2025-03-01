import { type NextRequest, NextResponse } from "next/server";
import type { SearchParams } from "@/components/SearchForm";
import { response as mockResponse } from "@/lib/mock_response";

export async function POST(request: NextRequest) {
	try {
		// Get search params from request body
		const searchParams: SearchParams = await request.json();

		console.info("Search params:", searchParams);

		// Return the mock response directly without modification
		return NextResponse.json(mockResponse);
	} catch (error) {
		console.error("Search API error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	// Redirect GET requests to POST with a helpful message
	return NextResponse.json(
		{ message: "This endpoint requires a POST request with search parameters" },
		{ status: 405 }
	);
}
