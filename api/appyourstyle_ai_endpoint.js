export async function POST(req) {
  try {
    const body = await req.json();
    const userQuestion = body?.question || body?.prompt || body?.query || "Welche Größe soll ich kaufen?";

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          success: false,
          error: "OPENAI_API_KEY fehlt in Vercel.",
          mode: "missing_key"
        },
        { status: 500 }
      );
    }

    const prompt = `
Du bist die AppYourStyle-KI.
Antworte auf Deutsch, klar, app-tauglich und kaufberatend.

Nutzerfrage:
${userQuestion}

Kontextdaten:
${JSON.stringify(body, null, 2)}

Gib eine konkrete Antwort mit:
1. Größenempfehlung
2. Passform-Begründung
3. Risiko zu eng/zu weit
4. Nächster sinnvoller Schritt
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Du bist ein Premium Fashion Fit Advisor für AppYourStyle."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return Response.json(
        {
          success: false,
          error: data?.error?.message || "OpenAI request failed",
          mode: "openai_error"
        },
        { status: openaiResponse.status }
      );
    }

    return Response.json({
      success: true,
      mode: "openai_live",
      result: data?.choices?.[0]?.message?.content || "Keine KI-Antwort erhalten."
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error?.message || "Unbekannter Fehler",
        mode: "route_error"
      },
      { status: 500 }
    );
  }
}
