import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignUpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant={"default"}>
          Zarejestruj się
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zarejestruj się</DialogTitle>
          <DialogDescription>
            Wybierz rodzaj konta, które chcesz założyć!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button variant="secondary" asChild>
              <Link href="/sign-up/competitor">Zawodnik</Link>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary" asChild>
              <Link href="/sign-up/organization">Organizator</Link>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
