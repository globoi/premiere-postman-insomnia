const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 4501;
const BACKSTAGE_BASE_URL = "https://apis.backstage.globoi.com/api/v2";

function proxyToBackstage(req, res) {
  if (!BACKSTAGE_BASE_URL) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: "BACKSTAGE_BASE_URL environment variable is not set",
      })
    );
  }

  const incomingUrl = new URL(req.url, `http://${req.headers.host}`);
  const baseUrl = new URL(BACKSTAGE_BASE_URL);

  const targetUrl = new URL(
    `${baseUrl.pathname.replace(/\/$/, "")}${incomingUrl.pathname}${incomingUrl.search}`,
    baseUrl.origin
  );

  const client = targetUrl.protocol === "https:" ? https : http;

  const proxyReq = client.request(
    targetUrl,
    {
      method: req.method,
      headers: {
        ...req.headers,
        host: targetUrl.host,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Failed to proxy request to BACKSTAGE_BASE_URL",
        message: err.message,
      })
    );
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const { method } = req;
  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsed.pathname;
  const sp = parsed.searchParams;

  // @endpoint GET /health
  if (method === "GET" && pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // @endpoint GET /graphql
  if (method === "GET" && pathname === "/graphql") {
    const variables = sp.get("variables") || "{}";
    let affiliateCode;
    try {
      affiliateCode = JSON.parse(variables)?.filtersInput?.affiliateCode;
    } catch (_) {}
    if (affiliateCode === "SP") {
      return pm.mock.sendExample("postman/collections/Jarvis/.resources/get_lives.resources/examples/2026-07-30 Broadcasts affiliateCode SP.example.yaml", res);
    }
    return pm.mock.sendExample("postman/collections/Jarvis/.resources/get_lives.resources/examples/2026-07-30 Broadcasts affiliateCode RJ.example.yaml", res);
  }

  // @endpoint GET tr-transmissao/ge
  if (method === "GET" && pathname === "tr-transmissao/ge") {
    const matchId = sp.get("filter[where][id_jogo_sde]");
    if (matchId === "346289") {
      return pm.mock.sendExample("postman/collections/BackStage/tr-transmissao/.resources/match by matchId.resources/examples/2026-07-30 tr-transmissao ge filter by id_jogo_sde 346289 Vitoria vs Palmeiras.example.yaml", res);
    }
    if (matchId === "346281") {
      return pm.mock.sendExample("postman/collections/BackStage/tr-transmissao/.resources/match by matchId.resources/examples/2026-07-30 tr-transmissao ge filter by id_jogo_sde 346281 Fluminense vs Bahia.example.yaml", res);
    }
    if (sp.has("filter[where][videosTransmissao.video.identifier]")) {
      return pm.mock.sendExample("postman/collections/BackStage/tr-transmissao/.resources/match by mediaId.resources/examples/2026-07-30 transmissao ge EM_ANDAMENTO mediaId 6942237.example.yaml", res);
    }
  }

  // @endpoint GET premiere-championships/premiere
  if (method === "GET" && pathname === "premiere-championships/premiere") {
    return pm.mock.sendExample("postman/collections/BackStage/premiere-championships/.resources/premiere-1.resources/examples/2026-07-30 get premiere championships.example.yaml", res);
  }

  // Fallback: proxy everything else to BackStage
  return proxyToBackstage(req, res);
});

server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Proxy fallback: ${BACKSTAGE_BASE_URL}`);
});
