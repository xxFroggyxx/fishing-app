import { createClient } from "@/utils/supabase/server";
import React from "react";

// Typy danych
interface Competitor {
  user_id: string;
  firstname: string;
  lastname: string;
}

interface Registration {
  id_competition: string;
  competitors: Competitor[] | Competitor;
}

interface Result {
  points: number;
  registration: Registration[];
}

interface Ranking {
  fullName: string;
  totalPoints: number;
  totalParticipations: number;
}

export default async function Rankings() {
  const supabase = await createClient();

  // Pobierz wszystkie dane
  const { data: results, error } = await supabase
    .from("results")
    .select(
      `points, registration:registration(id_competition, competitors(user_id, firstname, lastname))`,
    );

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching rankings</div>;
  }

  // Grupowanie i przetwarzanie
  const rankings = results?.reduce<Record<string, Ranking>>(
    (acc, result: Result) => {
      // @ts-ignore
      const competitor = result.registration.competitors;
      if (!competitor) return acc;

      const userId = competitor.user_id;
      const fullName = `${competitor.firstname} ${competitor.lastname}`;

      if (!acc[userId]) {
        acc[userId] = {
          fullName,
          totalPoints: 0,
          totalParticipations: 0,
        };
      }

      acc[userId].totalPoints += result.points || 0;
      acc[userId].totalParticipations += 1;

      return acc;
    },
    {},
  );

  // Przekształcenie obiektu na tablicę i sortowanie
  const sortedRankings = Object.values(rankings || {})
    .map((competitor) => ({
      ...competitor,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-bold">
        Rankingi na sumę punktów
      </h1>
      <div className="relative w-full overflow-x-auto shadow-md">
        <table className="w-full table-fixed border-collapse border text-center">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-2">L.P.</th>
              <th className="px-4 py-2">Zawodnik</th>
              <th className="px-4 py-2">Punkty</th>
              <th className="px-4 py-2">Udziały w zawodach</th>
            </tr>
          </thead>
          <tbody>
            {sortedRankings.map((competitor, index) => (
              <tr key={index} className="[&>*]:py-4">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{competitor.fullName}</td>
                <td className="border px-4 py-2">{competitor.totalPoints}</td>
                <td className="border px-4 py-2">
                  {competitor.totalParticipations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
