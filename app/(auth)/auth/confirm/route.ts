import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  const allowedTypes = ["email", "recovery"] as const;

  if (
    !token_hash ||
    !allowedTypes.includes(type as (typeof allowedTypes)[number])
  ) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as "email" | "recovery",
  });

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  const destination =
    next === "/reset-password" && type === "recovery"
      ? "/reset-password"
      : "/overview";

  return NextResponse.redirect(`${origin}${destination}`);
}