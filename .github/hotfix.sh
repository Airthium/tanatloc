#!/bin/bash

set -e

echo "Update hotfix"

OPT=$1

## Check branch
checkBranch() {
    BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
    if [ $BRANCH != "dev" ]; then
        echo "Error"
        echo "You must be on dev branch"
        exit 1
    fi
}

## Submodules
submodules() {
    ./.github/submodules.sh
}

## Merge hotfix
merge() {
    git pull
    git checkout hotfix
    git pull
    git checkout dev
    git merge hotfix
}

## Check
check() {
    rm yarn.lock
    ./.github/workflows/node.local.sh
}

## Release
release() {
    if [ "$OPT" = "release" ]; then
        # package.json version
        PACKAGE_VERSION=$(cat package.json | jq -r '.version')
        echo $PACKAGE_VERSION
        NUMS=(${PACKAGE_VERSION//./ })

        # Increse minor
        ((NUMS[2]++))
        PACKAGE_NEW_VERSION=${NUMS[0]}.${NUMS[1]}.${NUMS[2]}
        echo $PACKAGE_NEW_VERSION

        # New package.json version
        jq ".version=\"${PACKAGE_NEW_VERSION}\"" package.json >/tmp/package.json
        mv /tmp/package.json package.json

        # release
        ./.github/release.sh $PACKAGE_NEW_VERSION
    else
        git add .
        git commit -m"update"
        git push
        git checkout hotfix
        git merge dev
        git push
        git checkout front
        git merge dev
        git push
        git checkout dev
    fi
}

checkBranch
submodules
merge
check
release
