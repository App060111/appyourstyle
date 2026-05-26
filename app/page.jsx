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
    setResult("Lade Empfehlung ...");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();

      setResult(data.result || "Keine Antwort gefunden.");
    } catch (error) {
      setResult("Fehler bei der Anfrage.");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">Größen- & Outfit-KI</div>

        <h1>
          Welche Größe?
          <br />
          Was ziehe ich an?
        </h1>

        <p>
          Starte mit einer einfachen Frage.
          AppYourStyle denkt in Größenlogik,
          Situation, Outfitgefühl und sinnvollen Ergänzungen.
        </p>

        <textarea
          className="input"
          rows={5}
          placeholder="z. B. Nike EU 44 → welche Größe bei Hoka?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="primaryButton" onClick={runAI}>
          Empfehlung anzeigen
        </button>
      </section>

      <section className="quickGrid">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item}
            className="quickCard"
            onClick={() => setQuery(item)}
          >
            {item}
          </button>
        ))}
      </section>

      {result && (
        <section className="resultBox">
          <h2>Empfehlung</h2>
          <p>{result}</p>
        </section>
      )}

      <footer className="footer">
        <div className="footerLinks">
          <a href="/">Start</a>
          <a href="/KI-Suche">KI-Suche</a>
          <a href="/Imprint">Impressum</a>
        </div>
      </footer>
    </main>
  );
}
