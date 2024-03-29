## Environment variables

### Domain

| Variable | Default              | Comment       |
| -------- | -------------------- | ------------- |
| DOMAIN   | https://tanatloc.com | Server domain |

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

### Auth

| Variable    | Default   | Comment               |
| ----------- | --------- | --------------------- |
| AUTH_SECRET | `aaaa...` | Authentication secret |

### Storage

| Variable                 | Default         | Comment                                 |
| ------------------------ | --------------- | --------------------------------------- |
| STORAGE_PATH             | `/tmp/tanatloc` | Absolute storage path                   |
| AVATAR_RELATIVE_PATH     | `avatar`        | Relative avatar path (from STORAGE)     |
| GEOMETRY_RELATIVE_PATH   | `geometry`      | Relative simulation path (from STORAGE) |
| SIMULATION_RELATIVE_PATH | `simulation`    | Relative geometry path (from STORAGE)   |

### Email

| Variable    | Default | Comment            |
| ----------- | ------- | ------------------ |
| EMAIL_TOKEN |         | MailerSend API key |
