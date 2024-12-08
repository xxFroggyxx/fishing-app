import BlogCard from "@/components/blog-card";
import { Button } from "@/components/ui/button";

const POSTS = [
  {
    title: "Zmiany na stronie - Listopad 2024",
    description:
      "Przeczytaj o najnowszych zmianach na stronie, nowych funkcjonalnościach i usprawnieniach.",
    image: "https://placehold.co/400x250",
    link: "/",
  },
  {
    title: "Aktualizacja - Październik 2024",
    description:
      "Dowiedz się więcej o nowych możliwościach i aktualizacjach wprowadzonych w październiku.",
    image: "https://placehold.co/400x250",
    link: "/",
  },
];

export default function LatestBlogPosts() {
  return (
    <div className="grid items-center justify-center gap-8 max-md:text-center md:grid-cols-3">
      <div className="mx-auto max-w-md space-y-4 p-4">
        <h2
          aria-label="Nagłówek sekcji bloga"
          className="flex text-3xl font-extrabold md:text-5xl"
        >
          Wieści znad wody
        </h2>
        <p className="text-sm text-foreground/70">
          Miejsce, gdzie znajdziesz najnowsze informacje ze świata wędkarstwa i
          naszej aplikacji! Sprawdź, co nowego dodaliśmy, jakie usprawnienia
          wprowadziliśmy, oraz dowiedz się, jak najnowsze zmiany mogą ulepszyć
          Twoje doświadczenie nad wodą. Nie przegap żadnej aktualizacji, która
          może zainspirować Twoje kolejne wędkarskie przygody!
        </p>
        <Button>Czytaj dalej</Button>
      </div>
      <div className="grid gap-4 md:col-span-2">
        {POSTS.map((post, index) => (
          <BlogCard
            key={index}
            title={post.title}
            description={post.description}
            image={post.image}
            link={post.link}
          />
        ))}
      </div>
    </div>
  );
}
