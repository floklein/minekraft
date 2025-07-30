import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/zustand/game";
import Terrain from "./Terrain";

interface ChunkData {
  x: number;
  z: number;
  key: string;
}

export default function World() {
  const playerChunkX = useGameStore((state) => state.playerChunkX);
  const playerChunkZ = useGameStore((state) => state.playerChunkZ);

  const [loadedChunks, setLoadedChunks] = useState<Map<string, ChunkData>>(
    new Map(),
  );

  // Update loaded chunks when player moves
  useEffect(() => {
    const renderDistance = 1; // Reduced render distance for better performance
    const unloadDistance = 2; // Unload chunks further away
    setLoadedChunks((prev) => {
      const newChunks = new Map(prev);
      // Add new chunks that should be loaded
      for (
        let x = playerChunkX - renderDistance;
        x <= playerChunkX + renderDistance;
        x++
      ) {
        for (
          let z = playerChunkZ - renderDistance;
          z <= playerChunkZ + renderDistance;
          z++
        ) {
          const key = `${x}-${z}`;
          if (!newChunks.has(key)) {
            newChunks.set(key, { x, z, key });
          }
        }
      }
      // Remove chunks that are too far away
      for (const [key, chunk] of newChunks) {
        const distance = Math.max(
          Math.abs(chunk.x - playerChunkX),
          Math.abs(chunk.z - playerChunkZ),
        );
        if (distance > unloadDistance) {
          newChunks.delete(key);
        }
      }
      return newChunks;
    });
  }, [playerChunkX, playerChunkZ]);

  const chunksArray = useMemo(
    () => Array.from(loadedChunks.values()),
    [loadedChunks],
  );

  return (
    <group>
      {chunksArray.map(({ x, z, key }) => (
        <Terrain key={key} chunkX={x} chunkZ={z} />
      ))}
    </group>
  );
}
