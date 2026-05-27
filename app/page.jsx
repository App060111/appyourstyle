"use client";

import { useState } from "react";

const QUICK_PROMPTS = [
  "Welche Größe brauche ich bei Hoka, wenn Nike EU 44 passt?",
  "3 Tage London im Herbst mit Kind.",
  "Was ziehe ich zu einem Rockkonzert an?",
  "Bewerbung als Projektmanager: Was soll ich tragen?",
  "Hochzeit am Abend: Was passt ohne Neukauf?"
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  async function runAI() {
    setResult("Lade Empfehlung...");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query
        })
      });

      const data = await response.json();

      setResult(
        data?.result ||
        "Keine Empfehlung gefunden."
      );
    } catch (error) {
      setResult("Fehler beim Laden der Empfehlung.");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <span className="badge">
          Größen- & Outfit-KI
        </span>

        <h1 className="title">
          Welche Größe?
          <br />
          Was ziehe ich an?
        </h1>

        <p className="subtitle">
          Starte mit einer einfachen Frage.
          AppYourStyle denkt in Größenlogik,
          Situation, Outfitgefühl und sinnvollen Ergänzungen.
        </p>

        <textarea
          className="input"
          placeholder="z. B. Nike Größe 44,5 – was bei Lloyd?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="primaryButton"
          onClick={runAI}
        >
          Empfehlung anzeigen
        </button>

        <div className="quickPrompts">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="promptButton"
              onClick={() => setQuery(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {result && (
        <section className="resultCard">
          <h2>Empfehlung</h2>

          <p className="resultText">
            {result}
          </p>
        </section>
      )}
    </main>
  );
}
