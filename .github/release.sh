#!/bin/sh

echo "Start release"

if [ $# -eq 0 ]
then
    echo "Error: Provide a commit description"
    exit 1
fi

branch=`git rev-parse --symbolic-full-name --abbrev-ref HEAD`

## Check
check () {
    devLogs=$(git log dev -100 --oneline --pretty=format:"%H")

    hotfixCommit=$(git log hotfix -1 --oneline --pretty=format:"%H")
    frontCommit=$(git log front -1 --oneline --pretty=format:"%H")

    hotfixOk=0
    frontOk=0
    for devCommit in $devLogs
    do
        if [ "$devCommit" = "$hotfixCommit" ]
        then
            hotfixOk=1
        fi

        if [ "$devCommit" = "$frontCommit" ]
        then
            frontOk=1
        fi
    done

    if [ $hotfixOk = 1 ] && [ $frontOk = 1 ]
    then
        echo "Check passed, ready to merge"
    else
        echo "Error: branch mismatch"
        if [ $hotfixOk = 0 ]
        then
            echo " - hotfix"
        fi
        if [ $frontOk = 0 ]
        then
            echo " - front"
        fi
        exit 2
    fi
}

## Merge
merge () {
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
}

if [ $branch = "dev" ]
then
    # Check
    check

    # Merge
    merge

    git checkout dev
else
    echo "You must be on dev branch to run a release"
fi
