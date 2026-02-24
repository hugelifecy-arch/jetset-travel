import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { type } = body;

    if (type !== "corporate" && type !== "luxury") {
      return NextResponse.json(
        { error: "Invalid quote type. Must be 'corporate' or 'luxury'." },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service (e.g. SendGrid, Resend) or CRM
    console.log(`Quote submission (${type}):`, body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
