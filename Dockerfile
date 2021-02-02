FROM tanatloc/converters

LABEL maintainer="https://github.com/orgs/Airthium/people"

## ENV
ENV DEBIAN_FRONTEND noninteractive
ENV INSTALL_PATH /home/app/install
ENV APP_PATH /home/app

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
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

## BUILD
ARG DB_ADMIN
ENV DB_ADMIN $DB_ADMIN

ARG DB_ADMIN_PASSWORD
ENV DB_ADMIN_PASSWORD $DB_ADMIN_PASSWORD

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PORT
ENV DB_PORT $DB_PORT

# Copy
COPY config ${INSTALL_PATH}/config
COPY install ${INSTALL_PATH}/install
COPY models ${INSTALL_PATH}/models
COPY plugin ${INSTALL_PATH}/plugin
COPY public ${INSTALL_PATH}/public
COPY resources ${INSTALL_PATH}/resources
COPY src ${INSTALL_PATH}/src
COPY templates ${INSTALL_PATH}/templates
COPY .babelrc ${INSTALL_PATH}/.babelrc
COPY next.config.js ${INSTALL_PATH}/next.config.js
COPY package.json ${INSTALL_PATH}/package.json
COPY yarn.lock ${INSTALL_PATH}/yarn.lock

# Workdir
WORKDIR ${INSTALL_PATH}

# Build
RUN yarn install --ignore-scripts
RUN yarn babel . --only config,install,src/database/index.js --out-dir dist-install
RUN yarn build

# Workdir
WORKDIR ${APP_PATH}

# Keep essential
COPY docker/package.json ${APP_PATH}/package.json

RUN mv ${INSTALL_PATH}/dist-install ${APP_PATH}/dist-install

RUN mv ${INSTALL_PATH}/public ${APP_PATH}/public
RUN mv ${INSTALL_PATH}/templates ${APP_PATH}/templates
RUN mv ${INSTALL_PATH}/.next ${APP_PATH}/.next
RUN yarn

COPY docker/start.sh ${APP_PATH}/start.sh
RUN chmod +x ${APP_PATH}/start.sh

# Clean
RUN rm -Rf ${APP_PATH}/install

## START
CMD ${APP_PATH}/start.sh