export default function ZaraSizeGuidePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#f6f1ea",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e3d7ca",
          borderRadius: "28px",
          padding: "28px",
        }}
      >
        <a href="/" style={{ color: "#6f675f", fontWeight: 700 }}>
          ← Zurück zu AppYourStyle
        </a>

        <h1 style={{ fontSize: "42px", marginTop: "24px" }}>
          Zara Size Guide
        </h1>

        <p style={{ fontSize: "20px", lineHeight: 1.6, color: "#6f675f" }}>
          Zara fällt je nach Schnitt unterschiedlich aus. Bei körpernahen
          Schnitten lieber eine Größe größer prüfen. Bei Oversize-Schnitten
          reicht oft die normale Größe.
        </p>

        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gap: "14px",
          }}
        >
          <div style={card}>
            <strong>Oberteile</strong>
            <p>Regular: normale Größe. Slim/Fitted: eine Größe größer prüfen.</p>
          </div>

          <div style={card}>
            <strong>Hosen</strong>
            <p>
              Bei Jeans und Stoffhosen auf Bundweite und Stretch-Anteil achten.
            </p>
          </div>

          <div style={card}>
            <strong>Kleider</strong>
            <p>
              Bei Brust/Schulter eng geschnittenen Modellen lieber eine Größe
              größer testen.
            </p>
          </div>
        </div>

        <p style={{ marginTop: "28px", color: "#6f675f" }}>
          Hinweis: Dies ist eine allgemeine Orientierung und keine offizielle
          Markenpartnerschaft.
        </p>
      </section>
    </main>
  );
}

const card = {
  background: "#fbfaf8",
  border: "1px solid #e3d7ca",
  borderRadius: "18px",
  padding: "18px",
  fontSize: "18px",
  lineHeight: 1.5,
};
