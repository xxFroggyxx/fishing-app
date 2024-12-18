import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const sig: any = req.headers.get("stripe-signature");
  const webhookSecret: any = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = await createClient();

  let event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Błąd weryfikacji webhooka:", err.message);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const { error } = await supabase
        .from("registration")
        .update({
          is_paid: true,
          when_paid: new Date(),
        })
        .eq("id_competition", session.metadata?.id_competition)
        .eq("id_competitor", session.metadata?.id_competitor);

      if (error) {
        console.error(
          "Nie udało się zaktualizować rekordu w Supabase:",
          error.message,
        );
      } else {
        console.log("Rekord został pomyślnie zaktualizowany!");
      }
    } catch (err: any) {
      console.error("Błąd podczas aktualizacji Supabase:", err.message);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
