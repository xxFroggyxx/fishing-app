import { createClient } from "@/utils/supabase/server";
import { SignUpDialog } from "@/components/signup-dialog";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="sr-only">
        Aplikacja webowa do zarządzania zawodami wędkarskimi.
      </h1>
      {user ? (
        <div className="mx-auto max-w-xl space-y-4 text-center text-3xl !leading-tight lg:text-4xl">
          <p className="font-bold">Cześć, {user.email}! 🎣</p>
          <p className="text-lg">
            Gotowy na nowe wyzwania? Sprawdź swoje aktualne zawody lub dołącz do
            nowych rywalizacji!
          </p>
          <p className="text-sm text-muted-foreground">
            Twoje miejsce w historii wędkarskich zmagań czeka! 🏆
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-16">
          <p className="mx-auto max-w-xl text-center text-3xl !leading-tight lg:text-4xl">
            <span className="font-bold">Dołącz do zawodów wędkarskich</span> -{" "}
            <span className="font-thin">zarejestruj się już </span>
            <span className="font-bold uppercase underline">dziś!</span>
          </p>
          <SignUpDialog />
        </div>
      )}
    </div>
  );
}
