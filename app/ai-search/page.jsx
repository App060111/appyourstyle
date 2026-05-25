"use client";

import { useEffect, useMemo, useState } from "react";

const QUICK_PROMPTS = [
  "Welche Größe brauche ich bei Hoka, wenn Nike EU 44 passt?",
  "3 Tage London im Herbst mit Kind.",
  "Was ziehe ich zu einem Rockkonzert an?",
  "Bewerbung als Projektmanager: Was soll ich tragen?",
  "Hochzeit am Abend: Was passt ohne Neukauf?"
];

const DEFAULT_PRODUCTS = [
  { label: "Wasserfeste Sneaker", reason: "für viel Laufweg und wechselhaftes Wetter", url: "#" },
  { label: "Leichte Jacke", reason: "für Layering bei kühlen Abenden", url: "#" },
  { label: "Bequemer Hoodie", reason: "komfortabel für Reise und Alltag", url: "#" },
  { label: "Packtasche", reason: "hilft bei kurzen Trips mit Kind", url: "#" }
];

function safeText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  try { return JSON.stringify(value, null, 2); } catch { return fallback; }
}

export default function AppYourStylePage() {
  const [query, setQuery] = useState("Welche Größe brauche ich bei Hoka, wenn Nike EU 44 passt?");
  const [answer, setAnswer] = useState("");
  const [visualPrompt, setVisualPrompt] = useState("");
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [memory, setMemory] = useState({ sizes: "", favoriteColors: "", comfort: "bequem", brands: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("appyourstyle_context_memory");
      if (saved) setMemory((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("appyourstyle_context_memory", JSON.stringify(memory)); } catch {}
  }, [memory]);

  const contextLabel = useMemo(() => {
    const text = query.toLowerCase();
    if (text.includes("hochzeit") || text.includes("braut")) return "Anlass: Hochzeit";
    if (text.includes("bewerbung") || text.includes("stelle")) return "Anlass: Bewerbung";
    if (text.includes("konzert") || text.includes("festival")) return "Anlass: Konzert/Event";
    if (text.includes("reise") || text.includes("tage") || text.includes("london") || text.includes("barcelona")) return "Kontext: Reise";
    return "Größen- & Outfit-KI";
  }, [query]);

  async function runAI() {
    setLoading(true);
    setNotice("");
    setAnswer("");
    setVisualPrompt("");

    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, memory })
      });

      const data = await response.json().catch(() => ({}));
      setAnswer(safeText(data?.result || data?.answer || data?.analysis, "Keine Antwort erhalten."));
      setVisualPrompt(safeText(data?.visualPrompt || data?.imagePrompt, "Realistische Outfit-Situation mit Wettergefühl, Layering und Komfort."));

      if (Array.isArray(data?.products) && data.products.length > 0) {
        setProducts(data.products.map((item) => ({
          label: safeText(item?.label || item?.name, "Sinnvolle Ergänzung"),
          reason: safeText(item?.reason || item?.why, "passt zur Situation"),
          url: safeText(item?.url, "#")
        })));
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }

      if (data?.mode && data.mode !== "openai") setNotice("Fallback aktiv: Die App bleibt stabil, auch wenn die Live-KI nicht antwortet.");
    } catch {
      setNotice("Fallback aktiv: Verbindung konnte nicht erreicht werden.");
      setAnswer("AppYourStyle Empfehlung: Wähle zuerst den bequemsten vorhandenen Look. Bei viel Laufweg oder Reise sind bequeme Schuhe, Layering und wetterfeste Ergänzungen wichtiger als ein komplett neuer Kauf.");
      setVisualPrompt("Komfortabler, wetterangepasster Outfitlook mit vorhandener Kleidung und wenigen sinnvollen Ergänzungen.");
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.logo}>AppYourStyle</h1>
            <p style={styles.subtle}>KI für Größen, Outfits, Reisen und Anlässe</p>
          </div>
          <div style={styles.pill}>ohne Login starten</div>
        </header>

        <section style={styles.hero}>
          <div style={styles.badge}>{contextLabel}</div>
          <h2 style={styles.title}>Welche Größe? Was ziehe ich an?</h2>
          <p style={styles.lead}>Starte mit einer einfachen Frage. AppYourStyle denkt in Größenlogik, Situation, Outfitgefühl und sinnvollen Ergänzungen.</p>

          <textarea value={query} onChange={(event) => setQuery(event.target.value)} rows={5} style={styles.textarea} placeholder="z. B. 4 Tage Barcelona mit Kind oder Welche Größe brauche ich bei Hoka?" />

          <div style={styles.chips}>
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} style={styles.chip} onClick={() => setQuery(prompt)}>{prompt}</button>
            ))}
          </div>

          <div style={styles.memoryGrid}>
            <input style={styles.input} value={memory.sizes} onChange={(e) => setMemory({ ...memory, sizes: e.target.value })} placeholder="Merken: z. B. Nike EU 44" />
            <input style={styles.input} value={memory.favoriteColors} onChange={(e) => setMemory({ ...memory, favoriteColors: e.target.value })} placeholder="Farben: z. B. schwarz, beige" />
            <input style={styles.input} value={memory.brands} onChange={(e) => setMemory({ ...memory, brands: e.target.value })} placeholder="Marken: z. B. Nike, Zara" />
            <select style={styles.input} value={memory.comfort} onChange={(e) => setMemory({ ...memory, comfort: e.target.value })}>
              <option value="bequem">Komfort wichtig</option>
              <option value="stylish">Style wichtiger</option>
              <option value="balanced">ausgeglichen</option>
            </select>
          </div>

          <button style={styles.cta} onClick={runAI} disabled={loading}>{loading ? "Empfehlung wird erstellt..." : "Empfehlung suchen"}</button>
        </section>

        {(answer || notice) && (
          <section style={styles.result}>
            <div style={styles.resultHeader}>
              <div style={styles.badgeDark}>KI-Ergebnis</div>
              <div style={styles.score}>Komfort-Check aktiv</div>
            </div>
            {notice ? <p style={styles.notice}>{notice}</p> : null}
            <h3 style={styles.sectionTitle}>Empfehlung</h3>
            <p style={styles.answer}>{answer}</p>

            <div style={styles.visualCard}>
              <div>
                <h3 style={styles.sectionTitle}>KI-Outfitbild / visuelle Richtung</h3>
                <p style={styles.answer}>{visualPrompt}</p>
              </div>
              <div style={styles.visualMock}>
                <span>Outfitgefühl</span>
                <strong>Layering · Komfort · Kontext</strong>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>Das könnte sinnvoll sein</h3>
            <div style={styles.productGrid}>
              {products.map((product, index) => (
                <a key={`${product.label}-${index}`} href={product.url || "#"} style={styles.productCard}>
                  <strong>{product.label}</strong>
                  <span>{product.reason}</span>
                </a>
              ))}
            </div>
            <div style={styles.saveBox}>
              <strong>Später speichern?</strong>
              <span>Sobald du echten Mehrwert hast, kann AppYourStyle dein Stilprofil per Google, Apple oder Magic Link sichern. Kein Login-Zwang am Anfang.</span>
            </div>
          </section>
        )}
        <footer style={styles.footer}><strong>Strategie:</strong> Größenfrage als Einstieg. Outfit-, Reise- und Anlass-KI als täglicher Nutzen.</footer>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f1ea", color: "#101010", fontFamily: "Arial, sans-serif", padding: "28px" },
  shell: { maxWidth: "980px", margin: "0 auto", paddingBottom: "80px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", background: "#fff", border: "1px solid #e3d7ca", borderRadius: "28px", padding: "18px 22px", marginBottom: "28px" },
  logo: { margin: 0, fontSize: "30px", fontWeight: 900 },
  subtle: { margin: "6px 0 0", color: "#756e66" },
  pill: { background: "#f3efff", color: "#6b58f4", padding: "12px 16px", borderRadius: "999px", fontWeight: 800 },
  hero: { background: "#fff", border: "1px solid #e3d7ca", borderRadius: "34px", padding: "30px", boxShadow: "0 16px 45px rgba(60,45,30,0.06)" },
  badge: { display: "inline-block", background: "#f3efff", color: "#6b58f4", padding: "10px 16px", borderRadius: "999px", fontWeight: 900, marginBottom: "18px" },
  badgeDark: { display: "inline-block", background: "#111", color: "#fff", padding: "10px 16px", borderRadius: "999px", fontWeight: 900 },
  title: { fontSize: "48px", lineHeight: 1.05, margin: "0 0 14px", fontWeight: 900 },
  lead: { fontSize: "20px", lineHeight: 1.45, color: "#69635d", marginBottom: "22px" },
  textarea: { width: "100%", boxSizing: "border-box", border: "1px solid #ddd1c5", borderRadius: "22px", padding: "18px", fontSize: "19px", resize: "vertical", outline: "none" },
  chips: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" },
  chip: { border: "1px solid #ddd1c5", background: "#fbfaf8", borderRadius: "999px", padding: "10px 14px", cursor: "pointer" },
  memoryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px", marginTop: "18px" },
  input: { border: "1px solid #ddd1c5", borderRadius: "16px", padding: "14px", fontSize: "16px", background: "#fbfaf8" },
  cta: { width: "100%", border: 0, borderRadius: "22px", background: "#101010", color: "#fff", padding: "20px", fontSize: "20px", fontWeight: 900, marginTop: "18px", cursor: "pointer" },
  result: { background: "#fff", border: "1px solid #e3d7ca", borderRadius: "34px", padding: "30px", marginTop: "24px", boxShadow: "0 16px 45px rgba(60,45,30,0.06)" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px" },
  score: { background: "#f3efff", color: "#6b58f4", padding: "10px 14px", borderRadius: "999px", fontWeight: 800 },
  notice: { color: "#8a5a00", background: "#fff5d8", padding: "12px 14px", borderRadius: "16px" },
  sectionTitle: { fontSize: "25px", margin: "12px 0" },
  answer: { fontSize: "18px", lineHeight: 1.6, whiteSpace: "pre-wrap" },
  visualCard: { display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(220px, 0.8fr)", gap: "18px", background: "#f8f5ff", borderRadius: "26px", padding: "20px", marginTop: "20px" },
  visualMock: { minHeight: "180px", borderRadius: "24px", background: "linear-gradient(135deg, #efe7d8, #c7c0ff)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px", color: "#111" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" },
  productCard: { textDecoration: "none", color: "#111", background: "#fbfaf8", border: "1px solid #e3d7ca", borderRadius: "22px", padding: "18px", display: "flex", flexDirection: "column", gap: "8px" },
  saveBox: { marginTop: "22px", background: "#111", color: "#fff", borderRadius: "22px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  footer: { color: "#706961", marginTop: "24px", textAlign: "center" }
};
