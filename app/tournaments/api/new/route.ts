import { createClientAdmin } from "@/utils/supabase/admin-server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClientAdmin();
  const { data, error } = await supabase.from("referees").select(
    `
    id,
      competitors (
        user_id,
        firstname,
        lastname
      )
    `,
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ referee: data }, { status: 200 });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { name, when, time, details, entry_fee, referee } = body;

  const combineDateTime = (when: string, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(when);
    date.setUTCHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const { data, error } = await supabase
    .from("competitions")
    .insert([
      {
        name,
        when: combineDateTime(when, time),
        details,
        entry_fee: entry_fee || null,
        referee: parseInt(referee) || null,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Utworzono wydarzenie!" },
    { status: 201 },
  );
}
