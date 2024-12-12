import { createClientAdmin } from "@/utils/supabase/admin-server";
import { NextResponse } from "next/server";
import { z } from "zod";

const organizationSchema = z.object({
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" })
    .max(20, { message: "Hasło może mieć maksymalnie 20 znaków" }),
  organizationName: z
    .string()
    .min(2, { message: "Nazwa organizacji musi mieć co najmniej 2 znaki" })
    .max(100, {
      message: "Nazwa organizacji może mieć maksymalnie 100 znaków",
    }),
  address: z
    .string()
    .min(5, { message: "Adres musi mieć co najmniej 5 znaków" }),
  phone: z
    .string()
    .min(6, { message: "Numer telefonu musi mieć co najmniej 6 znaków" }),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClientAdmin();
    const body = await request.json();

    const parsedData = organizationSchema.parse(body);

    const { email, password, organizationName, address, phone } = parsedData;

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
          account_type: "organization",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const id = data.user?.id as string;

    const { error: profileError } = await supabase
      .from("organizations")
      .insert({
        user_id: id,
        organization_name: organizationName,
        address,
        phone,
        is_verified: false, // Organizacja wymaga weryfikacji przez administratora, aby tworzyć wydarzenia
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
      {
        message:
          "Rejestracja organizacji zakończona sukcesem. Oczekuje na potwierdzenie przez administratora.",
      },
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
