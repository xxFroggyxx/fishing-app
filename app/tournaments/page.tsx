"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tournament } from "@/components/current-tournaments";
import TournamentCard from "@/components/tournament-card";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Pobieranie początkowych wartości z searchParams
  const initialSearchQuery = searchParams.get("query") || "";
  const initialSortOrder = searchParams.get("sortOrder") || "asc";
  const initialMethod = searchParams.get("method") || "all";
  const initialShowOfficial = searchParams.get("official") || "all";

  // Stany
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    initialSortOrder as "asc" | "desc",
  );
  const [methodFilter, setMethodFilter] = useState<string>(initialMethod);
  const [officialFilter, setOfficialFilter] = useState<
    "true" | "false" | "all"
  >(initialShowOfficial as "true" | "false" | "all");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch("http://localhost:3000/tournaments/api");
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Aktualizacja URL przy zmianie filtrów, sortowania i wyszukiwania
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sortOrder", sortOrder);
    params.set("method", methodFilter);
    params.set("official", officialFilter);
    if (searchQuery.trim() !== "") {
      params.set("query", searchQuery);
    } else {
      params.delete("query");
    }
    router.replace(`?${params.toString()}`);
  }, [sortOrder, methodFilter, officialFilter, searchQuery, router]);

  // Funkcja filtrowania
  const filteredTournaments = tournaments.filter((tournament) => {
    if (
      methodFilter !== "all" &&
      tournament.details.method.toLowerCase() !== methodFilter
    ) {
      return false;
    }
    if (
      officialFilter !== "all" &&
      String(tournament.official) !== officialFilter
    ) {
      return false;
    }
    if (
      searchQuery.trim() !== "" &&
      !tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Funkcja sortująca
  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    if (a.official !== b.official) {
      return b.official ? 1 : -1;
    }
    const dateComparison =
      new Date(a.when).getTime() - new Date(b.when).getTime();
    return sortOrder === "asc" ? dateComparison : -dateComparison;
  });

  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="mb-8 text-center text-3xl font-bold dark:text-white">
        Aktualnie rozgrywane zawody
      </h2>

      {/* Filtry */}
      <div className="mb-4 flex flex-wrap justify-center gap-4">
        <div>
          <label htmlFor="searchQuery" className="mr-2">
            Wyszukaj:
          </label>
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-2 py-1"
            placeholder="Wpisz nazwę zawodów"
          />
        </div>

        <div>
          <label htmlFor="methodFilter" className="mr-2">
            Metoda:
          </label>
          <select
            id="methodFilter"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="spławik">Spławik</option>
            <option value="feeder">Feeder</option>
          </select>
        </div>

        <div>
          <label htmlFor="officialFilter" className="mr-2">
            Oficjalne:
          </label>
          <select
            id="officialFilter"
            value={officialFilter}
            onChange={(e) =>
              setOfficialFilter(e.target.value as "true" | "false" | "all")
            }
          >
            <option value="all">Wszystkie</option>
            <option value="true">Tylko oficjalne</option>
            <option value="false">Tylko nieoficjalne</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="mr-2">
            Kolejność dat:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Rosnąco</option>
            <option value="desc">Malejąco</option>
          </select>
        </div>
      </div>

      {/* Wyświetlanie turniejów */}
      <div className="grid gap-8 md:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center">
            <span>Ładowanie...</span>
          </div>
        ) : (
          sortedTournaments.map((tournament, index) => {
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
          })
        )}
      </div>
    </div>
  );
}
