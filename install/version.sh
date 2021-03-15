#!/bin/sh

hash=`git log -n 1 --pretty=format:"%h"`
echo "{ \"git\": \"git-${hash}\"}" > ./version.json