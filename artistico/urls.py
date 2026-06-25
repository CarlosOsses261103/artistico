from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("puzzle", views.index, name="puzzle"),
    path("obra/<int:obra_id>/", views.obra_redirect, name="obra"),
    path("obra/<int:obra_id>", views.obra_redirect),
    path("api/registro", views.save_gallery_record, name="api_registro"),
    path("api/registro/", views.save_gallery_record),
    path("registro/", views.save_gallery_record, name="registro"),
    path("registro", views.save_gallery_record),
    path(
        "registrar-desbloqueo/",
        views.registrar_desbloqueo_view,
        name="registrar_desbloqueo",
    ),
    path("registrar-desbloqueo", views.registrar_desbloqueo_view),
    path("registrar-usuario/", views.registrar_usuario_view, name="registrar_usuario"),
    path("registrar-usuario", views.registrar_usuario_view),
    path("prueba-sheets", views.prueba_sheets, name="prueba_sheets"),
    path("prueba-sheets/", views.prueba_sheets),
    path("<str:filename>", views.public_root_file, name="public_root_file"),
    path("imagenes/<path:asset_path>", views.public_asset_file, {"directory": "imagenes"}),
    path("images/<path:asset_path>", views.public_asset_file, {"directory": "images"}),
]
