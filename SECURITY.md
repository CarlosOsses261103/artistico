# Seguridad

Este repositorio puede ser publico, pero las credenciales deben vivir solo en el entorno local o en el servidor de despliegue.

## Nunca publicar

- `.env`
- `guardadobasedatos.json`
- claves `.pem`, `.key`, `.p12` o `.p8`
- archivos locales con datos de visitantes, como `data/galeria_registro.json`

## Google Cloud

Usa una cuenta de servicio con acceso minimo necesario y comparte el Google Sheets solo con el correo `client_email` de esa cuenta.

Si una clave privada se expone, elimina esa clave desde Google Cloud IAM y genera una nueva.
