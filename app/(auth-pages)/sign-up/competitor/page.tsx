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
import { cn } from "@/lib/utils";
import { intlFormat } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FormMessage as StatusMessage,
  Message,
} from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { encodedRedirect } from "@/utils/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" })
    .max(20, { message: "Hasło może mieć maksymalnie 20 znaków" }),
  firstname: z
    .string()
    .min(2, { message: "Imię musi mieć co najmniej 2 znaki" })
    .max(50, { message: "Imię może mieć maksymalnie 50 znaków" }),
  lastname: z
    .string()
    .min(2, { message: "Nazwisko musi mieć co najmniej 2 znaki" })
    .max(50, { message: "Nazwisko może mieć maksymalnie 50 znaków" }),
  dayOfBirth: z.date(),
  gender: z.enum(["female", "male"]),
  nationality: z.enum(["pl"]),
});

export default function Signup(props: { searchParams: Promise<Message> }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const searchParams = React.use(props.searchParams);
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <StatusMessage message={searchParams} />
      </div>
    );
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      dayOfBirth: new Date(),
      gender: "male",
      nationality: "pl",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let res;
    try {
      res = await fetch("/sign-up/api/competitor", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return encodedRedirect(
        "error",
        "/sign-up/competitor",
        "Nie udało się połączyć z serwerem.",
      );
    } finally {
      setIsSubmitting(false);
    }

    const data = await res.json();

    if (!res.ok) {
      return encodedRedirect("error", "/sign-up/competitor", data.error);
    }

    return encodedRedirect("success", "/sign-up/competitor", data.message);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-medium">Zarejestruj się - zawodnik</h1>
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
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Twoje imie" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Twoje nazwisko" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Płeć</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="female">Kobieta</SelectItem>
                    <SelectItem value="male">Mężczyzna</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Narodowość</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz swoją narodowość" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pl">Polska</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dayOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data urodzenia</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          intlFormat(
                            field.value,
                            {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            },
                            { locale: "pl-PL" },
                          )
                        ) : (
                          <span>Wybierz date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
