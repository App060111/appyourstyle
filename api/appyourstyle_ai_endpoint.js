export const runtime = "nodejs";

function fallbackAnswer(question = "") {
  return [
    "AppYourStyle Empfehlung:",
    "Wenn dir Nike EU 44 gut passt, solltest du bei Hoka meist EU 44 2/3 zuerst prüfen. Falls du breite Füße hast oder zwischen zwei Größen liegst, ist EU 45 die sicherere Wahl.",
    "",
    "Warum:",
    "Hoka fällt je nach Modell etwas anders aus. Laufschuhe sitzen außerdem besser, wenn vorne etwas Platz bleibt.",
    "",
    "Nächster Schritt:",
    "Bestelle bevorzugt EU 44 2/3 und prüfe EU 45 als Alternative, wenn das Modell schmal geschnitten ist.",
  ].join("\n");
}

export async function GET() {
  return Response.json({
    success: true,
    status: "AppYourStyle AI endpoint ready",
  });
}

export async function POST(req) {
  let body = {};

  try {
    body = await req.json();
  } catch (_) {
    body = {};
  }

  const question =
    body?.question ||
    body?.frage ||
    body?.Frage ||
    body?.prompt ||
    "Welche Größe soll ich kaufen?";

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({
      success: true,
      mode: "fallback_no_key",
      result: fallbackAnswer(question),
    });
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Du bist AppYourStyle, eine deutschsprachige Fashion-, Größen- und Passform-KI. Antworte kurz, klar, kaufberatend und app-tauglich.",
          },
          {
            role: "user",
            content: `Nutzerfrage: ${question}\n\nKontext: ${JSON.stringify(body, null, 2)}\n\nGib eine klare Größenempfehlung, eine kurze Begründung und den nächsten sinnvollen Schritt.`,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await openaiResponse.json().catch(() => ({}));

    if (!openaiResponse.ok) {
      return Response.json({
        success: true,
        mode: "fallback_openai_error",
        result: fallbackAnswer(question),
        debug: data?.error?.message || "OpenAI request failed",
      });
    }

    const result =
      data?.choices?.[0]?.message?.content ||
      data?.result ||
      data?.answer ||
      fallbackAnswer(question);

    return Response.json({
      success: true,
      mode: "openai",
      result: String(result),
    });
  } catch (error) {
    return Response.json({
      success: true,
      mode: "fallback_exception",
      result: fallbackAnswer(question),
      debug: error?.message || "Unknown error",
    });
  }
}
