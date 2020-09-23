#!/bin/bash

set -e

# Install
yarn

# Depcheck
yarn depcheck

# Lint
yarn prettier

# Doc
yarn doc

# Test
rm -Rf dist/
yarn test

# Build
yarn build

# Electron build
yarn electron-build