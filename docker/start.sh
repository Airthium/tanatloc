#!/bin/sh

set -e

$host="$1"

# Wait for postgresql
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

# dB install
node dist-install/install

# Start app
yarn start
