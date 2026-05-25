function fallbackProducts(query = "") {
  const lower = String(query || "").toLowerCase();
  if (lower.includes("kind") || lower.includes("reise") || lower.includes("london") || lower.includes("barcelona")) return [
    { label: "Wasserfeste Sneaker", reason: "für viel Laufweg und wechselhaftes Wetter", url: "#" },
    { label: "Leichte Jacke", reason: "für Layering bei kühlen Abenden", url: "#" },
    { label: "Packtasche", reason: "für kurze Reisen mit Kind", url: "#" },
    { label: "Bequemer Hoodie", reason: "für Reise, Flug und Alltag", url: "#" }
  ];
  if (lower.includes("hochzeit") || lower.includes("braut")) return [
    { label: "Elegante Tasche", reason: "kleine Ergänzung statt komplettem Neukauf", url: "#" },
    { label: "Dezenter Schmuck", reason: "stimmt vorhandene Looks hochwertiger ab", url: "#" },
    { label: "Farblich passende Schuhe", reason: "hilft bei Gruppenharmonie", url: "#" },
    { label: "Leichter Schal", reason: "für Abendtemperaturen und Farbakzent", url: "#" }
  ];
  if (lower.includes("lloyd") || lower.includes("schuh")) return [
    { label: "Lloyd Komfortschuhe", reason: "für elegante Alltags- oder Business-Schuhe", url: "#" },
    { label: "Einlegesohlen", reason: "wenn die Zwischengröße nicht exakt passt", url: "#" },
    { label: "Schuhspanner", reason: "hilft bei Lederschuhen und Formstabilität", url: "#" },
    { label: "Pflegecreme", reason: "sinnvoll bei hochwertigen Lederschuhen", url: "#" }
  ];
  return [
    { label: "Komfort-Sneaker", reason: "sinnvoll für Alltag und viel Bewegung", url: "#" },
    { label: "Layering-Jacke", reason: "macht Outfits wetterflexibler", url: "#" },
    { label: "Basic-Hoodie", reason: "kombinierbar mit vielen Looks", url: "#" },
    { label: "Reisehose", reason: "bequem und vielseitig nutzbar", url: "#" }
  ];
}

function fallbackAnswer(query = "") {
  const lower = String(query || "").toLowerCase();
  if ((lower.includes("lloyd") || lower.includes("schuh")) && (lower.includes("nike") || lower.includes("44"))) return "Wenn dir Nike EU 44 oder 44,5 passt, würde ich bei Lloyd je nach Modell meist EU 44,5 prüfen. Falls Lloyd nur ganze Größen anbietet: EU 45 für mehr Komfort, EU 44 nur bei schmalem Fuß und wenn du sehr festen Sitz willst. Bei Lederschuhen lieber nicht zu eng kaufen.";
  if (lower.includes("hoka") && lower.includes("nike")) return "Wenn Nike EU 44 passt, prüfe bei Hoka meist EU 44 2/3 oder EU 45. Für normalen Sitz: EU 44 2/3. Für breiteren Fuß, lange Wege oder mehr Komfort: EU 45.";
  if (lower.includes("reise") || lower.includes("tage")) return "Für diese Reise zählt Komfort vor Neukauf: bequeme Schuhe, leichte Jacke, Layering und eine kleine Packlogik.";
  return "AppYourStyle Empfehlung: Starte mit vorhandener Kleidung und ergänze nur, was Komfort, Wettertauglichkeit oder Anlasswirkung wirklich verbessert.";
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body?.query || body?.frage || body?.question || body?.prompt || "";
    const memory = body?.memory || {};
    const apiKey = process.env.OPENAI_API_KEY;
    const fallback = {
      success: true,
      mode: "fallback",
      result: fallbackAnswer(query),
      visualPrompt: `Realistische AppYourStyle Outfit-Situation: ${query || "Größen- und Outfitberatung"}; berücksichtigt Komfort, Wetter, Anlass, vorhandene Kleidung und wenige sinnvolle Ergänzungen.`,
      products: fallbackProducts(query)
    };
    if (!apiKey) return Response.json({ ...fallback, mode: "fallback_no_key" });

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Du bist AppYourStyle, eine deutsche KI-Fashion-, Größen- und Kontextplattform. Antworte kurz, konkret, hilfreich und kaufunterstützend. Kein aggressives Verkaufen. Gib immer normalen Text zurück." },
          { role: "user", content: `Nutzerfrage: ${query}\nTemporärer Kontext: ${JSON.stringify(memory, null, 2)}\nGib Kurz-Zusammenfassung, Empfehlung, Komfort-/Risiko-Hinweis, visuelle Outfitbeschreibung und sinnvolle Ergänzungen.` }
        ],
        temperature: 0.45
      })
    });
    const data = await openaiResponse.json().catch(() => ({}));
    if (!openaiResponse.ok) return Response.json({ ...fallback, mode: "fallback_openai_error", debug: data?.error?.message || "OpenAI request failed" });
    return Response.json({
      success: true,
      mode: "openai",
      result: String(data?.choices?.[0]?.message?.content || fallback.result),
      visualPrompt: `KI-Bildidee: ${query || "Outfitberatung"} — realistische Szene, Wettergefühl, Layering, Komfort, vorhandene Kleidung, kontextbasierte Ergänzungen.`,
      products: fallbackProducts(query)
    });
  } catch (error) {
    return Response.json({ success: true, mode: "fallback_exception", result: fallbackAnswer(""), visualPrompt: "Stabile Fallback-Outfitbeschreibung mit Komfort, Layering und Anlassbezug.", products: fallbackProducts(""), debug: error?.message || "unknown" });
  }
}

export async function GET() {
  return Response.json({ success: true, result: "AppYourStyle API ist bereit." });
}
