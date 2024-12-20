import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface SignUpDialogProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  btnTitle: string;
  dialogTitle: string;
  dialogDescription: string;
  onStartFn: () => void;
}

import { Button } from "@/components/ui/button";

export function TournamentDialog({
  btnVariant = "default",
  size = "default",
  className,
  btnTitle,
  dialogTitle,
  dialogDescription,
  onStartFn,
}: SignUpDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={size} variant={btnVariant} className={className}>
          {btnTitle}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button variant="destructive" onClick={onStartFn}>
              Tak
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary">Nie</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
