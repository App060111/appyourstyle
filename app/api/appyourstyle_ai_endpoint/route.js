export async function POST(req) {
  try {
    const body = await req.json();

    return Response.json({
      success: true,
      result:
        "AppYourStyle KI ist aktiv. Empfehlung: Wenn Nike EU 44 passt, solltest du bei Hoka meist EU 44 2/3 oder EU 45 prüfen, da Hoka je nach Modell etwas anders ausfallen kann."
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}
