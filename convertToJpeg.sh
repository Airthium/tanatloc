#!/bin/bash

set -e

dir=$1
files=$(ls "$dir"*.png)

for file in $files; do
    name="${file%.*}"
    echo "Convert $name"
    convert "$file" "$name".jpg
    rm "$file"
done
