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
}

export const useGameStore = create<GameStore>((set) => ({
  terrain: terrainGenerator,
  collision: collisionSystem,
  playerPosition: new THREE.Vector3(0, 0, 0),
  playerChunkX: 0,
  playerChunkZ: 0,
  setPlayerPosition: (position: THREE.Vector3) => {
    const chunkX = Math.floor(position.x / CHUNK_SIZE);
    const chunkZ = Math.floor(position.z / CHUNK_SIZE);
    set({
      playerPosition: position,
      playerChunkX: chunkX,
      playerChunkZ: chunkZ,
    });
  },
}));
