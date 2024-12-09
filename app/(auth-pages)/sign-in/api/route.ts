import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

interface LoginRequest {
  email: string;
  password: string;
}

const errorMessages: Record<string, string> = {
  "Invalid login credentials": "Nieprawidłowe dane logowania.",
  "Email not confirmed": "Użytkownik nie potwierdził rejestracji.",
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequest;
    const supabase = await createClient();

    const { email, password } = loginSchema.parse(body);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const translatedMessage =
        errorMessages[error.message] || "Wystąpił nieznany błąd";
      return NextResponse.json({ error: translatedMessage }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Zalogowano pomyślnie" },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
