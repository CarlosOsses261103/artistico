# La IA Somos Nosotros

Proyecto web interactivo para una exposicion de obras sobre inteligencia artificial. Los visitantes ingresan su nombre, escuchan la narracion de cada obra y desbloquean piezas para completar el mensaje oculto.

## Configuracion local

1. Instala las dependencias:

```powershell
python -m pip install -r requirements.txt
```

2. Crea un archivo `.env` tomando como base `.env.example`:

```env
GOOGLE_SHEET_ID=TU_ID_DE_GOOGLE_SHEETS
GOOGLE_SHEET_TAB=Registro
GOOGLE_SERVICE_ACCOUNT_FILE=guardadobasedatos.json
DEBUG=True
```

3. Deja el JSON de la cuenta de servicio en la raiz del proyecto con este nombre:

```text
guardadobasedatos.json
```

4. Comparte el Google Sheets con el `client_email` de la cuenta de servicio como Editor.

5. Ejecuta el servidor:

```powershell
python menu.py runserver
```

Tambien puedes usar:

```powershell
.\iniciar_servidor.bat
```

6. Abre la pagina desde el servidor:

```text
http://127.0.0.1:8000
```

No abras `index.html` directamente, porque el registro en Google Sheets necesita pasar por el servidor.

## Google Sheets

La hoja debe tener una pestana llamada `Registro`, o el nombre que declares en `GOOGLE_SHEET_TAB`.

Los encabezados esperados son:

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

## Archivos privados

No subas a GitHub:

```text
.env
guardadobasedatos.json
google_credentials.json
*.pem
*.key
data/galeria_registro.json
```

Estos archivos ya estan protegidos por `.gitignore`.

Si una clave privada fue compartida o subida accidentalmente, revocala en Google Cloud y crea una nueva.
