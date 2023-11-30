#!/bin/bash

set -e

echo "Update hotfix"

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

checkBranch
submodules
merge
check
