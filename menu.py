from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
from datetime import datetime, timezone
import errno
import json
import os
import re
import sys
from urllib.parse import urlparse

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


ROOT = Path(__file__).resolve().parent
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000
DATA_DIR = ROOT / "data"
DATABASE_FILE = DATA_DIR / "galeria_registro.json"
MAX_POST_BYTES = 5 * 1024 * 1024

if load_dotenv:
    load_dotenv(ROOT / ".env")


class ExhibitHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        parsed = urlparse(self.path)
        clean_path = parsed.path.rstrip("/") or "/"
        if clean_path == "/api/registro":
            self.save_gallery_record()
            return

        if clean_path == "/registrar-desbloqueo":
            self.registrar_desbloqueo_view()
            return

        if clean_path == "/registrar-usuario":
            self.registrar_usuario_view()
            return

        self.send_error(404, "Ruta no encontrada")

    def do_GET(self):
        parsed = urlparse(self.path)
        clean_path = parsed.path.rstrip("/") or "/"
        if self.is_private_path(parsed.path):
            self.send_error(403, "Archivo privado")
            return

        if clean_path == "/prueba-sheets":
            self.prueba_sheets()
            return

        match = re.fullmatch(r"/obra/(\d+)/?", parsed.path)
        if match:
            self.send_response(302)
            self.send_header("Location", f"/?obra={match.group(1)}")
            self.end_headers()
            return

        super().do_GET()

    def do_HEAD(self):
        parsed = urlparse(self.path)
        if self.is_private_path(parsed.path):
            self.send_error(403, "Archivo privado")
            return

        super().do_HEAD()

    def is_private_path(self, path):
        return path == "/data" or path.startswith("/data/")

    def read_json_payload(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return None, "Content-Length invalido", 400

        if content_length <= 0 or content_length > MAX_POST_BYTES:
            return None, "Registro demasiado grande", 413

        try:
            raw_body = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(raw_body)
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None, "JSON invalido", 400

        if not isinstance(payload, dict):
            return None, "Registro invalido", 400

        return payload, None, 200

    def save_gallery_record(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_error(400, "Content-Length invÃ¡lido")
            return

        if content_length <= 0 or content_length > MAX_POST_BYTES:
            self.send_error(413, "Registro demasiado grande")
            return

        try:
            raw_body = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(raw_body)
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(400, "JSON invÃ¡lido")
            return

        if not isinstance(payload, dict):
            self.send_error(400, "Registro invÃ¡lido")
            return

        payload["savedAt"] = datetime.now(timezone.utc).isoformat()
        DATA_DIR.mkdir(exist_ok=True)
        temp_file = DATABASE_FILE.with_suffix(".tmp")
        temp_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        temp_file.replace(DATABASE_FILE)

        self.send_json({"ok": True})

    def registrar_desbloqueo_view(self):
        payload, error, status = self.read_json_payload()
        if error:
            self.send_json({"ok": False, "error": error}, status)
            return

        nombre_obra = payload.get("obra") or payload.get("nombre_obra")
        nombre_usuario = payload.get("nombre_usuario") or payload.get("usuario")
        if not nombre_obra:
            self.send_json({"ok": False, "error": "Falta el campo 'obra'"}, 400)
            return
        if not nombre_usuario:
            self.send_json({"ok": False, "error": "Falta el nombre del usuario"}, 400)
            return

        try:
            from services.google_sheets import registrar_desbloqueo

            result = registrar_desbloqueo(nombre_usuario, nombre_obra)
            self.send_json(result)
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, 500)

    def registrar_usuario_view(self):
        payload, error, status = self.read_json_payload()
        if error:
            self.send_json({"ok": False, "error": error}, status)
            return

        nombre_usuario = payload.get("nombre_usuario") or payload.get("usuario") or payload.get("nombre")
        if not nombre_usuario:
            self.send_json({"ok": False, "error": "Falta el nombre del usuario"}, 400)
            return

        try:
            from services.google_sheets import registrar_usuario

            result = registrar_usuario(nombre_usuario)
            self.send_json(result)
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, 500)

    def prueba_sheets(self):
        if not is_debug_enabled():
            self.send_error(404, "Ruta no encontrada")
            return

        try:
            from services.google_sheets import registrar_desbloqueo

            result = registrar_desbloqueo("Usuario de prueba", "Primera Obra")
            self.send_json(result)
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, 500)

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def translate_path(self, path):
        parsed = urlparse(path)
        clean_path = parsed.path

        if clean_path in {"/", "/puzzle"}:
            clean_path = "/index.html"

        return str(ROOT / clean_path.lstrip("/"))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def build_parser():
    parser = argparse.ArgumentParser(description="Servidor local para la exposición interactiva.")
    parser.add_argument("command", nargs="?", default="runserver", choices=["runserver"])
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    return parser


def is_debug_enabled():
    return os.getenv("DEBUG", "False").strip().lower() in {"1", "true", "yes", "on"}


def create_server(host, preferred_port):
    last_error = None
    for port in range(preferred_port, preferred_port + 20):
        try:
            return ThreadingHTTPServer((host, port), ExhibitHandler), port
        except OSError as exc:
            last_error = exc
            if exc.errno not in {errno.EADDRINUSE, 10048}:
                raise

    raise RuntimeError(f"No encontré un puerto libre desde {preferred_port} hasta {preferred_port + 19}") from last_error


def main(argv=None):
    args = build_parser().parse_args(argv)
    server, port = create_server(args.host, args.port)
    print(f"Servidor iniciado en http://{args.host}:{port}")
    print("Para detenerlo, presiona Ctrl+C.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")


if __name__ == "__main__":
    main(sys.argv[1:])
