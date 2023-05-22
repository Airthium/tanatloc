#!/bin/bash

# Update submodules
git pull
cd plugins/airthium
git pull
cd -
cd plugins/denso
git pull
cd -
cd plugins/rescale
git pull
cd -
cd plugins/sharetask
git pull
cd -
