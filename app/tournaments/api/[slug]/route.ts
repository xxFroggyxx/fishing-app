import { createClientAdmin } from "@/utils/supabase/admin-server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const supabase = await createClientAdmin();
  const slug = (await params).slug;

  const { data, error } = await supabase
    .from("competitions")
    .select("*,  referee:referees(id, competitors(firstname, lastname))")
    .eq("id", slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
