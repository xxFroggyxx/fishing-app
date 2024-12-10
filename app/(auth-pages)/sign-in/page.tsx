"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  FormMessage as StatusMessage,
  Message,
} from "@/components/form-message";
import { SignUpDialog } from "@/components/signup-dialog";
import { SubmitButton } from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" })
    .max(20, { message: "Hasło może mieć maksymalnie 20 znaków" }),
});

export default function Login(props: { searchParams: Promise<Message> }) {
  const router = useRouter();
  const searchParams = React.use(props.searchParams);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res;
    try {
      res = await fetch("/sign-in/api", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return encodedRedirect(
        "error",
        "/sign-in",
        "Nie udało się połączyć z serwerem.",
      );
    }

    const data = await res.json();

    if (!res.ok) {
      return encodedRedirect("error", "/sign-in", data.error);
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-[300px] space-y-4 p-4"
      >
        <div>
          <h1 className="text-2xl font-medium">Zaloguj się</h1>
          <p className="text-sm text-foreground">
            Nie masz konta?
            <SignUpDialog btnVariant="link" className="px-2" />
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="mail@przyklad.com"
                  autoComplete="email"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  placeholder="Hasło"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton pendingText="Loguje...">Zaloguj</SubmitButton>
        <StatusMessage message={searchParams} />
      </form>
    </Form>
  );
}
