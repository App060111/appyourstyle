"use client";

import { useState } from "react";

function safeText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "Antwort konnte nicht dargestellt werden.";
  }
}

function localFallback(question) {
  return [
    "Empfehlung: Wenn Nike EU 44 gut passt, ist bei Hoka meistens EU 44 2/3 der beste Startpunkt.",
    "Warum: Hoka kann je nach Modell im Vorfuß, Spann und in der Länge etwas anders sitzen als Nike.",
    "Risiko: Bei breitem Fuß, hohem Spann oder enger Passform zusätzlich EU 45 prüfen.",
    "Nächster Schritt: Modell und Rückgabeoption prüfen; bei Laufschuhen lieber nicht zu knapp wählen.",
    question ? `Ausgangsfrage: ${question}` : ""
  ].filter(Boolean).join("\n\n");
}

export default function AISearchPage() {
  const [frage, setFrage] = useState(
    "Welche Größe soll ich bei Hoka kaufen, wenn Nike EU 44 passt?"
  );
  const [antwort, setAntwort] = useState("");
  const [status, setStatus] = useState("");
  const [laden, setLaden] = useState(false);

  async function runAI() {
    setLaden(true);
    setStatus("AppYourStyle KI analysiert...");
    setAntwort("");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          frage,
          source: "AppYourStyle KI-Suche",
          category: "groesse",
          brands: ["Nike", "Hoka"]
        })
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const text =
        data?.result ||
        data?.analysis ||
        data?.answer ||
        data?.message ||
        data?.error ||
        localFallback(frage);

      setAntwort(safeText(text));
      setStatus(data?.mode ? `Modus: ${safeText(data.mode)}` : "Antwort erhalten");
    } catch (error) {
      setAntwort(localFallback(frage));
      setStatus(`Fallback aktiv: ${safeText(error?.message || "Netzwerkfehler")}`);
    } finally {
      setLaden(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#f6f3ef",
        fontFamily: "Arial, sans-serif",
        color: "#050505"
      }}
    >
      <section style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "32px",
            padding: "24px",
            borderRadius: "28px",
            background: "white",
            border: "1px solid #e7ded3"
          }}
        >
          <h1 style={{ fontSize: "42px", margin: "0 0 12px" }}>AppYourStyle</h1>
          <p style={{ fontSize: "18px", color: "#6d6760", margin: 0 }}>
            Live KI-Größenberatung mit OpenAI und sicherem Fallback.
          </p>
        </div>

        <div
          style={{
            padding: "28px",
            borderRadius: "28px",
            background: "white",
            border: "1px solid #e7ded3"
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "999px",
              background: "#f1edff",
              color: "#6d5df6",
              fontWeight: 800,
              marginBottom: "20px"
            }}
          >
            AI Suche
          </span>

          <h2 style={{ fontSize: "38px", margin: "0 0 20px" }}>
            Frage deine Größe.
          </h2>

          <textarea
            value={frage}
            onChange={(event) => setFrage(event.target.value)}
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "18px",
              borderRadius: "20px",
              border: "1px solid #e7ded3",
              fontSize: "20px",
              resize: "vertical",
              marginBottom: "14px",
              background: "white",
              color: "#050505"
            }}
          />

          <button
            type="button"
            onClick={runAI}
            disabled={laden}
            style={{
              width: "100%",
              border: 0,
              borderRadius: "22px",
              padding: "20px",
              background: "#050505",
              color: "white",
              fontSize: "20px",
              fontWeight: 800,
              cursor: laden ? "not-allowed" : "pointer",
              opacity: laden ? 0.7 : 1
            }}
          >
            {laden ? "KI analysiert..." : "Empfehlung suchen"}
          </button>

          {(antwort || status) && (
            <div
              style={{
                marginTop: "24px",
                padding: "22px",
                borderRadius: "22px",
                background: "#f8f6ff",
                border: "1px solid #e7ded3",
                whiteSpace: "pre-wrap",
                lineHeight: 1.55,
                fontSize: "18px"
              }}
            >
              <h3 style={{ marginTop: 0 }}>AppYourStyle Antwort</h3>
              {status && (
                <p style={{ color: "#6d6760", marginTop: 0 }}>{safeText(status)}</p>
              )}
              <p>{safeText(antwort)}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
