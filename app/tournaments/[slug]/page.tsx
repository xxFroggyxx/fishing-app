import { Tournament } from "@/components/current-tournaments";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const response = await fetch(`http://localhost:3000/tournaments/api/${slug}`);

  if (!response.ok) {
    return <div>Nie można załadować wydarzenia.</div>;
  }

  const tournament = (await response.json()) as Tournament;

  const formattedDatePL = format(
    parseISO(tournament.when),
    "EEEE, dd MMMM yyyy, HH:mm",
    { locale: pl },
  );

  return (
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
        <Button>
          Zapisz się{" "}
          {tournament.entry_fee > 0 && `- ${tournament.entry_fee} PLN`}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Na każde zawody można się zapisać do 30 minut przed rozpoczęciem!
      </p>
    </div>
  );
}
