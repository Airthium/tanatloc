#!/bin/sh

if [ $# -eq 0 ]
then
    echo "Provide a commit description"
    exit 1
fi

branch=`git rev-parse --symbolic-full-name --abbrev-ref HEAD`

if [ $branch = "dev" ]
then
    git add .
    git commit -m"$1" --allow-empty
    git push

    git checkout hotfix
    git merge dev
    git push

    git checkout front
    git merge dev
    git push

    git checkout master
    git merge dev
    git push

    git checkout dev
else
    echo "You must be on dev branch to release"
fi
