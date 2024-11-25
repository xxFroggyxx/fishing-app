import { SignUpDialog } from "@/components/signup-dialog";

export default function Header() {
  return (
    <div className="flex flex-col items-center gap-16">
      <h1 className="sr-only">
        Aplikacja webowa do zarządzania zawodami wędkarskimi.
      </h1>
      <p className="mx-auto max-w-xl text-center text-3xl !leading-tight lg:text-4xl">
        <span className="font-bold">Dołącz do zawodów wędkarskich</span> -{" "}
        <span className="font-thin">zarejestruj się już </span>
        <span className="font-bold uppercase underline">dziś!</span>
      </p>
      <SignUpDialog />
    </div>
  );
}
