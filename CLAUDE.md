# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun dev` - Start all applications in development mode (web runs on port 3001)
- `bun build` - Build all applications
- `bun check-types` - TypeScript type checking across all apps
- `bun check` - Run Biome formatting and linting (fixes issues automatically)
- `bun dev:web` - Start only the web application
- `bun dev:native` - Start only the native application
- `bun dev:server` - Start only the server application

## Project Architecture

This is a Turborepo monorepo using Bun as the package manager. The project structure:

- **apps/web/** - React frontend application using TanStack Router, TailwindCSS v4, and shadcn/ui components
- **packages/** - Shared packages (currently empty but available for future shared code)

### Web Application Stack

- **React 19** with TypeScript
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS v4** - Utility-first CSS framework
- **shadcn/ui** - Reusable UI components in `src/components/ui/`
- **Vite** - Build tool and dev server
- **Biome** - Code formatting and linting (uses tabs, double quotes)

### Key Configuration Files

- `turbo.json` - Turborepo task configuration
- `biome.json` - Code formatting and linting rules
- `apps/web/vite.config.ts` - Vite configuration with path aliases (`@/*` maps to `./src/*`)
- `apps/web/tsconfig.json` - TypeScript configuration

### Component Structure

- UI components follow shadcn/ui patterns in `apps/web/src/components/ui/`
- Theme system using `next-themes` with dark/light mode toggle
- Custom components in `apps/web/src/components/`
- Routes defined in `apps/web/src/routes/` following TanStack Router conventions

## Code Style

- Uses Biome for formatting with tab indentation and double quotes
- TypeScript strict mode enabled
- Organized imports automatically handled by Biome
- CSS classes sorted using Biome's `useSortedClasses` rule with `clsx`, `cva`, and `cn` functions

## Minecraft Clone Features

The web application includes a Minecraft clone built with React Three Fiber:

### Game Components Structure
- `src/components/game/MinecraftGame.tsx` - Main game container with Canvas setup
- `src/components/game/World.tsx` - World manager that handles chunk rendering
- `src/components/game/Terrain.tsx` - Individual terrain chunk renderer using instanced meshes
- `src/components/game/Player.tsx` - First-person camera controls and movement

### Key Libraries
- `@react-three/fiber` - React Three.js integration
- `@react-three/drei` - Three.js helpers (PointerLockControls, Stats)
- `three` - Core 3D rendering library

### Game Features
- **Terrain Generation**: Procedural terrain using simplex noise
- **Block System**: Grass, dirt, and stone blocks with instanced rendering
- **First-Person Controls**: WASD movement, mouse look, jumping
- **Physics**: Basic gravity and ground collision
- **Performance**: Instanced block rendering for efficiency

### Game Routes
- `/` - Home page with game link
- `/game` - Minecraft clone game interface

### Development Notes
- Game runs in fullscreen canvas with pointer lock controls
- Terrain generates in 16x16 chunks with 3x3 chunk render distance
- Uses noise-based height generation for realistic terrain
- Blocks are culled when completely surrounded (performance optimization)