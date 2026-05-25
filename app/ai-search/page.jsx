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

const NAV_LINKS = [
  { href: "/", label: "Größe" },
  { href: "/ai-search", label: "Suche" },
  { href: "/KI-Suche", label: "KI" },
  { href: "/Marken", label: "Marken" },
  { href: "/Legal", label: "Legal" }
];

const FOOTER_LINKS = [
  { href: "/FAQ", label: "FAQ" },
  { href: "/Impressum", label: "Impressum" },
  { href: "/Datenschutz", label: "Datenschutz" },
  { href: "/Legal", label: "Legal" },
  { href: "/Marken", label: "Marken" },
  { href: "/Kontakt", label: "Kontakt" },
  { href: "/Über", label: "Über" }
];

function safeText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  try { return JSON.stringify(value, null, 2); } catch { return fallback; }
}

function normalizeProducts(value) {
  if (!Array.isArray(value)) return DEFAULT_PRODUCTS;
  const mapped = value.filter(Boolean).map((item) => ({
    label: safeText(item?.label || item?.name, "Sinnvolle Ergänzung"),
    reason: safeText(item?.reason || item?.why, "passt zur Situation"),
    url: safeText(item?.url, "#")
  })).filter((item) => item.label);
  return mapped.length ? mapped : DEFAULT_PRODUCTS;
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
      const saved = window.localStorage.getItem("appyourstyle_context_memory");
      if (saved) setMemory((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem("appyourstyle_context_memory", JSON.stringify(memory)); } catch {}
  }, [memory]);

  const contextLabel = useMemo(() => {
    const text = String(query || "").toLowerCase();
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
        body: JSON.stringify({ query, frage: query, memory })
      });
      const data = await response.json().catch(() => ({ success: false, result: "Die API hat keine lesbare JSON-Antwort geliefert." }));
      setAnswer(safeText(data?.result || data?.answer || data?.analysis || data?.message, "Keine Antwort erhalten."));
      setVisualPrompt(safeText(data?.visualPrompt || data?.imagePrompt, "Realistische Outfit-Situation mit Wettergefühl, Layering und Komfort."));
      setProducts(normalizeProducts(data?.products));
      if (!response.ok || (data?.mode && data.mode !== "openai")) setNotice("Fallback aktiv: AppYourStyle bleibt stabil, auch wenn die Live-KI nicht antwortet.");
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
          <a href="/" style={styles.logoLink}>AppYourStyle</a>
          <a href="#start" style={styles.pill}>ohne Login starten</a>
        </header>

        <section id="start" style={styles.hero}>
          <div style={styles.badge}>{contextLabel}</div>
          <h1 style={styles.title}>Welche Größe? Was ziehe ich an?</h1>
          <p style={styles.lead}>Starte mit einer einfachen Frage. AppYourStyle denkt in Größenlogik, Situation, Outfitgefühl und sinnvollen Ergänzungen.</p>

          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={5}
            style={styles.textarea}
            placeholder="z. B. Nike Größe 44,5: Was muss ich bei Lloyd Schuhen bestellen?"
          />

          <button type="button" style={styles.ctaSticky} onClick={runAI} disabled={loading}>
            {loading ? "Empfehlung wird erstellt..." : "Empfehlung anzeigen"}
          </button>

          <div style={styles.chips}>
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" style={styles.chip} onClick={() => setQuery(prompt)}>{prompt}</button>
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
        </section>

        {(answer || notice) ? (
          <section style={styles.result}>
            <div style={styles.resultHeader}>
              <div style={styles.badgeDark}>KI-Ergebnis</div>
              <div style={styles.score}>Komfort-Check aktiv</div>
            </div>
            {notice ? <p style={styles.notice}>{safeText(notice)}</p> : null}
            <h2 style={styles.sectionTitle}>Empfehlung</h2>
            <pre style={styles.answerBox}>{safeText(answer, "Keine Antwort")}</pre>

            <div style={styles.visualCard}>
              <div>
                <h2 style={styles.sectionTitle}>KI-Outfitbild / visuelle Richtung</h2>
                <pre style={styles.answerBox}>{safeText(visualPrompt, "Keine visuelle Richtung")}</pre>
              </div>
              <div style={styles.visualMock}><span>Outfitgefühl</span><strong>Layering · Komfort · Kontext</strong></div>
            </div>

            <h2 style={styles.sectionTitle}>Das könnte sinnvoll sein</h2>
            <div style={styles.productGrid}>
              {products.map((product, index) => (
                <a key={`${product.label}-${index}`} href={product.url || "#"} style={styles.productCard}>
                  <strong>{safeText(product.label, "Sinnvolle Ergänzung")}</strong>
                  <span>{safeText(product.reason, "passt zur Situation")}</span>
                </a>
              ))}
            </div>

            <div style={styles.saveBox}>
              <strong>Später speichern?</strong>
              <span>Sobald du echten Mehrwert hast, kann AppYourStyle dein Stilprofil per Google, Apple oder Magic Link sichern. Kein Login-Zwang am Anfang.</span>
            </div>
          </section>
        ) : null}

        <section style={styles.infoGrid}>
          <div style={styles.infoCard}><h2>Größenlogik</h2><p>Markenvergleich, Komfortwahrscheinlichkeit, Passform und Anlass werden zusammengeführt.</p></div>
          <div style={styles.infoCard}><h2>Outfit-Kontext</h2><p>Reise, Wetter, Hochzeit, Konzert oder Bewerbung: AppYourStyle denkt nicht nur in Zahlen.</p></div>
          <div style={styles.infoCard}><h2>Affiliate sinnvoll</h2><p>Ergänzungen erscheinen kontextbezogen: nicht Shopliste, sondern echte Hilfe zur Situation.</p></div>
        </section>

        <footer style={styles.footer}>
          <div style={styles.footerLinks}>
            {FOOTER_LINKS.map((link) => <a key={link.href} href={link.href} style={styles.footerLink}>{link.label}</a>)}
          </div>
          <p style={styles.footerText}>AppYourStyle — KI für Größen, Outfits, Reisen und Anlässe. Keine offizielle Markenpartnerschaft.</p>
        </footer>
      </section>

      <nav style={styles.bottomNav}>
        {NAV_LINKS.map((link) => <a key={link.href} href={link.href} style={styles.bottomLink}>{link.label}</a>)}
      </nav>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f1ea", color: "#101010", fontFamily: "Arial, sans-serif", padding: "28px 18px 120px" },
  shell: { maxWidth: "980px", margin: "0 auto", paddingBottom: "80px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", background: "#fff", border: "1px solid #e3d7ca", borderRadius: "28px", padding: "18px 22px", marginBottom: "28px" },
  logoLink: { margin: 0, fontSize: "30px", fontWeight: 900, color: "#111", textDecoration: "none" },
  pill: { background: "#f3efff", color: "#6b58f4", padding: "12px 16px", borderRadius: "999px", fontWeight: 800, textDecoration: "none" },
  hero: { background: "#fff", border: "1px solid #e3d7ca", borderRadius: "34px", padding: "30px", boxShadow: "0 16px 45px rgba(60,45,30,0.06)" },
  badge: { display: "inline-block", background: "#f3efff", color: "#6b58f4", padding: "10px 16px", borderRadius: "999px", fontWeight: 900, marginBottom: "18px" },
  badgeDark: { display: "inline-block", background: "#111", color: "#fff", padding: "10px 16px", borderRadius: "999px", fontWeight: 900 },
  title: { fontSize: "clamp(42px, 9vw, 68px)", lineHeight: 1.05, margin: "0 0 14px", fontWeight: 900 },
  lead: { fontSize: "clamp(20px, 4.8vw, 28px)", lineHeight: 1.35, color: "#69635d", marginBottom: "22px" },
  textarea: { width: "100%", boxSizing: "border-box", border: "1px solid #ddd1c5", borderRadius: "22px", padding: "18px", fontSize: "19px", resize: "vertical", outline: "none", color: "#111", background: "#fff" },
  ctaSticky: { width: "100%", border: 0, borderRadius: "22px", background: "#101010", color: "#fff", padding: "20px", fontSize: "22px", fontWeight: 900, marginTop: "16px", cursor: "pointer" },
  chips: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" },
  chip: { border: "1px solid #ddd1c5", color: "#111", background: "#fbfaf8", borderRadius: "999px", padding: "12px 16px", cursor: "pointer", fontWeight: 800, fontSize: "15px" },
  memoryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px", marginTop: "18px" },
  input: { border: "1px solid #ddd1c5", borderRadius: "16px", padding: "14px", fontSize: "16px", background: "#fbfaf8", color: "#111" },
  result: { background: "#fff", border: "1px solid #e3d7ca", borderRadius: "34px", padding: "30px", marginTop: "24px", boxShadow: "0 16px 45px rgba(60,45,30,0.06)" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px", flexWrap: "wrap" },
  score: { background: "#f3efff", color: "#6b58f4", padding: "10px 14px", borderRadius: "999px", fontWeight: 800 },
  notice: { color: "#8a5a00", background: "#fff5d8", padding: "12px 14px", borderRadius: "16px" },
  sectionTitle: { fontSize: "25px", margin: "12px 0" },
  answerBox: { fontSize: "18px", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#fff", color: "#111", border: "1px solid #eadfd5", borderRadius: "18px", padding: "16px", fontFamily: "Arial, sans-serif" },
  visualCard: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "18px", background: "#f8f5ff", borderRadius: "26px", padding: "20px", marginTop: "20px" },
  visualMock: { minHeight: "180px", borderRadius: "24px", background: "linear-gradient(135deg, #efe7d8, #c7c0ff)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px", color: "#111" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" },
  productCard: { textDecoration: "none", color: "#111", background: "#fbfaf8", border: "1px solid #e3d7ca", borderRadius: "22px", padding: "18px", display: "flex", flexDirection: "column", gap: "8px" },
  saveBox: { marginTop: "22px", background: "#111", color: "#fff", borderRadius: "22px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "24px" },
  infoCard: { background: "#fff", border: "1px solid #e3d7ca", borderRadius: "24px", padding: "20px", color: "#6f675f" },
  footer: { marginTop: "34px", padding: "32px 0", color: "#6f675f", textAlign: "center" },
  footerLinks: { display: "flex", flexWrap: "wrap", gap: "18px", justifyContent: "center", marginBottom: "18px" },
  footerLink: { color: "#111", textDecoration: "none", fontWeight: 800 },
  footerText: { margin: 0, fontSize: "16px" },
  bottomNav: { position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: "16px", width: "min(92vw, 760px)", background: "rgba(255,255,255,0.95)", border: "1px solid #e3d7ca", borderRadius: "999px", padding: "12px", display: "flex", justifyContent: "space-around", gap: "8px", boxShadow: "0 12px 35px rgba(60,45,30,0.12)", zIndex: 50 },
  bottomLink: { color: "#6f675f", textDecoration: "none", fontWeight: 800, padding: "8px 10px" }
};
