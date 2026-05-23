export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = `
Du bist die KI von AppYourStyle.
Analysiere diese Fashion- und Größenfrage:

${JSON.stringify(body, null, 2)}

Gib:
- Größenempfehlung
- Markenvergleich
- Fit-Empfehlung
- Styling-Tipp
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: "Du bist ein Premium Fashion KI Stylist."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    return Response.json({
      success: true,
      result: data.choices?.[0]?.message?.content || "Keine Antwort"
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}
