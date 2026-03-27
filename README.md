# minekraft

`minekraft` is a browser-based Minecraft-style sandbox built with React, React Three Fiber, and Three.js. It renders a procedurally generated voxel world, supports first-person movement with collision and gravity, and lets you remove or place blocks from a small inventory bar.

## Features

- Procedural terrain generation with chunked loading and caching
- First-person controls with pointer lock, gravity, jumping, and collision detection
- Block interaction with left-click remove and right-click place
- Simple inventory with grass, dirt, and stone blocks
- Browser rendering powered by React Three Fiber and Three.js
- Monorepo tooling with Bun, Turborepo, Biome, and TypeScript

## Tech Stack

- React 19
- TanStack Router
- React Three Fiber
- Three.js
- Zustand
- Tailwind CSS
- Bun
- Turborepo
- Biome

## Getting Started

Install dependencies from the repo root:

```bash
bun install
```

Start the web app in development:

```bash
bun dev:web
```

Or run the full workspace:

```bash
bun dev
```

The web app runs on [http://localhost:3001](http://localhost:3001).

## Controls

- `Click` to lock the pointer
- `WASD` to move
- `Mouse` to look around
- `Space` to jump
- `Left click` to remove a block
- `Right click` to place the selected block

## Scripts

- `bun dev` runs all workspace dev tasks through Turborepo
- `bun dev:web` starts the web app on port `3001`
- `bun build` builds the workspace
- `bun check-types` runs TypeScript checks
- `bun check` runs Biome formatting and linting

## Project Structure

```text
minekraft/
├── apps/
│   └── web/
│       ├── src/components/game/  # Player, world, rendering, and interaction
│       ├── src/lib/              # Terrain, raycasting, collision, block helpers
│       └── src/zustand/          # Game and inventory state
├── package.json
└── turbo.json
```

## Notes

- Terrain is generated client-side from simplex noise.
- Chunks load around the player and unload outside the render window.
- Block edits are tracked separately from generated terrain so local changes persist while you move through the world.
