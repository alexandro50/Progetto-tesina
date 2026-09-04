# WorkShift Manager

Applicazione per la gestione dei turni di lavoro: **timbratrice digitale**, pianificazione turni e conteggio ore.

**Stack:**
- **Frontend:** React 19 + Vite (porta **5173**)
- **Backend:** Spring Boot 3 + Spring Security + JWT (porta **8080**)
- **Database:** PostgreSQL 16 (porta **5433**) in Docker

---

## Requisiti per far girare su un PC nuovo

- [Node.js](https://nodejs.org/) 18+ (per il frontend)
- **Java 21** (per il backend Spring Boot)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (per PostgreSQL)

---

## Avvio rapido (Windows)

Doppio clic su **`WorkShift Manager\backend\start.bat`**. Questo script:
1. Avvia PostgreSQL tramite Docker Compose
2. Avvia il backend Spring Boot (porta 8080)
3. Avvia il frontend React/Vite (porta 5173)

Poi apri il browser su **http://localhost:5173**.

### Arresto

Doppio clic su **`WorkShift Manager\backend\stop.bat`** per fermare i container Docker.

---

## Prima configurazione su un PC nuovo

Alla prima esecuzione dovrai creare un account:
- Apri http://localhost:5173/register
- Compila nome, cognome, email e password
- Se vuoi un account **amministratore**: spunta "Sono un amministratore" e inserisci il codice **`ADMIN-2026`**
- Altrimenti verrai registrato come **dipendente**

> Il codice admin si configura in `src\main\resources\application.properties` (`smartshift.app.codiceAdmin`).

---

## Avvio manuale (passo per passo)

### 1. Database (Docker)
```bash
docker compose up -d
```
Da `WorkShift Manager\backend\`. PostgreSQL ascolta sulla porta **5433**.

### 2. Backend Spring Boot
```bash
cd backend_utenti
mvnw spring-boot:run
```
Restano in esecuzione sulla porta **8080**.

### 3. Frontend React/Vite
```bash
cd backend_utenti/src/main/frontend
npm install
npm run dev
```
Restano in esecuzione sulla porta **5173**.

---

## Note configurazione

- **DB:** `workshift_db` — utente `postgres` — password `pippo123` (porta `5433`)
- Le credenziali DB e la chiave JWT sono in `src\main\resources\application.properties`
- Il frontend comunica col backend tramite il **proxy di Vite** (`/api` → `http://localhost:8080`), quindi non servono modifiche al CORS per lo sviluppo locale.

---

## Configurazione git (per chi lavora da più PC)

Ricordati di configurare git su ogni nuovo PC:

```bash
git config --global user.name "Aldo Melgarejo"
git config --global user.email "la_tua_email_di_github@esempio.com"
```
