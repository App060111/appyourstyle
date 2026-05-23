"use client";

import { useState } from "react";

export default function AISearchPage() {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  const runAI = async () => {
    setLoading(true);
    setError("");
    setAiResult(null);

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            gender: "unknown",
            height_cm: 180,
            weight_kg: 80,
            body_shape: "normal",
            fit_preference: "balanced",
            style: ["modern", "clean", "wearable"],
          },
          items: [
            {
              type: "pants",
              brand: "Zara",
              store: "Zara",
              size_selected: "M",
              product_url: "",
            },
            {
              type: "top",
              brand: "Nike",
              store: "Nike",
              size_selected: "M",
              product_url: "",
            },
            {
              type: "shoes",
              brand: "New Balance",
              store: "New Balance",
              size_selected: "44",
              product_url: "",
            },
            {
              type: "jacket",
              brand: "BOSS",
              store: "BOSS",
              size_selected: "M",
              product_url: "",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("AppYourStyle KI konnte nicht erreicht werden.");
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      setError(err.message || "Unbekannter KI-Fehler");
    } finally {
      setLoading(false);
    }
  };

  const content = aiResult?.analysis || aiResult?.result?.choices?.[0]?.message?.content || aiResult?.result || aiResult;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "linear-gradient(180deg, #f5f2fb 0%, #faf9f6 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#050505",
      }}
    >
      <section
        style={{
          maxWidth: "920px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "32px",
            padding: "28px",
            marginBottom: "36px",
            border: "1px solid #e6ddcf",
          }}
        >
          <h1 style={{ fontSize: "48px", lineHeight: "0.95", margin: 0 }}>
            AppYourStyle AI
          </h1>
          <p style={{ fontSize: "20px", color: "#746f68", marginTop: "18px" }}>
            Starte die Fashion-KI für Größenanalyse, Outfit-Kompatibilität und Smart-Fit-Empfehlung.
          </p>

          <button
            onClick={runAI}
            disabled={loading}
            style={{
              marginTop: "20px",
              padding: "18px 26px",
              borderRadius: "18px",
              border: "none",
              background: loading ? "#777" : "#050505",
              color: "white",
              fontSize: "17px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "AI analysiert Passform..." : "AI Fashion Analyse starten"}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#fff1f1",
              border: "1px solid #ffd0d0",
              borderRadius: "22px",
              padding: "22px",
              marginBottom: "24px",
              color: "#9b1c1c",
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        {aiResult && (
          <div
            style={{
              background: "white",
              borderRadius: "32px",
              padding: "30px",
              border: "1px solid #e6ddcf",
              boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: "999px",
                background: "#f0ecff",
                color: "#6d5dfb",
                fontWeight: 900,
                marginBottom: "22px",
              }}
            >
              AI Fashion Intelligence
            </div>

            <h2 style={{ fontSize: "38px", lineHeight: "1", margin: "0 0 22px" }}>
              Dein Outfit wurde analysiert.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "22px",
              }}
            >
              <div style={{ background: "#fafafa", borderRadius: "22px", padding: "20px" }}>
                <h3>Größenbewertung</h3>
                <p>Nike/Zara/BOSS werden nach Fit, Kategorie und Materialrisiko bewertet.</p>
              </div>

              <div style={{ background: "#fafafa", borderRadius: "22px", padding: "20px" }}>
                <h3>Outfit-Kompatibilität</h3>
                <p>Die Kombination wird nach Silhouette, Farbe und Stilwirkung geprüft.</p>
              </div>

              <div style={{ background: "#fafafa", borderRadius: "22px", padding: "20px" }}>
                <h3>Smart Fit</h3>
                <p>Die KI erkennt Größenrisiken zwischen Labels und Shops.</p>
              </div>
            </div>

            <div
              style={{
                background: "#111",
                color: "white",
                padding: "22px",
                borderRadius: "24px",
                marginBottom: "20px",
              }}
            >
              <strong>Live KI-Antwort</strong>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  marginTop: "16px",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              >
                {typeof content === "string" ? content : JSON.stringify(content, null, 2)}
              </pre>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ background: "#050505", color: "white", padding: "13px 16px", borderRadius: "14px", fontWeight: 800 }}>
                Outfit Score aktiv
              </span>
              <span style={{ background: "#f0ecff", color: "#6d5dfb", padding: "13px 16px", borderRadius: "14px", fontWeight: 800 }}>
                OpenAI verbunden
              </span>
              <span style={{ background: "#f7f3ed", color: "#6f675d", padding: "13px 16px", borderRadius: "14px", fontWeight: 800 }}>
                Smart-Link vorbereitet
              </span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
