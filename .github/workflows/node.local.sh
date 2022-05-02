#!/bin/bash

set -e

# Clean
git clean -xdf

# Install
yarn install

# Depcheck
yarn run depcheck | true

# Lint
yarn run prettier | true

# Next lint
yarn run next lint | true

# Doc
yarn run doc | true

# Test
yarn run test | true

# Prestart
yarn run prestart

# Build
rm -Rf .next
yarn run build
