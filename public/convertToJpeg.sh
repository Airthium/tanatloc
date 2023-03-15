#!/bin/bash

set -e

dir=$1

# Add slash if necessary
[[ "${dir}" != */ ]] && dir="${dir}/"

# List files
files=$(ls "$dir"*.png)

# Convert files
for file in $files; do
    name="${file%.*}"
    echo "Convert $name"
    convert "$file" "$name".jpg
    rm "$file"
done
