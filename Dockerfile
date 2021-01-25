FROM ubuntu:20.10

LABEL maintainer="https://github.com/orgs/Airthium/people"

ENV DEBIAN_FRONTEND noninteractive

## INSTALL
# Start
RUN apt update \
    && apt upgrade -yq

# Base
RUN apt install -yq \
        apt-utils curl \
        gnupg g++ libpq-dev \
        make python3

# Node
RUN apt install -yq \
        nodejs node-gyp

# Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update \
    && apt install -yq \
        yarn

# Clean
RUN apt autoremove \
    && apt clean

## BUILD
ENV DB_HOST='postgres'

# Copy
COPY . /home/app/install

# Workdir
WORKDIR /home/app/install

# Build
RUN yarn
RUN yarn postinstall
RUN yarn build

# # Keep essential
# RUN mv /home/app/install/build /home/app/.next

# # Clean
# RUN rm -Rf /home/app/install

## START
CMD cd /home/app && yarn start