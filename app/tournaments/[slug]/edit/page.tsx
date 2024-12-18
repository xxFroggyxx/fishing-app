import TournamentEditClient from "@/app/tournaments/[slug]/edit/TournamentEdit-client";
import { Tournament } from "@/components/current-tournaments";
import { createClient } from "@/utils/supabase/server";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { redirect } from "next/navigation";

import React from "react";

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const slug = (await params).slug;
  const response = await fetch(`http://localhost:3000/tournaments/api/${slug}`);

  if (!response.ok) {
    return <div>Nie można załadować wydarzenia.</div>;
  }

  const tournament = (await response.json()) as Tournament;

  if (!user || user.id !== tournament.owner_id) {
    return redirect(`tournaments/${slug}`);
  }

  return <TournamentEditClient tournament={tournament} />;
}
