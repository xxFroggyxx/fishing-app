import Link from "next/link";
import { StringValidation } from "zod";

interface TournamentCardProps {
  imageOptions: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
}

export default function TournamentCard({
  imageOptions,
  title,
  description,
}: TournamentCardProps) {
  return (
    <Link href="/">
      <div className="max-w-sm rounded-lg border border-b-foreground/10 bg-white shadow-md dark:bg-background">
        <img
          className="max-h-64 rounded-t-lg"
          src={`${imageOptions.src}`}
          alt={`${imageOptions.alt}`}
        />
        <div className="p-5">
          <h3 className="mb-2 text-2xl font-bold tracking-tight dark:text-white">
            {title}
          </h3>
          <p className="mb-3 whitespace-pre-line font-light dark:text-foreground/60">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
