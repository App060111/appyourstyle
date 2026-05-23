export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    const prompt = `
Du bist die Fashion-KI von AppYourStyle.
Analysiere die Nutzerdaten und Artikel.
Gib eine klare Fashion-Intelligence-Antwort auf Deutsch aus.

Bewerte:
- Größenpassform
- Marken-Fit
- Materialverhalten
- Risiko zu eng / zu weit
- Outfit-Kompatibilität
- Smart-Fit Empfehlung
- nächster sinnvoller Styling-Schritt

USER:
${JSON.stringify(body.user, null, 2)}

ITEMS:
${JSON.stringify(body.items, null, 2)}

Antworte klar, strukturiert und app-tauglich.
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Du bist die KI-Engine von AppYourStyle: Luxury Fashion Stylist, Fit Engine und Outfit Intelligence.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        success: false,
        error: data?.error?.message || "OpenAI request failed",
      });
    }

    return res.status(200).json({
      success: true,
      analysis: data?.choices?.[0]?.message?.content || "Keine KI-Antwort erhalten.",
      result: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
