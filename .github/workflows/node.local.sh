#!/bin/bash

set -e

# Clean
# echo " + Clean"
# git clean -xdf >node.local.log

# Install
echo " + Install"
yarn install >>node.local.log

# Depcheck
echo " + Depcheck"
yarn run depcheck >>node.local.log

# Lint
echo " + Prettier"
yarn run prettier >>node.local.log

# Next lint
echo " + Next lint"
yarn run next lint >>node.local.log

# Doc
echo " + Doc"
yarn run doc >>node.local.log

# Test
echo " + Test"
yarn run test --no-color >>node.local.log

# Prestart
echo " + Prestart"
yarn run prestart >>node.local.log

# Build
echo " + Build"
yarn run build >>node.local.log

echo "All done!"
