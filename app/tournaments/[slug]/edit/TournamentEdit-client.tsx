"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { intlFormat } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormMessage as StatusMessage,
  Message,
} from "@/components/form-message";
import { User } from "@supabase/supabase-js";
import { encodedRedirect } from "@/utils/utils";
import { Tournament } from "@/components/current-tournaments";
import { redirect } from "next/navigation";

interface Referee {
  id: string;
  competitors: {
    id: string;
    user_id: string;
    firstname: string;
    lastname: string;
  };
}

const formSchema = z.object({
  name: z.string().min(1, "Nazwa zawodów jest wymagana"),
  when: z.date({ required_error: "Data zawodów jest wymagana" }),
  time: z.string().min(1),
  referee: z.string(),
  entry_fee: z.string().min(1),
  details: z.object({
    method: z.enum(["Feeder", "Spławik"]),
    location: z.object({
      name: z.string().min(1, "Nazwa lokalizacji jest wymagana"),
    }),
    description: z.string(),
  }),
});

function splitDateTime(input: string) {
  const dateObj = new Date(input);
  const time = dateObj.toISOString().split("T")[1].slice(0, 5);

  return time;
}

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push(
        <SelectItem key={formattedTime} value={formattedTime}>
          {formattedTime}
        </SelectItem>,
      );
    }
  }
  return options;
};

export default function TournamentEditClient(props: {
  tournament: Tournament;
}) {
  const { id, name, details, entry_fee, when, referee } = props.tournament;
  const [refeers, setRefeers] = useState<Referee[] | null>(null);

  useEffect(() => {
    const fetchReferees = async () => {
      try {
        const res = await fetch("http://localhost:3000/tournaments/api/new", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          return "Błąd podczas pobierania sędziów";
        }
        const data = await res.json();
        setRefeers(data.referee);
      } catch (error) {
        return `Nie udało się połączyć z serwerem.`;
      }
    };

    fetchReferees();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      when: new Date(when),
      time: splitDateTime(when),
      referee: `${referee.id}`,
      entry_fee: entry_fee.toString(),
      details: {
        method: details.method as "Feeder" | "Spławik",
        location: {
          name: details.location.name,
        },
        description: details.description,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    debugger;
    let res;
    try {
      res = await fetch(`http://localhost:3000/tournaments/api/${id}/edit`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return encodedRedirect(
        "error",
        "/tournaments/new/",
        "Nie udało się połączyć z serwerem.",
      );
    }

    const data = await res.json();

    if (!res.ok) {
      return console.error(data.error);
    }

    return redirect(`/tournaments/${id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-medium">Edytuj wydarzenie</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa wydarzenia*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Zawody o tytuł mistrza.."
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
          name="details.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Napisz więcej szczegółów o swoim wydarzeniu.."
                  className="resize-none"
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
          name="entry_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wpisowe</FormLabel>
              <FormControl>
                <Input
                  placeholder="Wpisz kwote wpisowego lub zostaw puste"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sędzia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz sędziego" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {refeers?.map((refeere) => {
                    return (
                      <SelectItem
                        key={refeere.competitors.user_id}
                        value={`${refeere.id}`}
                      >
                        {`${refeere.competitors.firstname} ${refeere.competitors.lastname}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="when"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data wydarzenia*</FormLabel>
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
                    toYear={new Date().getFullYear() + 1}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O której chcesz zacząć zawody*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>{generateTimeOptions()}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.location.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miejsce wydarzenia*</FormLabel>
              <FormControl>
                <Input placeholder="Jezioro Głębokie.." required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ zawodów*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Spławik">Spławik</SelectItem>
                  <SelectItem value="Feeder">Feeder</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Edytuj wydarzenie</Button>
      </form>
    </Form>
  );
}
