import { NextRequest, NextResponse } from "next/server";
import { ValidatePayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ValidatePayload = await req.json();
    const { input } = body;

    const validInputs = ["test@example.com", "1234567890"];
    if (validInputs.includes(input)) {
      return NextResponse.json({ message: "Valid" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid email or phone number" },
      { status: 400 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { message: "Invalid request", error: errorMessage },
      { status: 400 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
