"use client";

import { useState } from "react";

const QUICK_PROMPTS = [
  "Nike gr 44,5 was bei Lloyd?",
  "Welche Größe brauche ich bei Hoka, wenn Nike EU 44 passt?",
  "3 Tage London im Herbst mit Kind.",
  "Was ziehe ich zu einem Rockkonzert an?",
  "Hochzeit am Abend, was passt ohne Neukauf?"
];

function safeText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  try { return JSON.stringify(value, null, 2); } catch { return fallback; }
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function AppYourStyleAIWidget() {
  const [query, setQuery] = useState("Nike gr 44,5 was bei Lloyd?");
  const [productLinks, setProductLinks] = useState(["", "", "", ""]);
  const [result, setResult] = useState("");
  const [visualPrompt, setVisualPrompt] = useState("");
  const [outfitItems, setOutfitItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [visualStatus, setVisualStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);

  async function runAI(customQuery) {
    const finalQuery = customQuery || query;

    if (!finalQuery || !finalQuery.trim()) {
      setResult("Bitte zuerst eine Frage eingeben.");
      return;
    }

    setLoading(true);
    setResult("Lade Empfehlung...");
    setVisualPrompt("");
    setOutfitItems([]);
    setProducts([]);
    setVisualStatus("");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery, productLinks })
      });

      const data = await response.json().catch(() => ({
        result: "Die API hat keine lesbare Antwort geliefert."
      }));

      setResult(safeText(data?.result || data?.answer || data?.message, "Keine Empfehlung verfügbar."));
      setVisualPrompt(safeText(data?.visualPrompt, "Visualisierung wird vorbereitet."));
      setOutfitItems(normalizeArray(data?.outfitItems));
      setProducts(normalizeArray(data?.products));

      setTimeout(() => {
        const el = document.getElementById("appyourstyle-ai-result");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setResult("Fehler beim Laden der Empfehlung. Bitte erneut versuchen.");
      setVisualPrompt("Visualisierung wird vorbereitet.");
    } finally {
      setLoading(false);
    }
  }

  async function prepareVisual() {
    setVisualLoading(true);
    setVisualStatus("Visualisierung wird vorbereitet.");

    try {
      const response = await fetch("/api/appyourstyle_visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, visualPrompt, result })
      });

      const data = await response.json().catch(() => ({}));
      setVisualStatus(safeText(data?.statusText || data?.result || data?.visualPrompt, "Visualisierung wird vorbereitet."));
    } catch {
      setVisualStatus("Visualisierung wird vorbereitet.");
    } finally {
      setVisualLoading(false);
    }
  }

  return (
    <section style={styles.wrapper} id="appyourstyle-ai">
      <div style={styles.badge}>AppYourStyle KI</div>
      <h2 style={styles.title}>Welche Größe? Was ziehe ich an?</h2>
      <p style={styles.subtitle}>
        Freie Eingabe, Größenlogik, Outfit-Kontext, Produktlinks und visuelle KI-Vorbereitung.
      </p>

      <textarea
        style={styles.textarea}
        rows={5}
        placeholder="z. B. Nike gr 44,5 was bei Lloyd?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={styles.linkBox}>
        <strong>Optionale Produktlinks</strong>
        <span style={styles.smallText}>Leer lassen, wenn du nur eine normale Frage stellen möchtest.</span>
        {productLinks.map((link, index) => (
          <input
            key={index}
            style={styles.input}
            value={link}
            onChange={(e) => {
              const next = [...productLinks];
              next[index] = e.target.value;
              setProductLinks(next);
            }}
            placeholder={`Produktlink ${index + 1}`}
          />
        ))}
      </div>

      <button type="button" style={styles.primaryButton} onClick={() => runAI()} disabled={loading}>
        {loading ? "Empfehlung wird erstellt..." : "Empfehlung anzeigen"}
      </button>

      <div style={styles.quickGrid}>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            type="button"
            key={prompt}
            style={styles.promptButton}
            onClick={() => {
              setQuery(prompt);
              runAI(prompt);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {result ? (
        <div style={styles.resultCard} id="appyourstyle-ai-result">
          <h3 style={styles.resultTitle}>Empfehlung</h3>
          <p style={styles.resultText}>{safeText(result, "Keine Empfehlung verfügbar.")}</p>

          <div style={styles.visualBox}>
            <h3 style={styles.resultTitle}>KI-Bild / visuelle Richtung</h3>
            <p style={styles.resultText}>{safeText(visualPrompt, "Visualisierung wird vorbereitet.")}</p>
            <button type="button" style={styles.secondaryButton} onClick={prepareVisual} disabled={visualLoading}>
              {visualLoading ? "Visualisierung wird vorbereitet..." : "Visualisierung vorbereiten"}
            </button>
            <div style={styles.imageFallback}>{safeText(visualStatus, "KI-Bild vorbereitet")}</div>
          </div>

          {outfitItems.length ? (
            <div style={styles.gridSection}>
              <h3 style={styles.resultTitle}>Outfit-Bausteine</h3>
              <div style={styles.cardGrid}>
                {outfitItems.map((item, index) => (
                  <div key={index} style={styles.itemCard}>
                    <strong>{safeText(item?.name || item?.label, "Outfit-Teil")}</strong>
                    <span>{safeText(item?.detail || item?.reason, "passt zur Empfehlung")}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {products.length ? (
            <div style={styles.gridSection}>
              <h3 style={styles.resultTitle}>Das könnte sinnvoll sein</h3>
              <div style={styles.cardGrid}>
                {products.map((product, index) => (
                  <a key={index} href={product?.url || "#"} style={styles.itemCard}>
                    <strong>{safeText(product?.label || product?.name, "Ergänzung")}</strong>
                    <span>{safeText(product?.reason || product?.why, "passt zur Empfehlung")}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

const styles = {
  wrapper: { maxWidth: "960px", margin: "28px auto", padding: "28px", borderRadius: "32px", border: "1px solid #e3d7ca", background: "#fff", color: "#111", fontFamily: "Arial, sans-serif" },
  badge: { display: "inline-block", background: "#f3efff", color: "#6b58f4", padding: "10px 16px", borderRadius: "999px", fontWeight: 900, marginBottom: "18px" },
  title: { fontSize: "clamp(36px, 8vw, 64px)", lineHeight: 1.05, margin: "0 0 14px", fontWeight: 900 },
  subtitle: { fontSize: "clamp(18px, 4.5vw, 26px)", lineHeight: 1.35, color: "#6f675f" },
  textarea: { width: "100%", minHeight: "150px", border: "1px solid #e3d7ca", borderRadius: "22px", padding: "18px", fontSize: "20px", lineHeight: 1.35, color: "#111", background: "#fff", resize: "vertical", marginTop: "16px" },
  linkBox: { display: "grid", gap: "10px", marginTop: "16px", padding: "16px", border: "1px solid #e3d7ca", borderRadius: "22px", background: "#fbfaf8" },
  input: { width: "100%", border: "1px solid #e3d7ca", borderRadius: "16px", padding: "14px", fontSize: "16px" },
  primaryButton: { width: "100%", marginTop: "18px", border: 0, borderRadius: "24px", padding: "20px", background: "#111", color: "#fff", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 900, cursor: "pointer" },
  secondaryButton: { border: 0, borderRadius: "18px", padding: "14px 18px", background: "#111", color: "#fff", fontSize: "16px", fontWeight: 900, cursor: "pointer", marginTop: "10px" },
  quickGrid: { display: "grid", gap: "10px", marginTop: "16px" },
  promptButton: { border: "1px solid #e3d7ca", borderRadius: "999px", background: "#f2f2f2", color: "#111", padding: "13px 16px", fontWeight: 800, cursor: "pointer", fontSize: "16px" },
  resultCard: { marginTop: "24px", border: "1px solid #e3d7ca", borderRadius: "28px", padding: "22px", background: "#fff" },
  resultTitle: { fontSize: "26px", margin: "0 0 10px" },
  resultText: { whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "20px", lineHeight: 1.5, color: "#3f3934" },
  visualBox: { marginTop: "22px", padding: "18px", borderRadius: "24px", background: "#f8f5ff", border: "1px solid #e3d7ca" },
  imageFallback: { marginTop: "14px", minHeight: "160px", borderRadius: "20px", background: "linear-gradient(135deg, #efe7d8, #c7c0ff)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontWeight: 900, textAlign: "center" },
  gridSection: { marginTop: "22px" },
  cardGrid: { display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
  itemCard: { display: "flex", flexDirection: "column", gap: "8px", padding: "16px", borderRadius: "18px", border: "1px solid #e3d7ca", background: "#fbfaf8", color: "#111", textDecoration: "none" },
  smallText: { color: "#6f675f", fontSize: "14px" }
};
