"use client";

import { useState } from "react";

function safeText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  try { return JSON.stringify(value, null, 2); } catch { return fallback; }
}

export default function HomePage() {
  const [query, setQuery] = useState("Nike Größe 44,5: Was muss ich bei Lloyd Schuhen bestellen?");
  const [result, setResult] = useState("");
  const [products, setProducts] = useState([]);
  const [visualPrompt, setVisualPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function getRecommendation() {
    setLoading(true);
    setErrorText("");
    setResult("");
    setProducts([]);
    setVisualPrompt("");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setResult(safeText(data?.result, "Keine Empfehlung erhalten."));
      setVisualPrompt(safeText(data?.visualPrompt, ""));
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch {
      setErrorText("Die Empfehlung konnte nicht geladen werden. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <a className="brand" href="/">AppYourStyle</a>
        <a className="loginHint" href="#start">ohne Login starten</a>
      </header>

      <section id="start" className="hero">
        <span className="badge">MVP stabil</span>
        <h1>Welche Größe brauche ich?</h1>
        <p>Gib eine Größen-, Marken-, Outfit- oder Anlassfrage ein. Danach erhältst du eine direkte Empfehlung.</p>

        <textarea
          className="questionBox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={5}
          placeholder="z. B. Nike Größe 44,5: Was muss ich bei Lloyd Schuhen bestellen?"
        />

        <button className="primaryButton" type="button" onClick={getRecommendation} disabled={loading}>
          {loading ? "Empfehlung wird geladen..." : "Empfehlung anzeigen"}
        </button>

        <div className="quickGrid">
          {[
            "Welche Größe brauche ich bei Hoka, wenn Nike EU 44 passt?",
            "3 Tage London im Herbst mit Kind.",
            "Was ziehe ich zu einem Rockkonzert an?",
            "Hochzeit am Abend: Was passt ohne Neukauf?"
          ].map((item) => (
            <button className="quickButton" key={item} type="button" onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      {errorText ? (
        <section className="resultCard error">
          <h2>Hinweis</h2>
          <p>{errorText}</p>
        </section>
      ) : null}

      {result ? (
        <section className="resultCard">
          <h2>Empfehlung</h2>
          <pre>{safeText(result)}</pre>

          {visualPrompt ? (
            <>
              <h2>Visuelle Richtung</h2>
              <pre>{safeText(visualPrompt)}</pre>
            </>
          ) : null}

          {products.length ? (
            <>
              <h2>Das könnte sinnvoll sein</h2>
              <div className="productGrid">
                {products.map((product, index) => (
                  <a className="productCard" href={product?.url || "#"} key={index}>
                    <strong>{safeText(product?.label, "Ergänzung")}</strong>
                    <span>{safeText(product?.reason, "passt zur Empfehlung")}</span>
                  </a>
                ))}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      <footer className="footer">
        <p>AppYourStyle — stabile MVP-Version für Größen- und Outfit-Empfehlungen.</p>
        <div className="footerLinks">
          <a href="/">Start</a>
          <a href="#start">Empfehlung</a>
          <a href="/api/appyourstyle_ai_endpoint">API-Test</a>
        </div>
        <p className="legalNote">Rechtliche Seiten und weitere Navigation werden erst wieder ergänzt, wenn diese Kernfunktion stabil läuft.</p>
      </footer>
    </main>
  );
}
