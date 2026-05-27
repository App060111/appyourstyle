export async function GET() {
  return Response.json({
    success: true,
    result: "AppYourStyle Visual API ist bereit.",
    statusText: "Visualisierung wird vorbereitet."
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const visualPrompt = body?.visualPrompt || body?.query || "AppYourStyle Outfit-Visualisierung wird vorbereitet.";

    return Response.json({
      success: true,
      status: "fallback_visual_ready",
      result: "KI-Bild vorbereitet.",
      statusText: "Visualisierung wird vorbereitet.",
      visualPrompt: String(visualPrompt),
      imageUrl: ""
    });
  } catch (error) {
    return Response.json({
      success: true,
      status: "fallback_visual_exception",
      result: "KI-Bild vorbereitet.",
      statusText: "Visualisierung wird vorbereitet.",
      visualPrompt: "AppYourStyle Outfit-Visualisierung wird vorbereitet.",
      imageUrl: "",
      debug: error?.message || "unknown"
    });
  }
}
