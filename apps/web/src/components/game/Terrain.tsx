import { useMemo } from "react";
import { type BlockType, getBlockColor } from "@/lib/blocks";
import { useTerrain } from "./TerrainContext";

interface TerrainProps {
  chunkX: number;
  chunkZ: number;
}

function Block({
  x,
  y,
  z,
  blockType,
}: {
  x: number;
  y: number;
  z: number;
  blockType: BlockType;
}) {
  const color = getBlockColor(blockType);

  return (
    <mesh position={[x, y, z]} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

export default function Terrain({ chunkX, chunkZ }: TerrainProps) {
  const terrain = useTerrain();

  const blocks = useMemo(() => {
    const chunk = terrain.generateChunk(chunkX, chunkZ);
    const renderBlocks = terrain.getBlocksForRendering(chunk);

    console.log(
      `Chunk ${chunkX},${chunkZ} has ${renderBlocks.length} blocks to render`,
    );

    return renderBlocks;
  }, [chunkX, chunkZ, terrain]);

  if (blocks.length === 0) {
    console.log(`No blocks to render for chunk ${chunkX},${chunkZ}`);
    return null;
  }

  return (
    <group>
      {blocks.map((block, index) => (
        <Block
          key={`${block.x}-${block.y}-${block.z}-${index}`}
          x={block.x}
          y={block.y}
          z={block.z}
          blockType={block.type}
        />
      ))}
    </group>
  );
}
