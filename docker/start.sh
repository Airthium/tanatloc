#!/bin/sh

echo $DB_ADMIN

# dB install
node dist-install/install

# Start app
yarn start
