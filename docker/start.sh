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

# Env
export NEXT_PUBLIC_SOURCE_BRANCH=`git rev-parse --abbrev-ref HEAD`
export NEXT_PUBLIC_SOURCE_COMMIT=`git rev-parse --short HEAD`

# Start app
yarn start
