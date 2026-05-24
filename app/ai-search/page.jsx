"use client";

import { useState } from "react";

function toText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch (_) {
    return String(value);
  }
}

export default function AISearchPage() {
  const [question, setQuestion] = useState(
    "Welche Größe soll ich bei Hoka kaufen, wenn Nike EU 44 passt?"
  );
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAI() {
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          frage: question,
          source: "AppYourStyle AI Suche",
          category: "groesse",
          brands: ["Nike", "Hoka"],
        }),
      });

      const data = await response.json().catch(() => ({}));

      const text =
        data?.result ||
        data?.analysis ||
        data?.answer ||
        data?.message ||
        data?.error ||
        "Keine Antwort erhalten.";

      setAnswer(toText(text));
    } catch (err) {
      setError(err?.message || "Unbekannter Fehler");
      setAnswer(
        "AppYourStyle konnte gerade keine Live-Antwort laden. Bitte Seite neu laden und erneut versuchen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#f6f3ef",
        color: "#050505",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "32px",
            padding: "24px",
            borderRadius: "28px",
            background: "white",
            border: "1px solid #e7ded4",
          }}
        >
          <h1 style={{ fontSize: "42px", margin: "0 0 12px" }}>AppYourStyle</h1>
          <p style={{ fontSize: "18px", color: "#6d6760", margin: 0 }}>
            Live KI-Größenberatung mit OpenAI.
          </p>
        </div>

        <div
          style={{
            padding: "28px",
            borderRadius: "28px",
            background: "white",
            border: "1px solid #e7ded4",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "999px",
              background: "#f1edff",
              color: "#6b5cff",
              fontWeight: 800,
              marginBottom: "24px",
            }}
          >
            AI Suche
          </span>

          <h2 style={{ fontSize: "38px", margin: "0 0 24px" }}>
            Frage deine Größe.
          </h2>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "18px",
              borderRadius: "20px",
              border: "1px solid #e0d7cd",
              fontSize: "18px",
              resize: "vertical",
              marginBottom: "16px",
              fontFamily: "inherit",
            }}
          />

          <button
            type="button"
            onClick={runAI}
            disabled={loading}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "22px",
              border: 0,
              background: loading ? "#777" : "#000",
              color: "white",
              fontSize: "20px",
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Empfehlung wird erstellt..." : "Empfehlung suchen"}
          </button>

          {(answer || error) && (
            <div
              style={{
                marginTop: "28px",
                padding: "24px",
                borderRadius: "24px",
                background: "#f7f4ff",
                border: "1px solid #e1d9ff",
              }}
            >
              <h3 style={{ fontSize: "26px", margin: "0 0 14px" }}>
                AppYourStyle Empfehlung
              </h3>

              {error && (
                <p style={{ color: "#8a1f1f", fontWeight: 700 }}>
                  Hinweis: {toText(error)}
                </p>
              )}

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {toText(answer)}
              </pre>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
