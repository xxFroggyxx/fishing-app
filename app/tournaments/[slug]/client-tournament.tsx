"use client";

import { Tournament } from "@/components/current-tournaments";
import { FormMessage, Message } from "@/components/form-message";
import { TournamentDialog } from "@/components/tournament-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Result {
  registration_id: number;
  points: number;
  stand_no: number;
  achived_place?: number;
}

interface Statistics {
  totalCompetitors: number;
  totalPoints: number;
  maxPoints: number;
  minPoints: number;
  averagePoints: string;
  competitorsWithNoPoints: number;
  topThreeAverage: string;
  percentageAboveAverage: string;
  percentageNoPoints: string;
  medianPoints: string;
}

function calculateStatistics(results: Result[]): Statistics {
  const totalCompetitors = results.length;

  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);

  const maxPoints = Math.max(...results.map((result) => result.points));

  const minPoints = Math.min(...results.map((result) => result.points));

  const averagePoints =
    totalCompetitors > 0 ? totalPoints / totalCompetitors : 0;

  const competitorsWithNoPoints = results.filter(
    (result) => result.points === 0,
  ).length;

  const topThreeAverage =
    results
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)
      .reduce((sum, result) => sum + result.points, 0) / 3 || 0;

  const aboveAverageCount = results.filter(
    (result) => result.points > averagePoints,
  ).length;

  const percentageAboveAverage = totalCompetitors
    ? (aboveAverageCount / totalCompetitors) * 100
    : 0;

  const percentageNoPoints = totalCompetitors
    ? (competitorsWithNoPoints / totalCompetitors) * 100
    : 0;

  // Oblicz medianę punktów
  const sortedPoints = results
    .map((result) => result.points)
    .sort((a, b) => a - b);
  const medianPoints =
    totalCompetitors % 2 === 0
      ? (sortedPoints[totalCompetitors / 2 - 1] +
          sortedPoints[totalCompetitors / 2]) /
        2
      : sortedPoints[Math.floor(totalCompetitors / 2)];

  return {
    totalCompetitors,
    totalPoints,
    maxPoints,
    minPoints,
    averagePoints: averagePoints.toFixed(2),
    competitorsWithNoPoints,
    topThreeAverage: topThreeAverage.toFixed(2),
    percentageAboveAverage: percentageAboveAverage.toFixed(2),
    percentageNoPoints: percentageNoPoints.toFixed(2),
    medianPoints: medianPoints.toFixed(2), // Dodanie mediany do statystyk
  };
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function ClientTournament(props: {
  searchParams: Message;
  tournament: Tournament;
  user: User | null;
  slug: string;
  competitorData: any;
  isUserRegistred: any | null;
  competitorWholeData: any[] | null;
}) {
  const {
    searchParams,
    tournament,
    user,
    slug,
    competitorData,
    isUserRegistred,
    competitorWholeData,
  } = props;
  const router = useRouter();
  const supabase = createClient();

  const formattedDatePL = format(
    parseISO(tournament.when),
    "EEEE, dd MMMM yyyy, HH:mm",
    { locale: pl },
  );

  React.useEffect(() => {
    // Odśwież stronę po rozpoczęciu zawodów
    const channel = supabase.channel("tournaments");
    channel.on("broadcast", { event: "tournament_started" }, (message) => {
      if (message.payload.id === tournament.id) {
        router.refresh();
      }
    });
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [localResults, setLocalResults] = React.useState(
    competitorWholeData?.map((competitor) => ({
      registration_id: competitor.registration.id,
      points: competitor.points || 0,
      stand_no: competitor.stand_no,
    })) || [],
  );

  async function handleRegistration() {
    if (!user) {
      return;
    }

    const { data: existingRegistration, error: selectError } = await supabase
      .from("registration")
      .select("*")
      .eq("id_competition", tournament.id)
      .eq("id_competitor", competitorData.id)
      .single();

    const now = new Date();
    if (!existingRegistration) {
      const { error } = await supabase.from("registration").insert([
        {
          id_competition: tournament.id,
          id_competitor: competitorData.id,
          is_paid: tournament.entry_fee === 0 ? true : false,
          when_paid: tournament.entry_fee === 0 ? now : null,
          created_at: now,
        },
      ]);
    }

    if (tournament.entry_fee > 0) {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_fee: tournament.entry_fee * 100,
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
      return;
    }

    router.refresh();
  }

  async function fetchResults() {
    const { data, error } = await supabase
      .from("results")
      .select(
        "*, registration:registration(*, competitors(user_id, firstname, lastname))",
      )
      .eq("registration.id_competition", tournament.id)
      .not("registration", "is", null);

    if (error) {
      console.log("Nie udało się pobrać wyników:", error);
      return [];
    }
    console.log(data);

    return data || [];
  }

  async function startTournament() {
    const { error } = await supabase
      .from("competitions")
      .update({ status: "inProgress" })
      .eq("id", tournament.id);
    if (error) {
      console.log("Nie udało się rozpocząć zawodów.");
      return;
    }

    const { data: competitorList, error: fetchError } = await supabase
      .from("registration")
      .select("*, competitors(firstname, lastname)")
      .eq("id_competition", tournament.id)
      .eq("is_paid", true);

    if (fetchError || !competitorList) {
      console.log("Nie udało się pobrać listy uczestników.");
      return;
    }

    const shuffledPositions = Array.from(
      { length: competitorList.length },
      (_, i) => i + 1,
    ).sort(() => Math.random() - 0.5);

    const resultsData = competitorList.map((competitor, index) => ({
      registration_id: competitor.id,
      stand_no: shuffledPositions[index],
      points: 0,
      achived_place: null,
    }));

    const { error: insertError } = await supabase
      .from("results")
      .insert(resultsData);

    if (insertError) {
      console.log("Nie udało się dodać wyników do tabeli.");
      return;
    }

    // Pobierz dane wyników i zaktualizuj stan
    const newResults = await fetchResults();
    setLocalResults(
      newResults.map((competitor) => ({
        registration_id: competitor.registration.id,
        points: competitor.points || 0,
        stand_no: competitor.stand_no,
      })),
    );

    const channel = supabase.channel("tournaments");
    channel.send({
      type: "broadcast",
      event: "tournament_started",
      payload: { id: tournament.id },
    });
  }

  function handlePointsChange(
    event: React.ChangeEvent<HTMLInputElement>,
    registrationId: number,
  ) {
    const newPoints = parseInt(event.target.value, 10) || 0;

    setLocalResults((prevResults = []) =>
      prevResults.map((result) =>
        result.registration_id === registrationId
          ? { ...result, points: newPoints }
          : result,
      ),
    );
  }

  async function finishTournament() {
    // Posortuj wyniki według punktów malejąco
    const sortedResults = [...localResults].sort((a, b) => b.points - a.points);

    // Przypisz miejsca (1, 2, 3, ...) na podstawie kolejności w sortowaniu
    const resultsWithPlaces = sortedResults.map((result, index) => ({
      ...result,
      achived_place: index + 1,
    }));

    // Zaktualizuj tabelę `results` w bazie danych
    const { error } = await supabase
      .from("results")
      .upsert(resultsWithPlaces, { onConflict: "registration_id" });

    if (error) {
      console.log("Nie udało się zaktualizować wyników:", error);
      return;
    }

    console.log("Wyniki zaktualizowane pomyślnie z miejscami");

    // Zmień status zawodów na "finished"
    const { error: statusError } = await supabase
      .from("competitions")
      .update({ status: "finished" })
      .eq("id", tournament.id);

    if (statusError) {
      console.log("Nie udało się zakończyć zawodów:", statusError);
      return;
    }

    router.refresh();
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
          {tournament.status === "pending" && (
            <>
              {user && user.user_metadata.account_type === "competitor" && (
                <>
                  {isUserRegistred ? (
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
                      {tournament.entry_fee > 0 &&
                        `- ${tournament.entry_fee} PLN`}
                    </Button>
                  )}
                </>
              )}
            </>
          )}

          {tournament.status === "inProgress" && (
            <div className="text-center text-muted-foreground">
              <p className="text-2xl">
                Wydarzenie <span className="font-bold">wystartowało</span>.
              </p>
              <p>Wyniki będą dostępne po zakończeniu zawodów</p>
            </div>
          )}

          {tournament.status === "finished" && (
            <div className="text-center text-muted-foreground">
              <p className="text-2xl">
                Wydarzenie{" "}
                <span className="font-bold uppercase">zakończone</span>.
              </p>
            </div>
          )}
        </div>

        {tournament.status === "pending" && (
          <p className="text-center text-sm text-muted-foreground">
            Na każde zawody można się zapisać dopóki sędzia nie wystartuje
            wydarzenia!
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        {tournament.status === "pending" && (
          <>
            {user?.id === tournament.owner_id && (
              <Link href={`/tournaments/${slug}/edit`}>
                <Button variant={"secondary"}>Edytuj wydarzenie</Button>
              </Link>
            )}
            {user?.id === tournament?.referee?.competitors?.user_id && (
              <TournamentDialog
                btnTitle="Rozpocznij zawody"
                dialogTitle="Czy na pewno chcesz rozpocząć zawody?"
                dialogDescription="Wydarzenie zostanie uruchomione i gracze będą mogli zacząć
            rywalizację. Uniemożliwi to dalsze zapisywanie się na zawody."
                btnVariant="secondary"
                onStartFn={startTournament}
              />
            )}
          </>
        )}

        {tournament.status === "inProgress" && (
          <>
            {user?.id === tournament?.referee?.competitors?.user_id && (
              <TournamentDialog
                btnTitle="Zakończ zawody"
                dialogTitle="Czy na pewno chcesz zakończyć zawody?"
                dialogDescription="Wydarzenie zostanie zakończone i wyniki będą dostępne dla wszystkich uczestników."
                btnVariant="secondary"
                onStartFn={finishTournament}
              />
            )}
          </>
        )}

        {searchParams && (
          <div className="align-center flex justify-center">
            <FormMessage message={searchParams} />
          </div>
        )}
      </div>
      {tournament.status === "inProgress" && (
        <div>
          <h2 className="text-center text-3xl font-bold">Listy startowe</h2>
          {user?.id === tournament?.referee?.competitors?.user_id ? (
            <div className="relative overflow-hidden shadow-md">
              <table className="w-full table-auto text-center">
                <thead>
                  <tr>
                    <th scope="col">L.P.</th>
                    <th scope="col">Zawodnik</th>
                    <th scope="col">Nr. Stanowiska</th>
                    <th scope="col">Punkty(Gram=1pkt)</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorWholeData?.map((competitor, index) => (
                    <tr key={index} className="[&>*]:py-4">
                      <td>{index + 1}</td>
                      <td>
                        {competitor.registration.competitors.firstname}{" "}
                        {competitor.registration.competitors.lastname}
                      </td>
                      <td>{competitor.stand_no}</td>
                      <td>
                        <input
                          type="number"
                          className="w-16 rounded border px-2 py-1"
                          placeholder="0"
                          onChange={(e) =>
                            handlePointsChange(e, competitor.registration.id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="relative overflow-hidden shadow-md">
              <table className="w-full table-auto text-center">
                <thead>
                  <tr>
                    <th scope="col">L.P.</th>
                    <th scope="col">Zawodnik</th>
                    <th scope="col">Nr. Stanowiska</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorWholeData?.map((competitor, index) => (
                    <tr key={index} className="[&>*]:py-4">
                      <td>{index + 1}</td>
                      <td>
                        {competitor.registration.competitors.firstname}{" "}
                        {competitor.registration.competitors.lastname}
                      </td>
                      <td>{competitor.stand_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tournament.status === "finished" && (
        <div className="space-y-6">
          <h2 className="text-center text-3xl font-bold">Wyniki</h2>
          <div className="relative overflow-hidden shadow-md">
            <table className="w-full table-auto text-center">
              <thead>
                <tr>
                  <th scope="col">L.P.</th>
                  <th scope="col">Zawodnik</th>
                  <th scope="col">Nr. Stanowiska</th>
                  <th scope="col">Punkty(Gram=1pkt)</th>
                  <th scope="col">Miejsce</th>
                </tr>
              </thead>
              <tbody>
                {competitorWholeData?.map((competitor, index) => (
                  <tr key={index} className="[&>*]:py-4">
                    <td>{index + 1}</td>
                    <td>
                      {competitor.registration.competitors.firstname}{" "}
                      {competitor.registration.competitors.lastname}
                    </td>
                    <td>{competitor.stand_no}</td>
                    <td>{competitor.points}</td>
                    <td>{competitor.achived_place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-6">
            <h2 className="text-center text-3xl font-bold">
              Statystyki z zawodów
            </h2>

            <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const stats = calculateStatistics(localResults);

                return statsDefinition(stats).map((stat, index) => (
                  <StatisticCard
                    key={index}
                    statTitle={stat.title}
                    statContent={stat.content}
                  />
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatisticCard = ({
  statTitle,
  statContent,
}: {
  statTitle: string;
  statContent: string | number;
}) => (
  <div className="aling-center flex flex-col justify-center rounded-lg border bg-background p-4 shadow-sm">
    <h3 className="text-lg font-bold">{statTitle}</h3>
    <p className="text-center text-2xl font-semibold">{statContent}</p>
  </div>
);

const statsDefinition = (stats: ReturnType<typeof calculateStatistics>) => [
  { title: "Łączna liczba uczestników", content: stats.totalCompetitors },
  { title: "Średnia liczba punktów", content: stats.averagePoints },
  { title: "Maksymalna liczba punktów", content: stats.maxPoints },
  { title: "Minimalna liczba punktów", content: stats.minPoints },
  { title: "Uczestnicy bez punktów", content: stats.competitorsWithNoPoints },
  { title: "Średnia punktów (top 3)", content: stats.topThreeAverage },
  {
    title: "Procent uczestników powyżej średniej",
    content: `${stats.percentageAboveAverage}%`,
  },
  {
    title: "Procent uczestników bez punktów",
    content: `${stats.percentageNoPoints}%`,
  },
  { title: "Mediana liczby punktów", content: stats.medianPoints },
];
