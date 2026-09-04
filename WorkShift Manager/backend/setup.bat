@echo off
REM ============================================================
REM  WorkShift Manager - Prima configurazione (da eseguire 1 volta
REM  su ogni PC nuovo prima di usare start.bat)
REM ============================================================
echo.
echo ============================================
echo   WorkShift Manager - Setup iniziale
echo ============================================
echo.

REM 1) Verifica prerequisiti
echo [1/4] Verifica prerequisiti...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo   [ERRORE] Docker non trovato. Installalo da https://www.docker.com/products/docker-desktop/
)
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo   [AVVISO] 'java' non trovato nel PATH. Serve Java 21.
)
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   [ERRORE] Node.js non trovato. Installalo da https://nodejs.org/
)
echo        Verifica prerequisiti completata.
echo.

REM 2) Avvia e prepara PostgreSQL
echo [2/4] Avvio PostgreSQL (Docker) e attesa inizializzazione...
docker compose up -d
echo        PostgreSQL in esecuzione sulla porta 5433.
echo.

REM 3) Compila il backend
echo [3/4] Compilo il backend Spring Boot...
cd /d "%~dp0backend_utenti"
call mvnw -q compile
if %errorlevel% neq 0 (
    echo   [ERRORE] Compilazione backend fallita.
    pause
    exit /b 1
)
echo        Backend compilato.
echo.

REM 4) Installa le dipendenze del frontend
echo [4/4] Installo le dipendenze del frontend...
cd /d "%~dp0backend_utenti\src\main\frontend"
call npm install
if %errorlevel% neq 0 (
    echo   [ERRORE] Installazione dipendenze frontend fallita.
    pause
    exit /b 1
)
echo        Dipendenze frontend installate.
echo.

echo ============================================
echo   SETUP COMPLETATO!
echo   Ora puoi avviare tutto con start.bat
echo   e registrare l'account da http://localhost:5173/register
echo ============================================
echo.
pause
