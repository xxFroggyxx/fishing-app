"use client";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  pendingText?: string;
  pending: boolean;
}
export function SubmitButton({
  children,
  pendingText = "Submitting...",
  pending,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
