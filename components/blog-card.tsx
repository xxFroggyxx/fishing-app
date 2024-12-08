import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function BlogCard({
  title,
  description,
  image,
  link,
}: BlogCardProps) {
  return (
    <Link href={link}>
      <div className="mx-auto grid w-full max-w-2xl items-center overflow-hidden rounded-lg border border-foreground/10 shadow-md max-sm:max-w-sm sm:grid-cols-2">
        <div className="p-6">
          <span className="text-xl font-semibold">{title}</span>
          <p className="mt-3 text-sm leading-relaxed text-foreground/70">
            {description}
          </p>
          <Button variant={"link"} className="p-0">
            Czytaj więcej &gt;
          </Button>
        </div>
        <div className="h-full">
          <img src={image} className="h-full w-full object-cover" />
        </div>
      </div>
    </Link>
  );
}
