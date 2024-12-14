import { createClientAdmin } from "@/utils/supabase/admin-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClientAdmin();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("when", { ascending: true })
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
