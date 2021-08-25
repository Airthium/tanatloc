## BUILDER ##
FROM tanatloc/worker as builder

USER root

ENV DEBIAN_FRONTEND noninteractive

ENV INSTALL_PATH /home/app
ENV APP_PATH /home/app

# Install packages
RUN apt update \
    && apt upgrade -yq \
    && apt install -yq \
        apt-utils curl \
        git gnupg g++ libpq-dev \
        make python3 \
        nodejs node-gyp

# Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update \
    && apt install -yq \
        yarn

# NVM
ENV NODE_VERSION=14.17.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
ENV NVM_DIR /root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN apt autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Build
ARG DB_ADMIN
ENV DB_ADMIN $DB_ADMIN

ARG DB_ADMIN_PASSWORD
ENV DB_ADMIN_PASSWORD $DB_ADMIN_PASSWORD

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PORT
ENV DB_PORT $DB_PORT

COPY .git ${INSTALL_PATH}/.git
COPY config ${INSTALL_PATH}/config
COPY install ${INSTALL_PATH}/install
COPY models ${INSTALL_PATH}/models
COPY modules ${INSTALL_PATH}/modules
COPY plugins ${INSTALL_PATH}/plugins
COPY public ${INSTALL_PATH}/public
COPY resources ${INSTALL_PATH}/resources
COPY src ${INSTALL_PATH}/src
COPY templates ${INSTALL_PATH}/templates
COPY updaters ${INSTALL_PATH}/updaters
COPY .babelrc ${INSTALL_PATH}/.babelrc
COPY next.config.js ${INSTALL_PATH}/next.config.js
COPY package.json ${INSTALL_PATH}/package.json
COPY yarn.lock ${INSTALL_PATH}/yarn.lock

WORKDIR ${INSTALL_PATH}

RUN yarn install --ignore-scripts
RUN yarn copyassets
RUN yarn babel . --only config,install,src/database/index.js --out-dir dist-install
RUN yarn next telemetry disable

RUN yarn build

## RELEASE ##
FROM tanatloc/worker

USER root

ENV DEBIAN_FRONTEND noninteractive

ENV INSTALL_PATH /home/app
ENV APP_PATH /home/app

ARG DB_ADMIN
ENV DB_ADMIN $DB_ADMIN

ARG DB_ADMIN_PASSWORD
ENV DB_ADMIN_PASSWORD $DB_ADMIN_PASSWORD

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PORT
ENV DB_PORT $DB_PORT

# Install packages
RUN apt update \
    && apt upgrade -yq \
    && apt install -yq \
        curl git gnupg g++ libpq-dev \
        make postgresql python3 \
        nodejs node-gyp

# Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update \
    && apt install -yq \
        yarn

# NVM
ENV NODE_VERSION=14.17.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
ENV NVM_DIR /root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN apt autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy
WORKDIR ${APP_PATH}

COPY docker/package.json package.json

COPY --from=builder ${INSTALL_PATH}/dist-install dist-install
COPY --from=builder ${INSTALL_PATH}/modules modules
COPY --from=builder ${INSTALL_PATH}/public public
COPY --from=builder ${INSTALL_PATH}/templates templates
COPY --from=builder ${INSTALL_PATH}/updaters updaters
COPY --from=builder ${INSTALL_PATH}/plugins plugins
COPY --from=builder ${INSTALL_PATH}/.next .next
COPY --from=builder ${INSTALL_PATH}/yarn.lock yarn.lock

RUN yarn
RUN yarn next telemetry disable

COPY docker/start.sh start.sh
RUN chmod +x start.sh

## START
CMD ${APP_PATH}/start.sh $DB_ADMIN $DB_ADMIN_PASSWORD
