import { NextResponse } from "next/server";
import { z } from "zod";

const QuoteSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(5).max(30),
  email: z.string().email().max(120).optional().or(z.literal("")),
  travelType: z.enum(["Corporate", "Luxury / Leisure", "Group / Event"]),
  route: z.string().min(3).max(200),
  dates: z.string().min(2).max(80),
  message: z.string().max(2000).optional().or(z.literal("")),
  // Honeypot field must be empty
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = QuoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  // TODO: add rate limiting here (see Fix #3)
  // TODO: send email / CRM (server-side only)

  return NextResponse.json({ ok: true });
}
