function fallbackProducts(query = "") {
  const lower = String(query || "").toLowerCase();

  if (lower.includes("kind") || lower.includes("reise") || lower.includes("london") || lower.includes("barcelona")) {
    return [
      { label: "Wasserfeste Sneaker", reason: "für viel Laufweg und wechselhaftes Wetter", url: "#" },
      { label: "Leichte Jacke", reason: "für Layering bei kühlen Abenden", url: "#" },
      { label: "Packtasche", reason: "für kurze Reisen mit Kind", url: "#" },
      { label: "Bequemer Hoodie", reason: "für Reise, Flug und Alltag", url: "#" }
    ];
  }

  if (lower.includes("hochzeit") || lower.includes("braut")) {
    return [
      { label: "Elegante Tasche", reason: "kleine Ergänzung statt komplettem Neukauf", url: "#" },
      { label: "Dezenter Schmuck", reason: "stimmt vorhandene Looks hochwertiger ab", url: "#" },
      { label: "Farblich passende Schuhe", reason: "hilft bei Gruppenharmonie", url: "#" },
      { label: "Leichter Schal", reason: "für Abendtemperaturen und Farbakzent", url: "#" }
    ];
  }

  if (lower.includes("bewerbung") || lower.includes("stelle")) {
    return [
      { label: "Blazer", reason: "hebt vorhandene Basics seriös an", url: "#" },
      { label: "Schlichte Lederschuhe", reason: "wirkt professionell und sicher", url: "#" },
      { label: "Business-Hose", reason: "kombinierbar mit vorhandenen Oberteilen", url: "#" },
      { label: "Dezente Tasche", reason: "unterstützt einen ruhigen Auftritt", url: "#" }
    ];
  }

  return [
    { label: "Komfort-Sneaker", reason: "sinnvoll für Alltag und viel Bewegung", url: "#" },
    { label: "Layering-Jacke", reason: "macht Outfits wetterflexibler", url: "#" },
    { label: "Basic-Hoodie", reason: "kombinierbar mit vielen Looks", url: "#" },
    { label: "Reisehose", reason: "bequem und vielseitig nutzbar", url: "#" }
  ];
}

function fallbackAnswer(query = "") {
  const lower = String(query || "").toLowerCase();

  if (lower.includes("hoka") && lower.includes("nike")) {
    return "Wenn Nike EU 44 passt, prüfe bei Hoka meist EU 44 2/3 oder EU 45. Für normalen Sitz: EU 44 2/3. Für breiteren Fuß, lange Wege oder mehr Komfort: EU 45.";
  }

  if (lower.includes("london") || lower.includes("barcelona") || lower.includes("reise") || lower.includes("tage")) {
    return "Für diese Reise zählt Komfort vor Neukauf: bequeme Schuhe, leichte Jacke, Layering und eine kleine Packlogik. Bei Kind und viel Laufweg sind wasserfeste Schuhe, Hoodie und flexible Jacke sinnvoller als ein rein modischer Look.";
  }

  if (lower.includes("hochzeit") || lower.includes("braut")) {
    return "Für Hochzeit oder Brautjungfern zuerst vorhandene Kleidung farblich ordnen. Ziel: harmonische Farben, gleiche Eleganzstufe und wenige Ergänzungen wie Tasche, Schuhe, Schmuck oder Schal statt komplettem Neukauf.";
  }

  if (lower.includes("bewerbung")) {
    return "Für eine Bewerbung sollte der Look ruhig, gepflegt und zur Branche passend sein. Nutze vorhandene Basics, ergänze bei Bedarf Blazer, schlichte Schuhe oder eine strukturierte Tasche.";
  }

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

    if (!apiKey) {
      return Response.json({ ...fallback, mode: "fallback_no_key" });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Du bist AppYourStyle, eine deutsche KI-Fashion-, Größen- und Kontextplattform. Antworte kurz, konkret, hilfreich und kaufunterstützend. Kein aggressives Verkaufen. Gib immer normalen Text zurück."
          },
          {
            role: "user",
            content:
              `Nutzerfrage: ${query}\nTemporärer Kontext: ${JSON.stringify(memory, null, 2)}\nGib Kurz-Zusammenfassung, Empfehlung, Komfort-/Risiko-Hinweis, visuelle Outfitbeschreibung und sinnvolle Ergänzungen.`
          }
        ],
        temperature: 0.45
      })
    });

    const data = await openaiResponse.json().catch(() => ({}));

    if (!openaiResponse.ok) {
      return Response.json({
        ...fallback,
        mode: "fallback_openai_error",
        debug: data?.error?.message || "OpenAI request failed"
      });
    }

    return Response.json({
      success: true,
      mode: "openai",
      result: String(data?.choices?.[0]?.message?.content || fallback.result),
      visualPrompt: `KI-Bildidee: ${query || "Outfitberatung"} — realistische Szene, Wettergefühl, Layering, Komfort, vorhandene Kleidung, kontextbasierte Ergänzungen.`,
      products: fallbackProducts(query)
    });
  } catch (error) {
    return Response.json({
      success: true,
      mode: "fallback_exception",
      result: fallbackAnswer(""),
      visualPrompt: "Stabile Fallback-Outfitbeschreibung mit Komfort, Layering und Anlassbezug.",
      products: fallbackProducts(""),
      debug: error?.message || "unknown"
    });
  }
}

export async function GET() {
  return Response.json({
    success: true,
    result: "AppYourStyle API ist bereit."
  });
}
