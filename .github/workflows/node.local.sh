#!/bin/bash

set -e

# Clean
echo " + Clean"
git clean -xdf >node.local.log 2>&1

# Install
echo " + Install"
yarn install >>node.local.log 2>&1

# Depcheck
echo " + Depcheck"
yarn run depcheck >>node.local.log 2>&1

# Lint
echo " + Prettier"
yarn run prettier >>node.local.log 2>&1

# Next lint
echo " + Next lint"
yarn run next lint >>node.local.log 2>&1

# Doc
echo " + Doc"
yarn run doc >>node.local.log 2>&1

# Test
echo " + Test"
yarn run test --no-color >>node.local.log 2>&1

# Prestart
echo " + Prestart"
yarn run prestart >>node.local.log 2>&1

# Build
echo " + Build"
yarn run build >>node.local.log 2>&1

echo "All done!"
