# koa-middleware-sst-typescript

Koa.js middleware for server-side transformation (SST) of TypeScript using Bun.

# Development

## Prerequisites

1. Install [Bun](https://bun.sh/):

```bash
curl -fsSL https://bun.sh/install | bash.
```

## Setup

1. Install dependencies:

```bash
bun install
```

2. Run "prepare":

```bash
bun run prepare
```

## Serve

To serve any of the example apps, cd into the directory, then run `bun run start`.

eg, to run the "hello-world" example app

```bash
cd ./apps/hello-world
bun run start
```

# Workspace

This workspace is setup like a monorepo, but only contains one "library" package (`koa-middleware-sst-typescript`), and "example" apps.
