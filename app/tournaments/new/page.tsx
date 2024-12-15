import * as React from "react";
import TournamentNewClient from "@/app/tournaments/new/TournamentNew-client";
import { Message } from "@/components/form-message";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TournamentNew(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  return <TournamentNewClient user={user} searchParams={searchParams} />;
}
