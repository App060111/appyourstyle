function productsFor(query = "") {
  const q = String(query || "").toLowerCase();

  if (q.includes("lloyd") || q.includes("lederschuh")) {
    return [
      { label: "Lloyd Komfortmodell", reason: "als Vergleich bei EU 44,5 / 45 prüfen", url: "#" },
      { label: "Einlegesohle", reason: "hilft bei Zwischengrößen", url: "#" },
      { label: "Schuhspanner", reason: "sinnvoll bei Lederschuhen", url: "#" }
    ];
  }

  if (q.includes("reise") || q.includes("london") || q.includes("kind")) {
    return [
      { label: "Wasserfeste Sneaker", reason: "für viel Laufweg und wechselhaftes Wetter", url: "#" },
      { label: "Leichte Jacke", reason: "für Layering bei kühlen Abenden", url: "#" },
      { label: "Packtasche", reason: "für kurze Reisen mit Kind", url: "#" }
    ];
  }

  return [
    { label: "Komfort-Sneaker", reason: "für Alltag und viel Bewegung", url: "#" },
    { label: "Layering-Jacke", reason: "macht Outfits wetterflexibel", url: "#" },
    { label: "Basic-Hoodie", reason: "kombinierbar mit vielen Looks", url: "#" }
  ];
}

function fallbackAnswer(query = "") {
  const q = String(query || "").toLowerCase();

  if ((q.includes("lloyd") || q.includes("schuh")) && (q.includes("nike") || q.includes("44"))) {
    return "Wenn dir Nike EU 44 oder 44,5 passt, prüfe bei Lloyd zuerst EU 44,5. Falls nur ganze Größen verfügbar sind, ist EU 45 meistens sicherer für Komfort. EU 44 nur wählen, wenn du einen schmalen Fuß hast und der Schuh sehr fest sitzen soll. Bei Lederschuhen nicht zu eng kaufen, da Druckstellen sonst schnell entstehen.";
  }

  if (q.includes("hoka") && q.includes("nike")) {
    return "Wenn Nike EU 44 passt, prüfe bei Hoka meistens EU 44 2/3. Für lange Wege, breiteren Fuß oder mehr Komfort ist EU 45 oft die bessere Wahl.";
  }

  if (q.includes("rockkonzert")) {
    return "Für ein Rockkonzert ist ein robuster, bequemer Look sinnvoll: dunkle Jeans, bequeme Schuhe, Shirt oder Overshirt und eine leichte Jacke.";
  }

  if (q.includes("hochzeit")) {
    return "Für eine Hochzeit zuerst vorhandene Kleidung farblich ordnen. Wähle eine ruhige Grundfarbe und ergänze nur mit Tasche, Schuhen oder Schmuck.";
  }

  return "Empfehlung: Wähle zuerst vorhandene Kleidung und ergänze nur das, was Komfort, Anlasswirkung oder Wettertauglichkeit wirklich verbessert.";
}

export async function GET() {
  return Response.json({ success: true, result: "AppYourStyle API ist bereit." });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body?.query || body?.frage || body?.question || "";
    const apiKey = process.env.OPENAI_API_KEY;

    const fallback = {
      success: true,
      mode: "fallback",
      result: fallbackAnswer(query),
      visualPrompt: `Realistische AppYourStyle-Szene für: ${query || "Größen- und Outfitfrage"}. Fokus: Komfort, Passform, Anlass, Wetter und wenige sinnvolle Ergänzungen.`,
      products: productsFor(query)
    };

    if (!apiKey) return Response.json(fallback);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Du bist AppYourStyle. Antworte auf Deutsch, konkret, kurz und kaufunterstützend. Gib nur normalen Text zurück." },
          { role: "user", content: `Frage: ${query}\nErstelle eine Größen-/Outfit-Empfehlung mit Komfort-Hinweis.` }
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
      products: productsFor(query)
    });
  } catch (error) {
    return Response.json({
      success: true,
      mode: "fallback_exception",
      result: fallbackAnswer(""),
      visualPrompt: "Stabile Fallback-Ausgabe.",
      products: productsFor(""),
      debug: error?.message || "unknown"
    });
  }
}
