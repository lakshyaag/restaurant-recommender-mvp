import { type NextRequest, NextResponse } from "next/server";
import type { ClientProfileFormValues } from "@/components/ClientProfileForm";

/**
 * Handles client profile submissions
 * This endpoint processes client information and returns restaurant search params
 */
export async function POST(request: NextRequest) {
  try {
    // Get client profile data from request body
    const clientProfile: ClientProfileFormValues = await request.json();

    console.log(clientProfile);

    return NextResponse.json({ 
      success: true, 
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