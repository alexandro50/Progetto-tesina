@echo off
REM ============================================================
REM  WorkShift Manager - Avvio completo (Windows)
REM  Avvia: PostgreSQL (Docker), Spring Boot backend, Frontend
REM ============================================================
echo.
echo ============================================
echo   WorkShift Manager - Avvio
echo ============================================
echo.

REM 1) Verifica Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRORE] Docker non e' installato o non e' nel PATH.
    echo          Installa Docker Desktop da https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM 2) Avvia PostgreSQL tramite Docker Compose
echo [1/3] Avvio PostgreSQL (Docker)...
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERRORE] Impossibile avviare PostgreSQL con Docker.
    pause
    exit /b 1
)
echo        PostgreSQL in esecuzione sulla porta 5433.
echo.

REM 3) Avvia il backend Spring Boot
echo [2/3] Avvio backend Spring Boot (porta 8080)...
start "WorkShift Backend" cmd /k "cd /d %~dp0backend_utenti && mvnw spring-boot:run"
echo        Backend in avvio sulla porta 8080...
echo.

REM 4) Avvia il frontend (Vite, porta 5173)
echo [3/3] Avvio frontend React/Vite (porta 5173)...
start "WorkShift Frontend" cmd /k "cd /d %~dp0backend_utenti\src\main\frontend && npm install && npm run dev"
echo        Frontend in avvio sulla porta 5173...
echo.

echo ============================================
echo   FATTO!
echo   Apri il browser su: http://localhost:5173
echo ============================================
echo.
echo * Prima volta? Lancia setup.bat per preparare il DB.
echo * Per spegnere tutto usa stop.bat
echo.
pause
