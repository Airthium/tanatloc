![Node](https://github.com/Airthium/tanatloc-ssr/workflows/Node/badge.svg)

# Tanatloc

Using server-side rendering (SSR).

## Dev

Browser:

```
yarn install
yarn dev
```

Electron:

```
yarn install
yarn electron-dev
```

## Build

Browser:

```
yarn install
yarn build
yarn start
```

Browser (static build):

```
yarn install
yarn export
```

Electron

```
yarn install
yarn electron-build
```

## Architecture

This project is based on [Next.js](https://github.com/vercel/next.js/).

### Config

Global configuration (server + client side).

### Main

Electron configuration (using [Nextron](https://github.com/saltyshiomix/nextron)).

### Renderer

Client side with API routes, see [Next.js](https://github.com/vercel/next.js/) for more information.

### Resources

Electron resources, typically icons.

### Server

Custom server for the electron build (as Next.js does not support builded server).

### Src

Global sources (server + client), including `api`, `lib`, ...
