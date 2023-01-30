#!/bin/bash

set -e

# Check SONAR_TOKEN
if [ -z "$SONAR_TOKEN" ]; then
  echo "SONAR_TOKEN environment variable not defined"
  exit 1
fi

# Check sonar-scanner
type sonar-scanner >/dev/null 2>&1 || {
  echo "sonar-scanner not available"
  exit 2
}

sonar-scanner \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dproject.settings=config/sonar/sonar-project.properties
