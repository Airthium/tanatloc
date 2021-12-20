#!/bin/bash

set -e

# Install
yarn install

# Depcheck
yarn run depcheck

# Lint
yarn run prettier

# Doc
yarn run doc

# Test
yarn run test | true

# Build
rm -Rf .next
yarn run build
