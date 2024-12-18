import ClientTournament from "@/app/tournaments/[slug]/client-tournament";
import { Tournament } from "@/components/current-tournaments";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function Page({
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
  console.log(tournament);

  const { data: competitorData, error: competitorError } = await supabase
    .from("competitors")
    .select("id")
    .eq("user_id", user?.id) // tutaj user powininien być przecież??? FIXED?
    .single();

  const { data: isUserRegistred, error } = await supabase
    .from("registration")
    .select("*")
    .eq("id_competition", tournament.id)
    .eq("id_competitor", competitorData?.id)
    .single();

  return (
    <ClientTournament
      tournament={tournament}
      user={user}
      slug={slug}
      competitorData={competitorData}
      isUserRegistred={isUserRegistred}
    />
  );
}
