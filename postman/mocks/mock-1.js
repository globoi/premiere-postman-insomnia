const http = require("http");
const PORT = process.env.PORT || 4500;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // @endpoint GET /health
  if (method === "GET" && url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }
   
   // @endpoint GET /graphql
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (pathname === "/graphql") {
    return pm.mock.sendExample("postman/collections/Jarvis/.resources/get_lives.resources/examples/get_lives.example.yaml", res);
  }

  // @endpoint GET /v1/series/htjdLKSwFN
  if (method === "GET" && pathname === "/v1/series/htjdLKSwFN") {
    return pm.mock.sendExample("postman/collections/webmedia/trilha por campeonato/.resources/by serieId.resources/examples/htjdLKSwFN.example.yaml", res);
  }

    // @endpoint GET /v1/series/htjdLKSwFN/seasons/ZTMJ2hS17V/episodes.json
  if (method === "GET" && pathname === "/v1/series/htjdLKSwFN/seasons/ZTMJ2hS17V/episodes.json") {
    return pm.mock.sendExample("postman/collections/webmedia/trilha por campeonato/.resources/episodes.resources/examples/ZTMJ2hS17V.example.yaml", res);
  }


  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not defined" }));
});

server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});