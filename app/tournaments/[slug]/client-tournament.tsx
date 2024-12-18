"use client";

import { Tournament } from "@/components/current-tournaments";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";
import { is, pl } from "date-fns/locale";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function ClientTournament(props: {
  tournament: Tournament;
  user: User | null;
  slug: string;
  competitorData: any;
  isUserRegistred: any | null;
}) {
  const { tournament, user, slug, competitorData, isUserRegistred } = props;
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready.",
      );
    }
  }, []);

  const formattedDatePL = format(
    parseISO(tournament.when),
    "EEEE, dd MMMM yyyy, HH:mm",
    { locale: pl },
  );

  async function handleRegistration() {
    if (!user) {
      return;
    }

    const now = new Date();
    const { error } = await supabase.from("registration").insert([
      {
        id_competition: tournament.id,
        id_competitor: competitorData.id,
        is_paid: tournament.entry_fee === 0,
        when_paid: tournament.entry_fee === 0 ? now : null,
        created_at: now,
      },
    ]);
    if (error) {
      console.error(`Nie udało się zapisać: ${error.message}`);
      return;
    }

    if (tournament.entry_fee > 0) {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_fee: tournament.entry_fee * 100, // Przekazujemy kwotę w groszach
          tournament_name: tournament.name,
          email: user.email,
          id_competition: tournament.id,
          id_competitor: competitorData.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się utworzyć sesji płatności.");
      }

      const { url } = await response.json();

      router.push(url);
    }
  }

  return (
    <div>
      <div className="relative mx-auto space-y-4 overflow-hidden rounded-lg border border-foreground/10 p-8 shadow-md">
        {tournament.official && (
          <div className="absolute right-0 top-0 rounded-bl-lg border-b border-l border-foreground/10 bg-background px-6 py-2 text-2xl font-bold uppercase">
            Official!
          </div>
        )}
        <h1 className="text-center text-3xl font-bold">{tournament.name}</h1>
        <div>
          <h2 className="text-lg font-semibold">Opis:</h2>
          <p className="text-muted-foreground">
            {tournament.details.description}
          </p>
        </div>

        <div className="">
          <h2 className="text-lg font-semibold">Szczegóły:</h2>
          <p className="text-muted-foreground">
            Metoda: {tournament.details.method}
          </p>
          <p className="text-muted-foreground">
            Opłata wpisowa:{" "}
            {tournament.entry_fee ? `${tournament.entry_fee} PLN` : "Bezpłatne"}
          </p>
          <p className="text-muted-foreground">
            Sędzia:{" "}
            {tournament.referee
              ? `${tournament.referee.competitors.firstname}  ${tournament.referee.competitors.lastname}`
              : "Jeszcze nie wybrano."}
          </p>
        </div>

        {tournament.details.rules && (
          <div>
            <h2 className="text-lg font-semibold">Zasady:</h2>
            <ul className="ml-8 list-disc text-muted-foreground">
              {tournament.details.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {tournament.details.species && (
          <div>
            <h2 className="text-lg font-semibold">Ryby:</h2>
            <ul className="ml-8 list-disc text-muted-foreground">
              {tournament.details.species.map((specie, index) => (
                <li key={index}>{specie}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">Lokalizacja:</h2>
          <p className="text-muted-foreground">
            Zbiornik: {tournament.details.location.name}
          </p>
          {tournament.details.location.address && (
            <p className="text-muted-foreground">
              Dokładny adres: {tournament.details.location.address}
            </p>
          )}
          {tournament.details.location.coordinates && (
            <p className="text-muted-foreground">
              Współrzędne: {tournament.details.location.coordinates.latitude},{" "}
              {tournament.details.location.coordinates.longitude}
            </p>
          )}
        </div>

        {tournament.details.notes && (
          <div>
            <h2 className="text-lg font-semibold">Dodatkowe informacje:</h2>
            <p className="text-muted-foreground">{tournament.details.notes}</p>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-lg font-semibold">Data wydarzenia:</h2>
          <p className="font-bold underline">{formattedDatePL}</p>
        </div>

        <div className="flex justify-center">
          {user &&
            user.user_metadata.account_type === "competitor" &&
            (isUserRegistred ? (
              isUserRegistred.is_paid === true ? (
                <div>
                  <p className="text-muted-foreground">
                    Użytkownik został zapisany na wydarzenie.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-red-500 p-4">
                  <p className="text-center text-lg font-bold">
                    Zapisałeś się wstępnie na zawody.
                    <br />
                    Jeśli ich nie opłacisz:
                    <br />
                    <span className="text-xl uppercase text-red-700">
                      Nie weźmiesz udziału!
                    </span>
                  </p>
                  <Button onClick={handleRegistration}>
                    Opłać{" "}
                    {tournament.entry_fee > 0 &&
                      `- ${tournament.entry_fee} PLN`}
                  </Button>
                </div>
              )
            ) : (
              <Button onClick={handleRegistration}>
                Zapisz się{" "}
                {tournament.entry_fee > 0 && `- ${tournament.entry_fee} PLN`}
              </Button>
            ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Na każde zawody można się zapisać dopóki organizator nie zacznie
          wydarzenia!
        </p>
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        {user?.id === tournament.owner_id && (
          <Link href={`/tournaments/${slug}/edit`}>
            <Button variant={"secondary"}>Edytuj wydarzenie</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
