# test-task

A small Node.js + TypeScript backend project using Express, TypeORM and Redis/BullMQ for queues.

This README explains how to set up, run and work with the project locally and with Docker.

## Requirements

- Node.js 18+ (recommended)
- npm (or pnpm/yarn)
- Docker & Docker Compose (optional, for containerized run)

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Create a .env file at project root (copy from any example env files if provided) and set DB/Redis/Firebase credentials.

3. Run in development (hot-reload):

```powershell
npm run dev
```

4. Build and run (production):

```powershell
npm run build
npm start
```

## Docker

Build and run using Docker Compose (project provides a Dockerfile and docker-compose.yml):

```powershell
npm run docker:build
npm run docker:up
```

To stop:

```powershell
npm run docker:down
```

## Database migrations

This project uses TypeORM migrations. Useful scripts:

- Create a migration (custom script wraps TypeORM):

```powershell
npm run typeorm:create-migration -- <MigrationName>
```

- Generate migration from entities:

```powershell
npm run typeorm:generate -- <MigrationName>
```

- Run migrations:

```powershell
npm run typeorm:run
```

Note: scripts use ts-node/tsx and expect TypeScript source configuration. Check `src/typeOrm.config.ts` for connection settings.

## Useful npm scripts

- `npm run dev` — run server in watch mode (tsx).
- `npm run build` — compile TypeScript to `dist/`.
- `npm start` — run compiled server from `dist/`.
- `npm run generate-data` — populate DB with example/test data.
- `npm run docker:up|docker:build|docker:down` — docker compose helpers.

## Project structure (high level)

- `src/` — application source

  - `auth/` — authentication controllers, routes, DTOs and services
  - `user/` — user controllers, services and entities
  - `comments/` — comments feature (controllers, services, entities, events)
  - `firebase/` — firebase initialization and storage wrappers
  - `middlewares/` — express middlewares (auth, captcha, validation, upload)
  - `queues/` — BullMQ queues (comment-mail.queue)
  - `sockets/` — socket.io wiring
  - `typeOrm.config.ts` — TypeORM configuration

- `migrations/` — TypeORM migration files
- `scripts/` — helper scripts (create-migration, generate-migration, generate-data)

## Environment

Place environment variables in `.env`. Typical variables include:

- `DATABASE_URL` or PG_HOST/PG_USER/PG_PASS/PG_DB
- `REDIS_URL` or REDIS_HOST/REDIS_PORT
- `JWT_SECRET`
- `FIREBASE_*` (credentials)

Refer to `src/typeOrm.config.ts` and firebase config files for exact variable names.

## Tests

There are no automated tests included. Adding unit/integration tests is recommended.

## Contributing

- Open issues or create pull requests against the `main` branch.

## Troubleshooting

- If migrations fail, confirm DB connection settings in `.env` and `src/typeOrm.config.ts`.
- For Docker issues, inspect container logs with `docker compose logs`.

## Contact / Source

Repository: https://github.com/ivla-bit/test-task

---
