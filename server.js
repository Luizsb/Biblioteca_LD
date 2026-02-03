const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const ROOT = path.join(__dirname, "dist");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pato";

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
};

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/verify-admin") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { password } = JSON.parse(body || "{}");
        const ok = password && String(password).trim() === ADMIN_PASSWORD;
        res.writeHead(ok ? 200 : 401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  let filePath = path.join(ROOT, req.url === "/" ? "index.html" : req.url.split("?")[0]);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      filePath = path.join(ROOT, "index.html");
      fs.stat(filePath, (e2, s2) => {
        if (e2 || !s2?.isFile()) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        serve(filePath, res);
      });
      return;
    }
    serve(filePath, res);
  });
});

function serve(filePath, res) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || "application/octet-stream";
  res.setHeader("Content-Type", mime);
  fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, () => console.log("Server on", PORT));
