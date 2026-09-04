@echo off
REM ============================================================
REM  WorkShift Manager - Arresto completo (Windows)
REM  Ferma: Frontend, Backend, PostgreSQL (Docker)
REM ============================================================
echo.
echo Sto fermando i servizi di WorkShift Manager...
echo.

REM 1) Ferma PostgreSQL e i container Docker
echo [1/2] Fermo PostgreSQL (Docker)...
docker compose down
if %errorlevel% neq 0 (
    echo        (Nessun container Docker da fermare o Docker non attivo)
)

REM 2) Prompt per chi usa PostgreSQL nativo di Windows (non Docker)
echo.
echo [2/2] Nota: se usi PostgreSQL installato nativamente su Windows
echo        (non Docker), fermalo manualmente con:
echo.
echo        net stop postgresql-x64-18
echo.
echo ============================================
echo   ARRESTO COMPLETATO.
echo   Chiudi le finestre del backend e del frontend
echo   se sono ancora aperte.
echo ============================================
echo.
pause
