const http = require("http");
const PORT = process.env.PORT || 4501;

// Date constant for finding examples
const TARGET_DATE = "2026-05-12";
const EXAMPLE_SUFFIX = "EM_ANDAMENTO";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // @endpoint GET /health
  if (method === "GET" && url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  
  // @endpoint GET /graphql - Jarvis get_lives
  if (pathname === "/graphql") {
    const examplePath = `postman/collections/Jarvis/.resources/get_lives.resources/examples/${TARGET_DATE} ${EXAMPLE_SUFFIX}.example.yaml`;
    return pm.mock.sendExample(examplePath, res);
  }

  // @endpoint GET /tr-transmissao/ge - BackStage match by matchId
  if (method === "GET" && pathname === "/tr-transmissao/ge") {
    const examplePath = `postman/collections/BackStage/tr-transmissao/.resources/match by matchId.resources/examples/${TARGET_DATE} ${EXAMPLE_SUFFIX}.example.yaml`;
    return pm.mock.sendExample(examplePath, res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not defined" }));
});

server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Serving examples for date: ${TARGET_DATE} ${EXAMPLE_SUFFIX}`);
});
