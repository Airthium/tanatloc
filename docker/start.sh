#!/bin/sh

POSTGRES_USER="$1"
POSTGRES_PASSWORD="$2"

# Wait for postgresql
until PGPASSWORD=$POSTGRES_PASSWORD psql -h database -U $POSTGRES_USER -c '\q'; do
  >&2 echo "Postgres is unavailable - waiting..."
  sleep 1
done

>&2 echo "Postgres is up - starting Tanatloc..."

# dB install
node dist-install/install

# Start app
yarn start
