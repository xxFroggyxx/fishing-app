import { metadata } from "@/app/layout";
import { id } from "date-fns/locale";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Pobranie danych z requestu, jeśli potrzebujesz dynamicznych danych (np. kwoty)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: `Wpisowe za turniej ${body.tournament_name || "Turniej"}`,
            },
            unit_amount: body.entry_fee,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: body.email,
      metadata: {
        id_competition: body.id_competition,
        id_competitor: body.id_competitor,
      },
      success_url: `${req.headers.get("origin")}/tournaments/${body.id_competition}/?success=true`,
      cancel_url: `${req.headers.get("origin")}/tournaments/${body.id_competition}/?canceled=true`,
    });
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
