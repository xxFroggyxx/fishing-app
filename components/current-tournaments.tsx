import TournamentCard from "@/components/tournament-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TOURNAMENTS = [
  {
    title: "Puchar Perfect Fishing ONLINE",
    description: "Metoda: Spinning \nGatunek: Okoń \n06.12.2024",
    image: "https://placehold.co/400x250",
  },
  {
    title: "Zawody Wędkarskie - Rzeka Bug",
    description: "Metoda: Feeder \nGatunek: Leszcz \n10.12.2024",
    image: "https://placehold.co/400x250",
  },
  {
    title: "Mistrzostwa Jeziora Mazury",
    description: "Metoda: Spławik \nGatunek: Karaś \n15.12.2024",
    image: "https://placehold.co/400x250",
  },
];

export default function CurrentTournaments() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="mb-8 text-center text-3xl font-bold dark:text-white">
        Aktualnie rozgrywane zawody
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {TOURNAMENTS.map((tournament, index) => (
          <TournamentCard
            key={index}
            title={tournament.title}
            description={tournament.description}
            imageOptions={{ src: tournament.image, alt: "" }}
          />
        ))}
      </div>
      <Link href="/">
        <Button>Zobacz wszystkie</Button>
      </Link>
    </div>
  );
}
