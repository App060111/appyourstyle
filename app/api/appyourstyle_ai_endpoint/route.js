function clean(value = "") {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function isValidProductLink(link = "") {
  try {
    if (!link || !String(link).trim()) return false;
    const url = new URL(String(link).trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validatedLinks(links) {
  if (!Array.isArray(links)) return [];
  return links.map((link) => String(link || "").trim()).filter(isValidProductLink).slice(0, 4);
}

function fallbackProducts(query = "") {
  const q = clean(query);
  if (q.includes("reise") || q.includes("london") || q.includes("kind")) {
    return [
      { label: "Wasserfeste Sneaker", reason: "für viel Laufweg und wechselhaftes Wetter", url: "#" },
      { label: "Leichte Jacke", reason: "für Layering bei kühlen Abenden", url: "#" },
      { label: "Packtasche", reason: "für kurze Reisen mit Kind", url: "#" }
    ];
  }
  if (q.includes("hochzeit") || q.includes("braut")) {
    return [
      { label: "Dezente Tasche", reason: "wertet vorhandene Kleidung auf", url: "#" },
      { label: "Farblich passende Schuhe", reason: "für harmonische Gruppenlooks", url: "#" },
      { label: "Schal oder Stola", reason: "für Abendtemperatur und Farbakzent", url: "#" }
    ];
  }
  return [
    { label: "Komfort-Sneaker", reason: "für Alltag und viel Bewegung", url: "#" },
    { label: "Layering-Jacke", reason: "macht Outfits wetterflexibel", url: "#" },
    { label: "Basic-Hoodie", reason: "kombinierbar mit vielen Looks", url: "#" }
  ];
}

function fallbackOutfitItems(query = "") {
  const q = clean(query);
  if (q.includes("rockkonzert") || q.includes("konzert")) {
    return [
      { name: "Dunkle Jeans", detail: "robust und passend zum Konzertkontext" },
      { name: "Bequeme Sneaker oder Boots", detail: "wichtig für langes Stehen" },
      { name: "Overshirt oder leichte Jacke", detail: "Layering ohne zu warm zu werden" }
    ];
  }
  if (q.includes("reise") || q.includes("london") || q.includes("kind")) {
    return [
      { name: "Bequeme Schuhe", detail: "Priorität bei viel Laufweg" },
      { name: "Leichte Jacke", detail: "für wechselhaftes Wetter" },
      { name: "Hoodie oder Layering-Teil", detail: "komfortabel für Reise und Kind" }
    ];
  }
  return [
    { name: "Hauptteil", detail: "passend zur Anfrage wählen" },
    { name: "Schuhe", detail: "Komfort und Anlass prüfen" },
    { name: "Ergänzung", detail: "nur kaufen, wenn sie den Look wirklich verbessert" }
  ];
}

function fallbackAnswer(query = "", links = []) {
  const q = clean(query);
  if ((q.includes("lloyd") || q.includes("loyd") || q.includes("schuh") || q.includes("schuhe")) && (q.includes("nike") || q.includes("44") || q.includes("44,5") || q.includes("44.5") || q.includes("gr") || q.includes("größe"))) {
    return "Wenn dir Nike EU 44 oder 44,5 passt, prüfe bei Lloyd zuerst EU 44,5. Falls Lloyd nur ganze Größen anbietet, ist EU 45 meist sicherer für Komfort. EU 44 nur wählen, wenn du einen schmalen Fuß hast und der Schuh sehr fest sitzen soll. Bei Lederschuhen lieber nicht zu eng kaufen.";
  }
  if (q.includes("hoka") && (q.includes("nike") || q.includes("44"))) {
    return "Wenn Nike EU 44 passt, prüfe bei Hoka meist EU 44 2/3. Für lange Wege, breiteren Fuß oder mehr Komfort ist EU 45 oft die bessere Wahl.";
  }
  if (q.includes("rockkonzert") || q.includes("konzert")) {
    return "Für ein Rockkonzert empfehle ich einen robusten, bequemen Look: dunkle Jeans, bequeme Sneaker oder Boots, Shirt/Overshirt und leichte Jacke. Wichtig sind Beweglichkeit, sichere Taschen und unempfindliche Materialien.";
  }
  if (q.includes("hochzeit") || q.includes("braut")) {
    return "Für eine Hochzeit zuerst vorhandene Kleidung farblich ordnen. Wähle eine ruhige Grundfarbe und ergänze nur gezielt mit Tasche, Schuhen oder Schmuck. Ziel ist harmonisch, nicht komplett neu.";
  }
  if (q.includes("london") || q.includes("reise") || q.includes("tage") || q.includes("kind")) {
    return "Für Reise und Kind zählt Komfort: bequeme Schuhe, Layering, wetterfeste Jacke und wenige kombinierbare Teile. Plane lieber 2–3 flexible Outfits als zu viele Einzelteile.";
  }
  if (links.length) {
    return "Die eingegebenen Produktlinks wurden berücksichtigt. AppYourStyle bewertet sie als Outfit-Kombination nach Stil, Anlass, Farbe, Komfort und sinnvollen Ergänzungen. Ungültige oder leere Links werden ignoriert.";
  }
  return "Empfehlung: Wähle zuerst vorhandene Kleidung und ergänze nur das, was Komfort, Anlasswirkung oder Wettertauglichkeit wirklich verbessert.";
}

function visualPromptFor(query = "", links = []) {
  const linkHint = links.length ? `Berücksichtige ${links.length} Produktlinks als Outfit-Bausteine.` : "Berücksichtige vorhandene Kleidung und sinnvolle Ergänzungen.";
  return `AppYourStyle Outfit-Visualisierung: ${query || "Fashion- und Größenberatung"}. ${linkHint} Realistische Fashion-Szene, klare Silhouette, Anlassbezug, Komfort, Layering, harmonische Farben.`;
}

export async function GET() {
  return Response.json({
    success: true,
    result: "AppYourStyle API ist bereit.",
    visualPrompt: "API-Test erfolgreich.",
    outfitItems: [],
    products: []
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body?.query || body?.frage || body?.question || "";
    const links = validatedLinks(body?.productLinks);
    const apiKey = process.env.OPENAI_API_KEY;

    const fallback = {
      success: true,
      mode: "fallback",
      result: fallbackAnswer(query, links),
      visualPrompt: visualPromptFor(query, links),
      outfitItems: fallbackOutfitItems(query),
      products: fallbackProducts(query)
    };

    if (!apiKey) return Response.json(fallback);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Du bist AppYourStyle. Antworte auf Deutsch, konkret, hilfreich, fashionbezogen und kaufunterstützend. Keine aggressiven Verkäufe. Gib normalen Text zurück." },
          { role: "user", content: `Frage: ${query}\nProduktlinks: ${JSON.stringify(links)}\nErstelle: Größen-/Outfit-Empfehlung, Komfort-Hinweis, Anlassbezug, Visual-Prompt und sinnvolle Ergänzungen.` }
        ],
        temperature: 0.4
      })
    });

    const data = await openaiResponse.json().catch(() => ({}));

    if (!openaiResponse.ok) {
      return Response.json({ ...fallback, mode: "fallback_openai_error", debug: data?.error?.message || "OpenAI request failed" });
    }

    return Response.json({
      success: true,
      mode: "openai",
      result: String(data?.choices?.[0]?.message?.content || fallback.result),
      visualPrompt: fallback.visualPrompt,
      outfitItems: fallback.outfitItems,
      products: fallback.products
    });
  } catch (error) {
    return Response.json({
      success: true,
      mode: "fallback_exception",
      result: fallbackAnswer(""),
      visualPrompt: "Visualisierung wird vorbereitet.",
      outfitItems: fallbackOutfitItems(""),
      products: fallbackProducts(""),
      debug: error?.message || "unknown"
    });
  }
}
