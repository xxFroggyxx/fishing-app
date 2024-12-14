import TournamentCard from "@/components/tournament-card";
import { Button } from "@/components/ui/button";
import { encodedRedirect } from "@/utils/utils";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";

export interface Tournament {
  [x: string]: string | string[] | object | number | boolean;
  id: string;
  onwer_id: string;
  name: string;
  details: {
    notes: string;
    rules: string[];
    method: string;
    prizes: {
      first_place: string;
      second_place: string;
      third_place: string;
    };
    species: string[];
    location: {
      name: string;
      address: string | null;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    sponsors: string[] | null;
    description: string;
    max_participants: number;
  };
  when: string;
  referee: string;
  entry_fee: number;
  created_at: string;
  official: boolean;
}

const fetchLatestTournaments = async () => {
  try {
    const res = await fetch("http://localhost:3000/tournaments/api/latest", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return "Błąd podczas pobierania wydarzeń";
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return `Nie udało się połączyć z serwerem. ${error}`;
  }
};

export default async function CurrentTournaments() {
  let tournaments: Tournament[];
  try {
    tournaments = await fetchLatestTournaments();
  } catch (error) {
    return (
      <div className="text-center text-red-500">
        Nie udało się załadować zawodów.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="mb-8 text-center text-3xl font-bold dark:text-white">
        Aktualnie rozgrywane zawody
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {tournaments.map((tournament, index) => {
          const formattedDatePL = format(
            parseISO(tournament.when),
            "dd MMMM yyyy, HH:mm",
            {
              locale: pl,
            },
          );
          return (
            <TournamentCard
              key={index}
              title={tournament.name}
              method={tournament.details.method}
              when={formattedDatePL}
              where={tournament.details.location.name}
              imageOptions={{ src: "https://placehold.co/400x250", alt: "" }}
              official={tournament.official}
            />
          );
        })}
      </div>
      <Link href="/tournaments">
        <Button>Zobacz wszystkie</Button>
      </Link>
    </div>
  );
}
