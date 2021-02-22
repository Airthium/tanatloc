#!/bin/sh

hash=`git log -n 1 --pretty=format:"%h"`
echo "{ \"git\": \"${hash}\"}" > ./version.json