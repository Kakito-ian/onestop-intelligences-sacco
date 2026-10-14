# OneStop Intelligent SACCO

A configurable, multi-tenant SACCO management platform covering core banking, reconciliation, CRM, and insurance tracking on one member record.

## Repository layout

```
onestop-intelligences-sacco/
├── backend/          Spring Boot 3.4.5 REST API (Java 21)
├── frontend/         Next.js 14 staff web application
└── docs/             Architecture, API contracts, ADRs
```

The Flutter **member app** lives in a separate repository: `onestop-sacco-mobile-`

## Quick start

### Prerequisites
- Java 21
- Maven 3.9+
- Node.js 22+
- Docker & Docker Compose v2
- PostgreSQL 15+ (or use the compose file)

### 1. Start the database

```bash
docker compose up -d db
```

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

API available at `http://localhost:8080/api`
Swagger UI at `http://localhost:8080/api/swagger-ui.html`

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Web app at `http://localhost:3000`

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable releases only |
| `development` | Active development — all PRs target this branch |

Always branch from `development`. Never push directly to `main`.

## Environment variables

Copy `.env.example` to `.env` and fill in values before running.

## Documentation

- `docs/architecture.md` — system architecture and module overview
- `docs/api.md` — API endpoint reference
- `backend/src/main/resources/db/migration/` — database schema history
