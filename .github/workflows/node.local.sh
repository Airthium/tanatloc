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
yarn test | true

# NextJS lint
yarn next lint

# Build
rm -Rf .next
yarn build

# Electron build
rm -Rf .next
yarn electronbuild