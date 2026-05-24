export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

function fallbackAnswer(question = "") {
  return [
    "Empfehlung: Wenn Nike EU 44 gut passt, ist bei Hoka meistens EU 44 2/3 der beste Startpunkt.",
    "Warum: Hoka fällt je nach Modell etwas anders aus und kann im Vorfuß oder Spann anders sitzen als Nike.",
    "Risiko: Bei breitem Fuß, hohem Spann oder sehr enger Passform lieber EU 45 mitprüfen.",
    "Nächster Schritt: Modell prüfen, Rückgabeoption beachten und bei Laufschuhen nicht zu knapp kaufen.",
    question ? `Ausgangsfrage: ${question}` : ""
  ].filter(Boolean).join("\n\n");
}

export async function POST(req) {
  let body = {};

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const userQuestion =
    body?.frage ||
    body?.Frage ||
    body?.question ||
    body?.prompt ||
    body?.Prompt ||
    body?.abfrage ||
    body?.Abfrage ||
    "Welche Größe soll ich kaufen?";

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || !String(apiKey).startsWith("sk-")) {
      return Response.json(
        {
          success: true,
          mode: "safe_fallback_no_key",
          result: fallbackAnswer(userQuestion)
        },
        { status: 200 }
      );
    }

    const prompt = `
Du bist die KI von AppYourStyle.
Antworte auf Deutsch, klar, kaufberatend und app-tauglich.
Keine erfundenen offiziellen Markenpartnerschaften.
Keine medizinischen Aussagen.

Nutzerfrage:
${safeText(userQuestion)}

Kontextdaten:
${safeText(body, "{}")}

Struktur:
1. Empfehlung
2. Warum
3. Risiko zu eng/zu weit
4. Nächster sinnvoller Schritt
`;

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
              "Du bist AppYourStyle: eine Premium Fashion-, Größen- und Passform-KI. Antworte kurz, sicher, kaufberatend und nutzerfreundlich."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4
      })
    });

    let data = {};
    try {
      data = await openaiResponse.json();
    } catch {
      data = {};
    }

    if (!openaiResponse.ok) {
      return Response.json(
        {
          success: true,
          mode: "safe_fallback_openai_error",
          result: fallbackAnswer(userQuestion),
          error: safeText(data?.error?.message, "OpenAI request failed")
        },
        { status: 200 }
      );
    }

    const result =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      fallbackAnswer(userQuestion);

    return Response.json(
      {
        success: true,
        mode: "openai",
        result: safeText(result, fallbackAnswer(userQuestion))
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: true,
        mode: "safe_fallback_exception",
        result: fallbackAnswer(userQuestion),
        error: safeText(error?.message, "Unknown error")
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      success: true,
      mode: "healthcheck",
      result: "AppYourStyle API ist erreichbar. Bitte POST für KI-Empfehlung nutzen."
    },
    { status: 200 }
  );
}
