import { createContext, useContext } from "react";
import { CollisionSystem } from "@/lib/collision";
import { TerrainGenerator } from "@/lib/terrain";

const terrainGenerator = new TerrainGenerator(42);
const collisionSystem = new CollisionSystem(terrainGenerator);

interface TerrainContextType {
  terrain: TerrainGenerator;
  collision: CollisionSystem;
}

const TerrainContext = createContext<TerrainContextType>({
  terrain: terrainGenerator,
  collision: collisionSystem,
});

export function TerrainProvider({ children }: { children: React.ReactNode }) {
  return (
    <TerrainContext.Provider
      value={{ terrain: terrainGenerator, collision: collisionSystem }}
    >
      {children}
    </TerrainContext.Provider>
  );
}

export function useTerrain() {
  return useContext(TerrainContext).terrain;
}

export function useCollision() {
  return useContext(TerrainContext).collision;
}
