#!/bin/bash

# Update submodules
git pull
cd plugins/airthium
git checkout main
git pull
cd -
cd plugins/denso
git checkout master
git pull
cd -
cd plugins/rescale
git checkout master
git pull
cd -
cd plugins/sharetask
git checkout master
git pull
cd -
