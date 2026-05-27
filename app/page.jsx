"use client";

import { useState } from "react";
import AppYourStyleAIWidget from "./Komponenten/AppYourStyleAIWidget";

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
  const [loading, setLoading] = useState(false);

  async function runAI(customQuery) {
    const finalQuery = customQuery || query;

    if (!finalQuery?.trim()) {
      setResult("Bitte zuerst eine Frage eingeben.");
      return;
    }

    setLoading(true);
    setResult("Lade Empfehlung...");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: finalQuery
        })
      });

      const data = await response.json();

      setResult(
        data?.result ||
        "Keine Empfehlung gefunden."
      );
    } catch (error) {
      setResult(
        "Fehler beim Laden der Empfehlung."
      );
    }

    setLoading(false);
  }

  return (
    <main className="page">
     <AppYourStyleAIWidget />
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
          rows={4}
        />

        <button
          className="primaryButton"
          onClick={() => runAI()}
          disabled={loading}
        >
          {loading
            ? "Lade..."
            : "Empfehlung anzeigen"}
        </button>

        {result && (
          <section className="resultCard">
            <h2 className="resultTitle">
              Empfehlung
            </h2>

            <p className="resultText">
              {result}
            </p>
          </section>
        )}

        <div className="quickPrompts">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="promptButton"
              onClick={() => {
                setQuery(prompt);
                runAI(prompt);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footerLinks">
          <a href="/">
            Start
          </a>

          <a href="/impressum">
            Impressum
          </a>

          <a href="/datenschutz">
            Datenschutz
          </a>

          <a href="/marken">
            Marken
          </a>
        </div>

        <p className="legalNote">
          AppYourStyle – KI für Größen,
          Outfit-Empfehlungen und Stilberatung.
        </p>
      </footer>
    </main>
  );
}
