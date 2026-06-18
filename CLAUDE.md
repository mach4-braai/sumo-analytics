# Sumo Analytics

Sumo wrestling analytics dashboard. Monorepo with npm workspaces.

## Architecture

- `packages/db` — `@sumo/db`: Drizzle ORM schema, client, queries
- `apps/web` — Next.js frontend (App Router, Tailwind v4, Recharts)
- `apps/fetcher` — Data sync service (node-cron, sumo-api.com)

## Prerequisites

- mise (manages Node.js 22)
- Docker (PostgreSQL 16)

## Commands

All commands via mise:

```sh
mise run db:up        # start PostgreSQL
mise run db:migrate   # run migrations
mise run db:generate  # generate new migration
mise run db:studio    # open Drizzle Studio
mise run dev          # start Next.js frontend
mise run fetcher      # start data fetcher (cron mode)
mise run fetcher:seed # initial data seed
```

## Database

PostgreSQL runs in Docker. Connection: `postgresql://sumo:sumo@localhost:5432/sumo`

Four tables: `rikishi`, `basho`, `torikumi`, `rikishi_basho`. All IDs come from sumo-api.com.

## Data Source

https://sumo-api.com — open API, 1 req/sec throttle respected by fetcher.
