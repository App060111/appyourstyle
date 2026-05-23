"use client";

import { useState } from "react";

export default function AISearchPage() {
  const [question, setQuestion] = useState("Welche Größe soll ich bei Hoka kaufen, wenn Nike EU 44 passt?");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");

  async function runAI() {
    setLoading(true);
    setError("");
    setAnswer(null);

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question,
          source: "AppYourStyle AI Suche",
          category: "groesse",
          brands: ["Nike", "Hoka"]
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "KI konnte keine Antwort erzeugen.");
      }

      setAnswer(
  data?.result ||
  data?.analysis ||
  data?.answer ||
  JSON.stringify(data, null, 2)
);;
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px", background: "#f6f3ef", fontFamily: "Arial, sans-serif" }}>
      <section style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px", padding: "24px", borderRadius: "28px", background: "white" }}>
          <h1 style={{ fontSize: "42px", margin: "0 0 12px" }}>AppYourStyle</h1>
          <p style={{ fontSize: "18px", color: "#6d6760" }}>Live KI-Größenberatung mit OpenAI.</p>
        </div>

        <div style={{ padding: "28px", borderRadius: "28px", background: "white", border: "1px solid #e7ded4" }}>
          <span style={{ display: "inline-block", padding: "10px 16px", borderRadius: "999px", background: "#f0ecff", color: "#6d5dfc", fontWeight: 800 }}>
            AI Suche
          </span>

          <h2 style={{ fontSize: "38px", margin: "24px 0 18px" }}>Frage deine Größe.</h2>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
            style={{ width: "100%", boxSizing: "border-box", padding: "18px", borderRadius: "20px", border: "1px solid #ded6cc", fontSize: "18px" }}
          />

          <button
            onClick={runAI}
            disabled={loading}
            style={{ width: "100%", marginTop: "18px", padding: "20px", borderRadius: "22px", border: 0, background: "#000", color: "#fff", fontWeight: 800, fontSize: "18px" }}
          >
            {loading ? "KI analysiert..." : "Empfehlung suchen"}
          </button>

          {error && (
            <div style={{ marginTop: "22px", padding: "18px", borderRadius: "18px", background: "#fff1f1", color: "#9b1c1c" }}>
              Fehler: {error}
            </div>
          )}

          {answer && (
            <div style={{ marginTop: "22px", padding: "22px", borderRadius: "22px", background: "#f4f1ff", whiteSpace: "pre-wrap", fontSize: "17px", lineHeight: 1.55 }}>
              {answer}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
