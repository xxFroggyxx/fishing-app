import Link from "next/link";

interface TournamentCardProps {
  imageOptions: {
    src: string;
    alt: string;
  };
  title: string;
  method: string;
  when: string;
  where: string;
  official: boolean;
}

export default function TournamentCard({
  imageOptions,
  title,
  method,
  when,
  where,
  official,
}: TournamentCardProps) {
  return (
    <Link href="/">
      <div className="border-b-foreground/1 relative max-w-sm overflow-hidden rounded-lg border shadow-md transition-transform hover:scale-105">
        {official && (
          <div className="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-3 py-1 text-xs font-bold uppercase">
            Official!
          </div>
        )}
        <img
          className="max-h-64 rounded-t-lg"
          src={imageOptions.src}
          alt={imageOptions.alt}
        />
        <div className="p-5">
          <h3 className="mb-2 text-2xl font-bold tracking-tight">{title}</h3>
          <p className="mb-3 whitespace-pre-line font-light text-foreground/70">
            <span>Metoda: {method}</span>
            <br />
            <span>Kiedy: {when}</span>
            <br />
            <span>Gdzie: {where}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
