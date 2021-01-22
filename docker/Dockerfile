FROM ubuntu:20.10

LABEL maintainer="https://github.com/orgs/Airthium/people"

ENV DEBIAN_FRONTEND noninteractive

## INSTALL
# Install base packages
RUN apt update

# Install node, postgresql & AppImage tools
RUN apt install -yq \
    fuse \
    nodejs \
    postgresql

# Finish install
RUN apt autoremove \
    && apt clean

## DATABASE
# Copy `install`
COPY dist-install /install
# RUN node /install/install

## APPIMAGE
# Copy AppImage
COPY Tanatloc-0.9.0.AppImage /tanatloc/Tanatloc.AppImage
RUN modprobe fuse

# Run AppImage
CMD /tanatloc/Tanatloc.AppImage