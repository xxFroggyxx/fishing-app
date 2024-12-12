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
import { Button } from "@/components/ui/button";
import { encodedRedirect } from "@/utils/utils";

import {
  FormMessage as StatusMessage,
  Message,
} from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

const formSchema = z.object({
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" })
    .max(20, { message: "Hasło może mieć maksymalnie 20 znaków" }),
  organizationName: z.string(),
  address: z.string(),
  phone: z.string(),
});

export default function Signup(props: { searchParams: Promise<Message> }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const searchParams = React.use(props.searchParams);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      organizationName: "",
      address: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let res;
    try {
      res = await fetch("/sign-up/api/organization", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return encodedRedirect(
        "error",
        "/sign-up/organization",
        "Nie udało się połączyć z serwerem.",
      );
    } finally {
      setIsSubmitting(false);
    }

    const data = await res.json();

    if (!res.ok) {
      return encodedRedirect("error", "/sign-up/organization", data.error);
    }

    return encodedRedirect("success", "/sign-up/organization", data.message);
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-medium">
            Zarejestruj się - organizator
          </h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="mail@przyklad.com"
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
                  <Input type="password" placeholder="Hasło" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa organizacji</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Organizacja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Słoneczne 2A/15, Stargard, 73-110"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="123 456 789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton pending={isSubmitting} pendingText="Proszę czekać..">
            Załóż konto
          </SubmitButton>
          <StatusMessage message={searchParams} />
        </form>
      </Form>
    </>
  );
}
