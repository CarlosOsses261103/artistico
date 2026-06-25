import json
import mimetypes
from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponseNotFound, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST


DATA_DIR = settings.BASE_DIR / "data"
DATABASE_FILE = DATA_DIR / "galeria_registro.json"
MAX_POST_BYTES = 5 * 1024 * 1024
PUBLIC_ROOT_FILES = {
    "styles.css",
    "script.js",
    "ia_central.png",
    "captura-voz-ia.png",
    "captura-objetivo-completado.png",
}
PUBLIC_DIRECTORIES = {
    "imagenes": settings.BASE_DIR / "imagenes",
    "images": settings.BASE_DIR / "images",
}


@ensure_csrf_cookie
def index(request):
    return render(request, "index.html")


def obra_redirect(request, obra_id):
    return redirect(f"/?obra={obra_id}")


def read_json_payload(request):
    try:
        content_length = int(request.headers.get("Content-Length") or len(request.body) or 0)
    except ValueError:
        return None, "Content-Length invalido", 400

    if content_length <= 0 or content_length > MAX_POST_BYTES:
        return None, "Registro demasiado grande", 413

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None, "JSON invalido", 400

    if not isinstance(payload, dict):
        return None, "Registro invalido", 400

    return payload, None, 200


@csrf_exempt
@require_POST
def save_gallery_record(request):
    payload, error, status = read_json_payload(request)
    if error:
        return JsonResponse({"ok": False, "error": error}, status=status)

    payload["savedAt"] = datetime.now(timezone.utc).isoformat()
    DATA_DIR.mkdir(exist_ok=True)
    temp_file = DATABASE_FILE.with_suffix(".tmp")
    temp_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temp_file.replace(DATABASE_FILE)

    return JsonResponse({"ok": True})


@require_POST
def registrar_desbloqueo_view(request):
    payload, error, status = read_json_payload(request)
    if error:
        return JsonResponse({"ok": False, "error": error}, status=status)

    nombre_obra = payload.get("obra") or payload.get("nombre_obra")
    nombre_usuario = payload.get("nombre_usuario") or payload.get("usuario")
    if not nombre_obra:
        return JsonResponse({"ok": False, "error": "Falta el campo 'obra'"}, status=400)
    if not nombre_usuario:
        return JsonResponse({"ok": False, "error": "Falta el nombre del usuario"}, status=400)

    try:
        from services.google_sheets import registrar_desbloqueo

        result = registrar_desbloqueo(nombre_usuario, nombre_obra)
    except Exception as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=500)

    return JsonResponse(result)


@require_POST
def registrar_usuario_view(request):
    payload, error, status = read_json_payload(request)
    if error:
        return JsonResponse({"ok": False, "error": error}, status=status)

    nombre_usuario = payload.get("nombre_usuario") or payload.get("usuario") or payload.get("nombre")
    if not nombre_usuario:
        return JsonResponse({"ok": False, "error": "Falta el nombre del usuario"}, status=400)

    try:
        from services.google_sheets import registrar_usuario

        result = registrar_usuario(nombre_usuario)
    except Exception as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=500)

    return JsonResponse(result)


@require_GET
def prueba_sheets(request):
    if not settings.DEBUG:
        return HttpResponseNotFound("Ruta no encontrada")

    try:
        from services.google_sheets import registrar_desbloqueo

        result = registrar_desbloqueo("Usuario de prueba", "Primera Obra")
    except Exception as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=500)

    return JsonResponse(result)


def public_root_file(request, filename):
    if filename not in PUBLIC_ROOT_FILES:
        raise Http404("Archivo no encontrado")
    return file_response(settings.BASE_DIR / filename)


def public_asset_file(request, directory, asset_path):
    base_dir = PUBLIC_DIRECTORIES.get(directory)
    if not base_dir:
        raise Http404("Archivo no encontrado")

    target = safe_join(base_dir, asset_path)
    return file_response(target)


def safe_join(base_dir, relative_path):
    base_path = Path(base_dir).resolve()
    target_path = (base_path / relative_path).resolve()
    try:
        target_path.relative_to(base_path)
    except ValueError as exc:
        raise Http404("Archivo no encontrado") from exc
    return target_path


def file_response(path):
    if not path.is_file():
        raise Http404("Archivo no encontrado")

    content_type, _ = mimetypes.guess_type(str(path))
    response = FileResponse(path.open("rb"), content_type=content_type or "application/octet-stream")
    response["Cache-Control"] = "no-store"
    return response
