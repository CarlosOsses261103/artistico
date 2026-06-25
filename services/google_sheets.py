from datetime import datetime
import json
import os
from pathlib import Path
import re
import unicodedata


SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
DEFAULT_TAB = "Registro"
DEFAULT_CREDENTIALS_FILE = "guardadobasedatos.json"
USER_HEADER = "Nombre usuario"


def normalize_text(value):
    text = str(value or "")
    text = unicodedata.normalize("NFD", text)
    text = "".join(character for character in text if unicodedata.category(character) != "Mn")
    return re.sub(r"\s+", " ", text).strip().lower()


def column_letter(column_number):
    letters = ""
    while column_number:
        column_number, remainder = divmod(column_number - 1, 26)
        letters = chr(65 + remainder) + letters
    return letters


def get_credentials_path():
    credentials_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", DEFAULT_CREDENTIALS_FILE).strip()
    path = Path(credentials_file)
    if path.is_absolute():
        return path
    return Path(__file__).resolve().parents[1] / path


def get_google_credentials(service_account):
    credentials_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    if credentials_json:
        try:
            credentials_info = json.loads(credentials_json)
        except json.JSONDecodeError as exc:
            raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON no contiene un JSON valido") from exc

        return service_account.Credentials.from_service_account_info(
            credentials_info,
            scopes=SCOPES,
        )

    credentials_path = get_credentials_path()
    if not credentials_path.exists():
        raise RuntimeError(f"No se encontro el archivo de credenciales: {credentials_path}")

    return service_account.Credentials.from_service_account_file(
        str(credentials_path),
        scopes=SCOPES,
    )


def get_sheets_values_resource():
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise RuntimeError(
            "Faltan dependencias de Google Sheets. Ejecuta: pip install -r requirements.txt"
        ) from exc

    sheet_id = os.getenv("GOOGLE_SHEET_ID", "").strip()
    if not sheet_id:
        raise RuntimeError("Falta configurar GOOGLE_SHEET_ID en el archivo .env")

    credentials = get_google_credentials(service_account)
    service = build("sheets", "v4", credentials=credentials)
    return service.spreadsheets().values(), sheet_id


def find_header_index(headers, expected_header):
    expected = normalize_text(expected_header)
    normalized_headers = [normalize_text(header) for header in headers]
    try:
        return normalized_headers.index(expected)
    except ValueError as exc:
        raise ValueError(f"No se encontro la columna '{expected_header}' en Google Sheets") from exc


def get_sheet_rows(sheet_tab, values_resource, sheet_id):
    sheet_range = f"'{sheet_tab}'!A:Z"
    response = values_resource.get(spreadsheetId=sheet_id, range=sheet_range).execute()
    rows = response.get("values", [])
    if not rows:
        raise ValueError(f"La pestana '{sheet_tab}' no tiene encabezados")
    return sheet_range, rows[0], rows


def find_user_row(rows, user_column, nombre_usuario):
    normalized_user = normalize_text(nombre_usuario)
    for row_index, row in enumerate(rows[1:], start=2):
        current_user = row[user_column] if user_column < len(row) else ""
        if normalize_text(current_user) == normalized_user:
            return row_index
    return None


def is_empty_row(row):
    return all(not str(cell or "").strip() for cell in row)


def find_first_empty_row(rows):
    for row_index, row in enumerate(rows[1:], start=2):
        if not row or is_empty_row(row):
            return row_index
    return len(rows) + 1


def get_row_values(rows, row_number, width):
    row_index = row_number - 1
    row = rows[row_index] if row_index < len(rows) else []
    return (row + [""] * width)[:width]


def update_row(values_resource, sheet_id, sheet_tab, row_number, row_values):
    end_column = column_letter(len(row_values))
    values_resource.update(
        spreadsheetId=sheet_id,
        range=f"'{sheet_tab}'!A{row_number}:{end_column}{row_number}",
        valueInputOption="USER_ENTERED",
        body={"values": [row_values]},
    ).execute()


def clear_row(values_resource, sheet_id, sheet_tab, row_number, width):
    end_column = column_letter(width)
    values_resource.clear(
        spreadsheetId=sheet_id,
        range=f"'{sheet_tab}'!A{row_number}:{end_column}{row_number}",
        body={},
    ).execute()


def move_row_to_first_gap(values_resource, sheet_id, sheet_tab, rows, row_number, width):
    first_empty_row = find_first_empty_row(rows)
    if not row_number or first_empty_row >= row_number:
        return row_number

    row_values = get_row_values(rows, row_number, width)
    update_row(values_resource, sheet_id, sheet_tab, first_empty_row, row_values)
    clear_row(values_resource, sheet_id, sheet_tab, row_number, width)
    return first_empty_row


def registrar_usuario(nombre_usuario):
    nombre_usuario = str(nombre_usuario or "").strip()
    if not nombre_usuario:
        raise ValueError("Falta el nombre del usuario")

    sheet_tab = os.getenv("GOOGLE_SHEET_TAB", DEFAULT_TAB).strip() or DEFAULT_TAB
    values_resource, sheet_id = get_sheets_values_resource()
    sheet_range, headers, rows = get_sheet_rows(sheet_tab, values_resource, sheet_id)
    user_column = find_header_index(headers, USER_HEADER)
    width = len(headers)
    target_row_number = find_user_row(rows, user_column, nombre_usuario)

    if target_row_number:
        move_row_to_first_gap(values_resource, sheet_id, sheet_tab, rows, target_row_number, width)
        return {
            "ok": True,
            "accion": "existente",
            "usuario": nombre_usuario,
        }

    new_row = [""] * width
    new_row[user_column] = nombre_usuario
    update_row(values_resource, sheet_id, sheet_tab, find_first_empty_row(rows), new_row)

    return {
        "ok": True,
        "accion": "creado",
        "usuario": nombre_usuario,
    }


def registrar_desbloqueo(nombre_usuario, nombre_obra):
    nombre_usuario = str(nombre_usuario or "").strip()
    nombre_obra = str(nombre_obra or "").strip()

    if not nombre_usuario:
        raise ValueError("Falta el nombre del usuario")
    if not nombre_obra:
        raise ValueError("Falta el nombre de la obra")

    sheet_tab = os.getenv("GOOGLE_SHEET_TAB", DEFAULT_TAB).strip() or DEFAULT_TAB
    values_resource, sheet_id = get_sheets_values_resource()
    sheet_range, headers, rows = get_sheet_rows(sheet_tab, values_resource, sheet_id)
    user_column = find_header_index(headers, USER_HEADER)
    artwork_column = find_header_index(headers, nombre_obra)
    width = len(headers)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    unlocked_text = f"Desbloqueada {timestamp}"

    target_row_number = find_user_row(rows, user_column, nombre_usuario)
    if target_row_number:
        target_row_number = move_row_to_first_gap(values_resource, sheet_id, sheet_tab, rows, target_row_number, width)
        cell = f"'{sheet_tab}'!{column_letter(artwork_column + 1)}{target_row_number}"
        values_resource.update(
            spreadsheetId=sheet_id,
            range=cell,
            valueInputOption="USER_ENTERED",
            body={"values": [[unlocked_text]]},
        ).execute()
        action = "actualizado"
    else:
        new_row = [""] * width
        new_row[user_column] = nombre_usuario
        new_row[artwork_column] = unlocked_text
        update_row(values_resource, sheet_id, sheet_tab, find_first_empty_row(rows), new_row)
        action = "creado"

    return {
        "ok": True,
        "accion": action,
        "usuario": nombre_usuario,
        "obra": headers[artwork_column] if artwork_column < len(headers) else nombre_obra,
    }
