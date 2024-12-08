import ChartIcon from "@/components/icons/chart-icon";
import HandshakeIcon from "@/components/icons/handshake-icon";
import HookIcon from "@/components/icons/hook-icon";
import NoteIcon from "@/components/icons/note-icon";
import PersonIcon from "@/components/icons/person-icon";
import TrophyIcon from "@/components/icons/trophy-icon";
import WhyUsCard from "@/components/why-us-card";

const CARDCONTENT = [
  {
    icon: <HookIcon />,
    title: "Dostęp do różnych kategorii wędkarskich",
    description:
      "Zawody są dostosowane do różnych stylów wędkowania - spinningu, spławika i metody gruntowej - co daje możliwość dopasowania rywalizacji do swoich preferencji.",
  },
  {
    icon: <ChartIcon />,
    title: "Transparentność wyników i statystyk",
    description:
      "Uczestnicy mają dostęp do bieżących wyników i szczegółowych statystyk, co pozwala na lepsze planowanie strategii i analizę osiągnięć.",
  },
  {
    icon: <PersonIcon />,
    title: "Budowanie osobistego profilu wędkarza",
    description:
      "Uczestnicy tworzą profile z historią połowów i osiągnięciami, które są widoczne dla innych. To świetny sposób na budowanie swojej reputacji w społeczności wędkarskiej.",
  },
  {
    icon: <NoteIcon />,
    title: "Rejestrowanie wyników i historia połowów",
    description:
      "Wszystkie połowy są zapisywane w systemie, umożliwiając późniejszy dostęp do danych i ich analizę.",
  },
  {
    icon: <TrophyIcon />,
    title: "Rankingi i rozwój umiejętności",
    description:
      "System rankingowy wspiera rozwój uczestników i motywuje do osiągania coraz lepszych wyników oraz zdobywania prestiżu w społeczności wędkarskiej.",
  },
  {
    icon: <HandshakeIcon />,
    title: "Społeczność pasjonatów",
    description:
      "Zawody offline to nie tylko rywalizacja, ale także okazja do nawiązywania kontaktów z innymi wędkarzami i dzielenia się swoimi sukcesami.",
  },
];

export default function WhyUs() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="mb-16 text-center text-3xl font-normal sm:text-4xl">
        <span className="font-semibold">Dlaczego</span> FTA?
      </h2>
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {CARDCONTENT.map((card, index) => (
          <WhyUsCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
}
