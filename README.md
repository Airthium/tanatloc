![Node](https://github.com/Airthium/tanatloc-ssr/workflows/Node/badge.svg)

# Tanatloc

Using server-side rendering (SSR).

## Env

### Database

| Variable    | Default      | Comment           |
| ----------- | ------------ | ----------------- |
| DB_USER     | tanatlocuser | Database user     |
| DB_HOST     | localhost    | Database host     |
| DB_PORT     | 5432         | Database port     |
| DB_DATABASE | tanatloc     | Database name     |
| DB_PASSWORD | tanatloc     | Database password |

### Sentry

| Variable   | Default | Comment    |
| ---------- | ------- | ---------- |
| SENTRY_DSN |         | Sentry DSN |

### Storage

| Variable | Default       | Comment                               |
| -------- | ------------- | ------------------------------------- |
| STORAGE  | /tmp/tanatloc | Absolute storage path                 |
| AVATAR   | avatar        | Relative avatar path (from (STORAGE)) |

<!-- ## Database

```shell
sudo -u postgres psql
```

```sql
CREATE DATABASE tanatloc;
CREATE USER tanatlocuser WITH ENCRYPTED PASSWORD 'tanatloc';
GRANT ALL PRIVILEGES ON DATABASE tanatloc TO tanatlocuser;
\c tanatloc
CREATE EXTENSION pgcrypto;
``` -->

## Dev

Browser:

```shell
yarn install
yarn dev
```

Electron:

```shell
yarn install
yarn electron-dev
```

## Build

Browser:

```shell
yarn install
yarn build
yarn start
```

Browser (static build):

```shell
yarn install
yarn export
```

Electron

```shell
yarn install
yarn electron-build
```

## Architecture

This project is based on [Next.js](https://github.com/vercel/next.js/).

### Config

Global configuration (server + client side).

### Main

Electron configuration (using [Nextron](https://github.com/saltyshiomix/nextron)).

### Renderer

Client side with API routes, see [Next.js](https://github.com/vercel/next.js/) for more information.

### Resources

Electron resources, typically icons.

### Server

Custom server for the electron build (as Next.js does not support builded server).

### Src

Global sources (server + client), including `api`, `lib`, ...
