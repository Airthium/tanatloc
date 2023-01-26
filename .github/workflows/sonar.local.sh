#!/bin/bash

sonar-scanner \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dproject.settings=config/sonar/sonar-project.properties
