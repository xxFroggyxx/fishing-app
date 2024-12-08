"use client";
import { useState, useLayoutEffect } from "react";

export default function WhatToFish() {
  const [recommendation, setRecommendation] = useState("");

  const fishingRecommendations: Record<number, string> = {
    0: "Styczeń: Wędkowanie pod lodem - okonie, płocie. Trocie w rzekach wpadających do Bałtyku.",
    1: "Luty: Okonie pod lodem, płocie. Trocie nadal aktywne w rzekach.",
    2: "Marzec: Leszcze i płocie na przynęty gruntowe. Trocie kończą swój okres aktywności w rzekach.",
    3: "Kwiecień: Wędkowanie na pstrągi i okonie. Trocie wracają do morza po tarle.",
    4: "Maj: Początek sezonu na szczupaki po 1 maja. Trocie dostępne w przybrzeżnych wodach Bałtyku.",
    5: "Czerwiec: Szczupaki, sandacze, węgorze aktywne po zakończeniu ochrony.",
    6: "Lipiec: Karpie i amury w ciepłych wodach, sandacze na spinning.",
    7: "Sierpień: Sumy i węgorze nocą, bolenie w ruchliwych wodach.",
    8: "Wrzesień: Trocie wracają do rzek na tarło. Szczupaki i sandacze na spinning.",
    9: "Październik: Trocie w okresie ochronnym, czas na duże szczupaki i bolenie.",
    10: "Listopad: Sandacze i szczupaki w chłodnych wodach. Trocie wciąż w okresie ochronnym.",
    11: "Grudzień: Wędkowanie pod lodem - płocie, okonie. Trocie mogą być dostępne po zakończeniu ochrony w niektórych rzekach.",
  };

  useLayoutEffect(() => {
    const currentMonth = new Date().getMonth();
    setRecommendation(fishingRecommendations[currentMonth]);
  }, []);

  const renderRecommendation = () => {
    if (!recommendation) return "Ładowanie..";

    const [month, ...rest] = recommendation.split(":");
    const description = rest.join(":").trim();

    return (
      <>
        <strong>{month}:</strong> {description}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border px-8 py-16">
      <h2 className="text-2xl font-bold">Co polecamy aktualnie wędkować?</h2>
      <p>{renderRecommendation()}</p>
    </div>
  );
}
