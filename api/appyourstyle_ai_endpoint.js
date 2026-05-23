export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const body = req.body;

    const prompt = `
    Du bist die KI von AppYourStyle.

    Analysiere:
    - Größenpassform
    - Materialverhalten
    - Brand-Fit
    - Outfit-Harmonie
    - Risiko zu eng/weit
    - Stil-Kompatibilität

    USER:
    ${JSON.stringify(body.user)}

    ITEMS:
    ${JSON.stringify(body.items)}

    Antworte als JSON.
    `;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-4o-mini",

          messages: [
            {
              role: "system",
              content:
                "Du bist die KI-Engine von AppYourStyle."
            },

            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.7
        })
      }
    );

    const data = await openaiResponse.json();

    return res.status(200).json({
      success: true,
      result: data
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}
