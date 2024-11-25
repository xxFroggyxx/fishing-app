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
          Sign Up
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign up</DialogTitle>
          <DialogDescription>
            Choose the type of account you want to sign up!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button variant="secondary" asChild>
              <Link href="/sign-up/competitor">Competitor</Link>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary" asChild>
              <Link href="/sign-up/organization">Organization</Link>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
