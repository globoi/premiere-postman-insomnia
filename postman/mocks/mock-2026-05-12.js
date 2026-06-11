const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 4501;
const BACKSTAGE_BASE_URL = "https://apis.backstage.globoi.com/api/v2";

// Date constant for finding examples
const TARGET_DATE = "2026-05-12";
const EXAMPLE_SUFFIX = "EM_ANDAMENTO";

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
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // @endpoint GET /tr-transmissao/ge - BackStage match by matchId or video identifier
  if (method === "GET" && pathname === "/tr-transmissao/ge") {
    // Check if filtering by video identifier
    const videoIdentifierFilter = searchParams.get("filter[where][videosTransmissao.video.identifier]");
    if (videoIdentifierFilter) {
      return pm.mock.sendExample("postman/collections/BackStage/tr-transmissao/.resources/match by matchId.resources/examples/2026-05-12 SP EM_ANDAMENTO.example.yaml", res);
    }
    // Default to match ID filter
    return pm.mock.sendExample("postman/collections/BackStage/tr-transmissao/.resources/match by matchId.resources/examples/2026-05-12 EM_ANDAMENTO.example.yaml", res);
  }

  // @endpoint GET /graphql - Jarvis get_lives
  if (method === "GET" && pathname === "/graphql") {
    // Check for affiliateCode filter in variables parameter
    const variablesParam = searchParams.get("variables");
    if (variablesParam) {
      try {
        const variables = JSON.parse(variablesParam);

        // Check if filtersInput is null
        if (variables?.filtersInput === null) {
          return pm.mock.sendExample("postman/collections/Jarvis/.resources/get_lives.resources/examples/2026-05-12 EM_ANDAMENTO null affiliateCode.example.yaml", res);
        }

        const affiliateCode = variables?.filtersInput?.affiliateCode;

        // Route to SP-specific example
        if (affiliateCode === "SP") {
          return pm.mock.sendExample("postman/collections/Jarvis/.resources/get_lives.resources/examples/2026-05-12 SP EM_ANDAMENTO.example.yaml", res);
        }
      } catch (e) {
        // Invalid JSON, fall through to default
      }
    }
    // Default example
    return pm.mock.sendExample("postman/collections/Jarvis/.resources/get_lives.resources/examples/2026-05-12 EM_ANDAMENTO.example.yaml", res);
  }

  // @endpoint GET /health
  if (method === "GET" && pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // Fallback: redirect/proxy everything else to BackStage
  return proxyToBackstage(req, res);
});

server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Serving examples for date: ${TARGET_DATE} ${EXAMPLE_SUFFIX}`);
  console.log(`Proxy fallback: ${BACKSTAGE_BASE_URL || "not configured"}`);
});