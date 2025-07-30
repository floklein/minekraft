import * as THREE from "three";
import { create } from "zustand";
import { CHUNK_SIZE } from "@/lib/blocks";
import { CollisionSystem } from "@/lib/collision";
import { TerrainGenerator } from "@/lib/terrain";

const terrainGenerator = new TerrainGenerator(42);
const collisionSystem = new CollisionSystem(terrainGenerator);

interface GameStore {
  terrain: TerrainGenerator;
  collision: CollisionSystem;
  playerPosition: THREE.Vector3;
  playerChunkX: number;
  playerChunkZ: number;
  setPlayerPosition: (position: THREE.Vector3) => void;
  playerCoords: { x: string; y: string; z: string };
  setPlayerCoords: (coords: { x: string; y: string; z: string }) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  terrain: terrainGenerator,
  collision: collisionSystem,
  playerPosition: new THREE.Vector3(0, 0, 0),
  playerChunkX: 0,
  playerChunkZ: 0,
  playerCoords: { x: "0", y: "0", z: "0" },
  setPlayerPosition: (playerPosition: THREE.Vector3) => {
    const chunkX = Math.floor(playerPosition.x / CHUNK_SIZE);
    const chunkZ = Math.floor(playerPosition.z / CHUNK_SIZE);
    set({
      playerPosition,
      playerChunkX: chunkX,
      playerChunkZ: chunkZ,
    });
  },
  setPlayerCoords: (playerCoords: { x: string; y: string; z: string }) => {
    set({ playerCoords });
  },
}));
