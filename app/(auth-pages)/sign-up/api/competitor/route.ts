import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";

const competitorSchema = z.object({
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" }),
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  dayOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Nieprawidłowa data",
    })
    .transform((date) => new Date(date)),
  gender: z.enum(["female", "male"]),
  nationality: z.enum(["pl"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const parsedData = competitorSchema.parse(body);

    const {
      email,
      password,
      firstname,
      lastname,
      dayOfBirth,
      gender,
      nationality,
    } = parsedData;

    // Sprawdzenie unikalności e-maila
    const { data: isUnique, error: emailCheckError } = await supabase.rpc(
      "is_email_unique",
      {
        email,
      },
    );

    if (!isUnique) {
      return NextResponse.json(
        { error: "Użytkownik z tym e-mailem już istnieje." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: "competitor",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: `${error.message}` }, { status: 400 });
    }

    const id = data.user?.id as string;
    const { error: profileError } = await supabase.from("competitors").insert({
      id: id,
      firstname,
      lastname,
      day_of_birth: format(new Date(dayOfBirth), "dd-MM-yyyy"),
      gender,
      nationality,
    });

    if (profileError) {
      // Rollback w przypadku błędu
      await supabase.auth.admin.deleteUser(id);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Rejestracja zawodnika zakończona sukcesem." },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Nieprawidłowe dane wejściowe", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 },
    );
  }
}
