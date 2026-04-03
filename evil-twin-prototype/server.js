const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const fs = require("fs");
const { exec } = require("child_process");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname)));

// Helper to get clean IP
function getClientIp(req) {
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7);
  }
  return ip;
}

// Route for the home page (Captive Portal)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle the "Guest Access" form submission
app.post("/connect", (req, res) => {
  const email = req.body.email;
  const clientIp = getClientIp(req);
  logCapture(email, clientIp);
  console.log(
    `[CAPTIVE PORTAL] New connection request from: ${email} (${clientIp})`,
  );
  completeAuth(email, clientIp, res);
});

// Handle Social Modal redirects
app.get("/connect", (req, res) => {
  const clientIp = getClientIp(req);
  console.log(`[CAPTIVE PORTAL] New social login connection from ${clientIp}`);
  logCapture("Social Login User", clientIp);
  completeAuth("Social User", clientIp, res);
});

// Success Page (Local)
app.get("/success", (req, res) => {
  res.send(`
        <html>
            <head>
                <title>Connected</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 50px; background: #162938; color: white; }
                    h1 { color: #4CAF50; }
                    .box { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="box">
                    <h1>&#10004; Connected</h1>
                    <p>You are now authorized to browse the internet.</p>
                    <p><strong>(Redirecting...)</strong></p>
                </div>
                <script>
                    setTimeout(function() {
                        window.location.href = "https://www.google.com";
                    }, 2000);
                </script>
            </body>
        </html>
    `);
});

function logCapture(data, ip) {
  const timestamp = new Date().toLocaleString();
  const entry = `[${timestamp}] IP: ${ip} | Captured: ${data}\n`;

  fs.appendFile("captures.txt", entry, (err) => {
    if (err) console.error("Error saving to file:", err);
  });
}

function completeAuth(user, ip, res) {
  console.log(`[CAPTIVE PORTAL] Authorizing IP: ${ip} for user: ${user}`);

  // Whitelist the IP in iptables
  exec(
    `sudo iptables -I FORWARD -s ${ip} -j ACCEPT`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`[ERROR] Could not update iptables: ${error.message}`);
      }

      // Wait a moment for rules to apply then redirect
      setTimeout(() => {
        console.log(`[CAPTIVE PORTAL] Access granted. Redirecting...`);
        res.redirect("/success");
      }, 1000);
    },
  );
}

// Mock Social Login Endpoints (Just redirects for now)
app.post("/auth/google", (req, res) => res.redirect("https://www.google.com"));
app.post("/auth/facebook", (req, res) =>
  res.redirect("https://www.facebook.com"),
);

// Catch-all route: Redirect any other request to the captive portal (Standard behavior)
app.use((req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Captive Portal Server running at http://localhost:${PORT}`);
});
