export default async function handler(req, res) {
  try {
    // Forward the query string exactly as received
    const url = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = `https://translate.google.com/translate_tts${url.search}`;

    const fetchResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Referer: "https://translate.google.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).send("Failed to fetch from Google TTS");
    }

    const arrayBuffer = await fetchResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", fetchResponse.headers.get("content-type") || "audio/mpeg");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Vercel TTS Proxy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
