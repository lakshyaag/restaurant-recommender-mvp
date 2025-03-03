import { type NextRequest, NextResponse } from "next/server";
import type { ClientProfileFormValues } from "@/components/ClientProfileForm";
import { API_URL } from "@/lib/api";

/**
 * Handles client profile submissions
 * This endpoint processes client information and returns restaurant search params
 */
export async function POST(request: NextRequest) {
  try {
    // Get client profile data from request body
    const clientProfile: ClientProfileFormValues = await request.json();

    const response = await fetch(
			`${API_URL}/client_profile`,
			{
				method: "POST",
        body: JSON.stringify(clientProfile),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

    const data = await response.json();

    return NextResponse.json({ 
      success: true, 
      searchParams: data,
      clientProfile 
    });
  } catch (error) {
    console.error("Client API error:", error);
    return NextResponse.json(
      { message: "Failed to process client profile", success: false },
      { status: 500 }
    );
  }
} 