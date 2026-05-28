"use client";

import { useState } from "react";

const QUICK_PROMPTS = [
  "Nike gr 44,5 was bei Lloyd?",
  "Welche Größe brauche ich bei Hoka, wenn Nike EU 44 passt?",
  "3 Tage London im Herbst mit Kind.",
  "Was ziehe ich zu einem Rockkonzert an?",
  "Bewerbung als Projektmanager: Was soll ich tragen?",
  "Hochzeit am Abend: Was passt ohne Neukauf?"
];

function safeText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  try { return JSON.stringify(value, null, 2); } catch { return fallback; }
}
function asArray(value) { return Array.isArray(value) ? value : []; }

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [productLinks, setProductLinks] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [result, setResult] = useState("");
  const [visualPrompt, setVisualPrompt] = useState("");
  const [visualStatus, setVisualStatus] = useState("");
  const [outfitItems, setOutfitItems] = useState([]);
  const [products, setProducts] = useState([]);

  async function runAI(customQuery) {
    const finalQuery = customQuery || query;
    if (!finalQuery || !finalQuery.trim()) {
      setResult("Bitte zuerst eine Frage eingeben.");
      setVisualPrompt("");
      setOutfitItems([]);
      setProducts([]);
      return;
    }
    setLoading(true);
    setResult("Lade Empfehlung...");
    setVisualPrompt("");
    setVisualStatus("");
    setOutfitItems([]);
    setProducts([]);
    try {
      const response = await fetch("/api/appyourstyle_ai_endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery, productLinks })
      });
      const data = await response.json().catch(() => ({ result: "Die API hat keine lesbare Antwort geliefert." }));
      setResult(safeText(data?.result || data?.answer || data?.message, "Keine Empfehlung verfügbar."));
      setVisualPrompt(safeText(data?.visualPrompt, "Visualisierung wird vorbereitet."));
      setOutfitItems(asArray(data?.outfitItems));
      setProducts(asArray(data?.products));
      setTimeout(() => {
        const el = document.getElementById("ergebnis");
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
        body: JSON.stringify({ query, result, visualPrompt })
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
    <main style={styles.page}>
      <header style={styles.header}>
        <a href="/" style={styles.logo}>AppYourStyle</a>
        <nav style={styles.nav}>
          <a href="#groesse" style={styles.navLink}>Größe</a>
          <a href="#suche" style={styles.navLink}>Suche</a>
          <a href="#ki" style={styles.navLink}>KI</a>
          <a href="/marken" style={styles.navLink}>Marken</a>
          <a href="/impressum" style={styles.navLink}>Legal</a>
        </nav>
      </header>

      <section style={styles.hero} id="groesse">
        <span style={styles.badge}>Größen- & Outfit-KI</span>
        <h1 style={styles.title}>Welche Größe? Was ziehe ich an?</h1>
        <p style={styles.lead}>AppYourStyle verbindet Größenlogik, Anlassberatung, Outfitgefühl, Produktlinks, visuelle KI-Vorbereitung und sinnvolle Ergänzungen.</p>
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}><strong>Größenlogik</strong><span>Nike, Hoka, Lloyd, Zara und weitere Marken vergleichbar.</span></div>
          <div style={styles.infoCard}><strong>Outfit-Kontext</strong><span>Reise, Konzert, Hochzeit, Bewerbung und Alltag.</span></div>
          <div style={styles.infoCard}><strong>Produktlinks</strong><span>Bis zu 4 Webseiten-/Produktlinks kombinieren.</span></div>
        </div>
      </section>

      <section style={styles.card} id="ki">
        <span style={styles.badge}>AI Fashion Decision</span>
        <h2 style={styles.sectionTitle}>Empfehlung erstellen</h2>
        <textarea style={styles.textarea} rows={6} placeholder="z. B. Nike gr 44,5 was bei Lloyd?" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div style={styles.linkBox}>
          <strong>Optionale Produktlinks</strong>
          <p style={styles.small}>Leer lassen, wenn du nur eine normale Größen- oder Outfitfrage stellen möchtest.</p>
          {productLinks.map((link, index) => (
            <input key={index} style={styles.input} value={link} placeholder={`Produktlink ${index + 1}`} onChange={(event) => {
              const next = [...productLinks]; next[index] = event.target.value; setProductLinks(next);
            }} />
          ))}
        </div>
        <button type="button" style={styles.primaryButton} onClick={() => runAI()} disabled={loading}>
          {loading ? "Empfehlung wird erstellt..." : "Empfehlung anzeigen"}
        </button>
        <div style={styles.quickGrid}>
          {QUICK_PROMPTS.map((prompt) => (
            <button type="button" key={prompt} style={styles.promptButton} onClick={() => { setQuery(prompt); runAI(prompt); }}>{prompt}</button>
          ))}
        </div>
      </section>

      <section style={styles.resultCard} id="ergebnis">
        <h2 style={styles.sectionTitle}>Empfehlung</h2>
        <p style={styles.resultText}>{result || "Gib eine Frage ein und klicke auf „Empfehlung anzeigen“."}</p>
        <div style={styles.visualBox}>
          <h3 style={styles.cardTitle}>KI-Bild / visuelle Richtung</h3>
          <p style={styles.resultText}>{visualPrompt || "Nach der Empfehlung erscheint hier der KI-Bild-Prompt."}</p>
          <button type="button" style={styles.secondaryButton} onClick={prepareVisual} disabled={visualLoading}>
            {visualLoading ? "Visualisierung wird vorbereitet..." : "Visualisierung vorbereiten"}
          </button>
          <div style={styles.visualPlaceholder}>{visualStatus || "KI-Bild vorbereitet"}</div>
        </div>
        {outfitItems.length > 0 ? (
          <div style={styles.sectionGap}>
            <h3 style={styles.cardTitle}>Outfit-Bausteine</h3>
            <div style={styles.grid}>
              {outfitItems.map((item, index) => (
                <div style={styles.itemCard} key={index}><strong>{safeText(item?.name || item?.label, "Outfit-Teil")}</strong><span>{safeText(item?.detail || item?.reason, "passt zur Empfehlung")}</span></div>
              ))}
            </div>
          </div>
        ) : null}
        {products.length > 0 ? (
          <div style={styles.sectionGap}>
            <h3 style={styles.cardTitle}>Das könnte sinnvoll sein</h3>
            <div style={styles.grid}>
              {products.map((product, index) => (
                <a key={index} href={safeText(product?.url, "#")} style={styles.itemCard}><strong>{safeText(product?.label || product?.name, "Ergänzung")}</strong><span>{safeText(product?.reason || product?.why, "passt zur Empfehlung")}</span></a>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section style={styles.card} id="suche">
        <h2 style={styles.sectionTitle}>Strategie</h2>
        <p style={styles.lead}>Größenfrage als Einstieg. Outfit-, Reise- und Anlass-KI als täglicher Nutzen. Produktlinks können später mit Affiliate-Logik verbunden werden.</p>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <a href="/" style={styles.footerLink}>Start</a>
          <a href="/impressum" style={styles.footerLink}>Impressum</a>
          <a href="/datenschutz" style={styles.footerLink}>Datenschutz</a>
          <a href="/marken" style={styles.footerLink}>Marken</a>
        </div>
        <p style={styles.small}>AppYourStyle – KI für Größen, Outfits, Reisen und passende Style-Empfehlungen.</p>
      </footer>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f1ea", color: "#111", padding: "24px", fontFamily: "Arial, Helvetica, sans-serif" },
  header: { maxWidth: "1100px", margin: "0 auto 28px", padding: "22px", borderRadius: "28px", border: "1px solid #e3d7ca", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" },
  logo: { color: "#111", textDecoration: "none", fontWeight: 900, fontSize: "clamp(30px, 6vw, 54px)" },
  nav: { display: "flex", gap: "10px", flexWrap: "wrap" },
  navLink: { color: "#6f675f", textDecoration: "none", fontWeight: 800, padding: "10px 12px", borderRadius: "999px", background: "#fbfaf8" },
  hero: { maxWidth: "1100px", margin: "0 auto 28px", padding: "34px", borderRadius: "34px", border: "1px solid #e3d7ca", background: "#fff" },
  card: { maxWidth: "1100px", margin: "0 auto 28px", padding: "28px", borderRadius: "34px", border: "1px solid #e3d7ca", background: "#fff" },
  resultCard: { maxWidth: "1100px", margin: "0 auto 28px", padding: "28px", borderRadius: "34px", border: "1px solid #e3d7ca", background: "#fff" },
  badge: { display: "inline-block", background: "#f1edff", color: "#6b58f4", padding: "10px 18px", borderRadius: "999px", fontWeight: 900, marginBottom: "18px" },
  title: { fontSize: "clamp(44px, 11vw, 86px)", lineHeight: 1.02, margin: "0 0 20px", fontWeight: 900, letterSpacing: "-0.04em" },
  sectionTitle: { fontSize: "clamp(32px, 7vw, 54px)", lineHeight: 1.08, margin: "0 0 18px", fontWeight: 900 },
  lead: { color: "#6f675f", fontSize: "clamp(20px, 4.5vw, 30px)", lineHeight: 1.35, margin: "0 0 20px" },
  textarea: { width: "100%", minHeight: "170px", boxSizing: "border-box", border: "1px solid #e3d7ca", borderRadius: "24px", padding: "18px", fontSize: "20px", color: "#111", background: "#fff", resize: "vertical" },
  linkBox: { display: "grid", gap: "10px", marginTop: "16px", padding: "16px", borderRadius: "24px", border: "1px solid #e3d7ca", background: "#fbfaf8" },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #e3d7ca", borderRadius: "16px", padding: "14px", fontSize: "16px", background: "#fff" },
  primaryButton: { width: "100%", marginTop: "18px", border: 0, borderRadius: "24px", padding: "22px", background: "#111", color: "#fff", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 900, cursor: "pointer" },
  secondaryButton: { marginTop: "12px", border: 0, borderRadius: "18px", padding: "14px 18px", background: "#111", color: "#fff", fontWeight: 900, cursor: "pointer" },
  quickGrid: { display: "grid", gap: "10px", marginTop: "16px" },
  promptButton: { border: "1px solid #e3d7ca", borderRadius: "999px", background: "#f2f2f2", color: "#111", padding: "13px 16px", fontWeight: 800, cursor: "pointer", fontSize: "16px" },
  resultText: { color: "#3f3934", whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "clamp(18px, 4vw, 24px)", lineHeight: 1.5 },
  visualBox: { marginTop: "20px", padding: "18px", borderRadius: "24px", border: "1px solid #e3d7ca", background: "#f8f5ff" },
  visualPlaceholder: { marginTop: "14px", minHeight: "150px", borderRadius: "20px", background: "linear-gradient(135deg, #efe7d8, #c7c0ff)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontWeight: 900, textAlign: "center" },
  infoGrid: { display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
  infoCard: { display: "flex", flexDirection: "column", gap: "8px", padding: "16px", borderRadius: "18px", border: "1px solid #e3d7ca", background: "#fbfaf8" },
  grid: { display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
  itemCard: { display: "flex", flexDirection: "column", gap: "8px", padding: "16px", borderRadius: "18px", border: "1px solid #e3d7ca", background: "#fbfaf8", color: "#111", textDecoration: "none" },
  cardTitle: { fontSize: "24px", margin: "0 0 10px" },
  sectionGap: { marginTop: "22px" },
  footer: { maxWidth: "1100px", margin: "0 auto", padding: "24px", textAlign: "center" },
  footerLinks: { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "18px", marginBottom: "12px" },
  footerLink: { color: "#6f675f", fontWeight: 900, textDecoration: "none" },
  small: { color: "#6f675f", fontSize: "14px", lineHeight: 1.5 }
};
