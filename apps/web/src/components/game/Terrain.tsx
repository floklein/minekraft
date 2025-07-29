import { useMemo } from "react";
import { createBlockMaterial } from "@/lib/blocks";
import { useTerrain } from "./TerrainContext";

interface TerrainProps {
  chunkX: number;
  chunkZ: number;
}

export default function Terrain({ chunkX, chunkZ }: TerrainProps) {
  const terrain = useTerrain();

  const blocks = useMemo(() => {
    const chunk = terrain.generateChunk(chunkX, chunkZ);
    return terrain.getBlocksForRendering(chunk);
  }, [chunkX, chunkZ, terrain]);

  return (
    <group>
      {blocks.map((block) => (
        <mesh
          key={`${block.x}-${block.y}-${block.z}`}
          position={[block.x, block.y, block.z]}
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={createBlockMaterial(block.type)} />
        </mesh>
      ))}
    </group>
  );
}
