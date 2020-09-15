#!/bin/bash

set -e

# Install
yarn

# Depcheck
yarn depcheck

# Lint
yarn prettier

# Test
rm -Rf dist/
yarn test

# Build
yarn build

# Electron build
yarn electron-build