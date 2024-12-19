import { metadata } from "@/app/layout";
import { id } from "date-fns/locale";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: `Wpisowe za turniej ${body.tournament_name}`,
              description: `Opłata użytkownika ${body.email} za udział w turnieju: ${body.tournament_name} o ID turnieju: ${body.id_competition}`,
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
      success_url: `${req.headers.get("origin")}/tournaments/${body.id_competition}/?success=${encodeURIComponent("Płatność przebiegła pomyślnie!")}`,
      cancel_url: `${req.headers.get("origin")}/tournaments/${body.id_competition}/?canceled=${encodeURIComponent("Płatność nie powiodła się! Spróbuj jeszcze raz")}`,
    });
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
