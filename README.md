# La IA Somos Nosotros

Proyecto Django para una exposicion interactiva. Los visitantes ingresan su nombre, escuchan la narracion de cada obra y desbloquean piezas para completar el mensaje oculto. El avance se registra en Google Sheets.

## Configuracion local

1. Instala las dependencias:

```powershell
python -m pip install -r requirements.txt
```

2. Crea `.env` desde `.env.example`:

```env
DEBUG=True
SECRET_KEY=coloca_tu_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1,.run.app
CSRF_TRUSTED_ORIGINS=https://tu-servicio.run.app
GOOGLE_SHEET_ID=tu_id_de_google_sheets
GOOGLE_SHEET_TAB=Registro
GOOGLE_SERVICE_ACCOUNT_FILE=guardadobasedatos.json
GOOGLE_SERVICE_ACCOUNT_JSON=
```

3. Deja el JSON de la cuenta de servicio en la raiz del proyecto como `guardadobasedatos.json`.

4. Comparte el Google Sheets con el `client_email` de la cuenta de servicio como Editor.

5. Ejecuta Django:

```powershell
python manage.py runserver
```

Tambien sigue disponible el servidor local anterior:

```powershell
python menu.py runserver
```

6. Abre la aplicacion:

```text
http://127.0.0.1:8000
```

No abras `index.html` directamente si quieres registrar avances, porque Google Sheets necesita pasar por el servidor.

## Google Sheets

La hoja debe tener una pestana llamada `Registro`, o el nombre configurado en `GOOGLE_SHEET_TAB`.

Encabezados esperados:

```text
Nombre usuario
Primera Obra
Segunda Obra
Tercera obra
Cuarta Obra
Quinta Obra
Sexta Obra
Septima Obra
Octava Obra
Novena Obra
Decima Obra
Onceava Obra
Doceava Obra
```

Ruta local de prueba, solo con `DEBUG=True`:

```text
http://127.0.0.1:8000/prueba-sheets
```

## Despliegue en Cloud Run

Cloud Run no debe depender de `guardadobasedatos.json`. En produccion configura el contenido completo del JSON de la cuenta de servicio en la variable `GOOGLE_SERVICE_ACCOUNT_JSON`, idealmente desde Secret Manager.

Variables necesarias:

```env
DEBUG=False
SECRET_KEY=una_secret_key_segura
ALLOWED_HOSTS=.run.app
CSRF_TRUSTED_ORIGINS=https://tu-servicio.run.app
GOOGLE_SHEET_ID=tu_id_de_google_sheets
GOOGLE_SHEET_TAB=Registro
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

Comandos utiles:

```powershell
python manage.py collectstatic --noinput
```

El contenedor usa Gunicorn con:

```text
gunicorn artistico.wsgi:application --bind 0.0.0.0:$PORT
```

Modulo WSGI:

```text
artistico.wsgi:application
```

## Archivos privados

No subas a GitHub:

```text
.env
guardadobasedatos.json
google_credentials.json
service-account*.json
*service*account*.json
credentials*.json
*.pem
*.key
data/galeria_registro.json
```

Estos archivos estan protegidos por `.gitignore` y `.dockerignore`. Si una clave privada fue compartida o subida accidentalmente, revocala en Google Cloud y crea una nueva.
