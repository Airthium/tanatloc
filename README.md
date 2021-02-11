![Node](https://github.com/Airthium/tanatloc-ssr/workflows/Node/badge.svg)

# Tanatloc

Using server-side rendering (SSR).

## Env

### Database

| Variable          | Default             | Comment           |
| ----------------- | ------------------- | ----------------- |
| DB_ADMIN          | `$USER` or postgres | Admin user        |
| DB_ADMIN_DATABASE | postgres            | Admin database    |
| DB_ADMIN_PASSWORD |                     | Admin password    |
| DB_USER           | tanatlocuser        | Database user     |
| DB_HOST           | localhost           | Database host     |
| DB_PORT           | 5432                | Database port     |
| DB_DATABASE       | tanatloc            | Database name     |
| DB_PASSWORD       | tanatloc            | Database password |

### Sentry

| Variable   | Default | Comment    |
| ---------- | ------- | ---------- |
| SENTRY_DSN |         | Sentry DSN |

### Storage

| Variable                 | Default         | Comment                                 |
| ------------------------ | --------------- | --------------------------------------- |
| AUTH_SECRET              | `aaaa...`       | Authentication secret                   |
| STORAGE_PATH             | `/tmp/tanatloc` | Absolute storage path                   |
| AVATAR_RELATIVE_PATH     | avatar          | Relative avatar path (from STORAGE)     |
| SIMULATION_RELATIVE_PATH | simulation      | Realtive simulation path (from STORAGE) |

### Email

| Variable    | Default | Comment            |
| ----------- | ------- | ------------------ |
| EMAIL_TOKEN |         | MailerSend API key |

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

Docker

```shell
docker-compose build
docker-compose up
```

## Architecture

This project is based on [Next.js](https://github.com/vercel/next.js/).

### Config

Global configuration (server + client side).

### Electron

Electron configuration (using [Nextron](https://github.com/saltyshiomix/nextron)).

### Resources

Electron resources, typically icons.

### Server

Custom server for the electron build (as Next.js does not support builded server).

### Src

Global sources (server + client), including `api`, `components`, `lib`, ...
