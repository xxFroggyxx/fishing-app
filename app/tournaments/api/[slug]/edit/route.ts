import { createClientAdmin } from "@/utils/supabase/admin-server";
import { NextResponse } from "next/server";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { pl } from "date-fns/locale/pl";

// const combineDateTime = (when: string, time: string) => {
//   const [hours, minutes] = time.split(":").map(Number);
//   console.log(hours, minutes);
//   const date = new Date(when);
//   date.setUTCHours(hours, minutes, 0, 0);
//   console.log(date);
//   return date.toISOString();
// };

const combineDateTime = (
  when: string,
  time: string,
  timeZone: string = "UTC",
) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(when);
  date.setHours(hours - 1, minutes, 0, 0);
  const zonedDate = toZonedTime(date, timeZone);

  return formatInTimeZone(zonedDate, timeZone, "yyyy-MM-dd HH:mm:ss");
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const body = await request.json();
  const { name, details, when, referee, entry_fee, time } = body;
  const supabase = await createClientAdmin();
  const slug = (await params).slug;

  const { error } = await supabase
    .from("competitions")
    .update({
      name: name,
      when: combineDateTime(when, time, "Europe/Warsaw"),
      referee: referee,
      entry_fee: entry_fee,
      details: details,
    })
    .eq("id", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json("Edytowano wydarzenie.", { status: 200 });
}
