@echo off
setlocal
set "ROOT=%~dp0"
set "BUNDLED_PY=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if exist "%BUNDLED_PY%" (
  "%BUNDLED_PY%" "%ROOT%menu.py" runserver
  exit /b %errorlevel%
)

where py >nul 2>nul
if %errorlevel%==0 (
  py "%ROOT%menu.py" runserver
  exit /b %errorlevel%
)

where python >nul 2>nul
if %errorlevel%==0 (
  python "%ROOT%menu.py" runserver
  exit /b %errorlevel%
)

echo No encontre Python instalado ni el runtime local de Codex.
echo Instala Python o abre el proyecto desde Codex para usar el runtime incluido.
pause
