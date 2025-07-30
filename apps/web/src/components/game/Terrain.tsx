import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { type Block, BlockType, getBlockTexture } from "@/lib/blocks";
import { useGameStore } from "@/zustand/game";

interface TerrainProps {
  chunkX: number;
  chunkZ: number;
}

export default function Terrain({ chunkX, chunkZ }: TerrainProps) {
  const terrain = useGameStore((state) => state.terrain);

  const [blockGroups, setBlockGroups] = useState<{
    grassBlocks: Block[];
    dirtBlocks: Block[];
    stoneBlocks: Block[];
  }>({
    grassBlocks: [],
    dirtBlocks: [],
    stoneBlocks: [],
  });

  const grassInstancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const dirtInstancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const stoneInstancedMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const updateBlocks = () => {
      const chunk = terrain.generateChunk(chunkX, chunkZ);
      const blocks = terrain.getBlocksForRendering(chunk);
      setBlockGroups({
        grassBlocks: blocks.filter((block) => block.type === BlockType.GRASS),
        dirtBlocks: blocks.filter((block) => block.type === BlockType.DIRT),
        stoneBlocks: blocks.filter((block) => block.type === BlockType.STONE),
      });
    };
    updateBlocks();
  }, [chunkX, chunkZ, terrain]);

  useEffect(() => {
    const unsubscribe = terrain.onBlockChange(() => {
      const chunk = terrain.generateChunk(chunkX, chunkZ);
      const blocks = terrain.getBlocksForRendering(chunk);
      setBlockGroups({
        grassBlocks: blocks.filter((block) => block.type === BlockType.GRASS),
        dirtBlocks: blocks.filter((block) => block.type === BlockType.DIRT),
        stoneBlocks: blocks.filter((block) => block.type === BlockType.STONE),
      });
    });
    return unsubscribe;
  }, [terrain, chunkX, chunkZ]);

  const { grassBlocks, dirtBlocks, stoneBlocks } = blockGroups;

  // Update instanced mesh positions only when blocks change
  useEffect(() => {
    const matrix = new THREE.Matrix4();
    if (grassInstancedMeshRef.current) {
      grassBlocks.forEach((block, i) => {
        matrix.setPosition(block.x + 0.5, block.y + 0.5, block.z + 0.5);
        grassInstancedMeshRef.current?.setMatrixAt(i, matrix);
      });
      grassInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (dirtInstancedMeshRef.current) {
      dirtBlocks.forEach((block, i) => {
        matrix.setPosition(block.x + 0.5, block.y + 0.5, block.z + 0.5);
        dirtInstancedMeshRef.current?.setMatrixAt(i, matrix);
      });
      dirtInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (stoneInstancedMeshRef.current) {
      stoneBlocks.forEach((block, i) => {
        matrix.setPosition(block.x + 0.5, block.y + 0.5, block.z + 0.5);
        stoneInstancedMeshRef.current?.setMatrixAt(i, matrix);
      });
      stoneInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [grassBlocks, dirtBlocks, stoneBlocks]);

  return (
    <group>
      {grassBlocks.length > 0 && (
        <instancedMesh
          ref={grassInstancedMeshRef}
          args={[undefined, undefined, grassBlocks.length]}
          castShadow={false}
          receiveShadow={false}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial map={getBlockTexture(BlockType.GRASS)} />
        </instancedMesh>
      )}
      {dirtBlocks.length > 0 && (
        <instancedMesh
          ref={dirtInstancedMeshRef}
          args={[undefined, undefined, dirtBlocks.length]}
          castShadow={false}
          receiveShadow={false}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial map={getBlockTexture(BlockType.DIRT)} />
        </instancedMesh>
      )}
      {stoneBlocks.length > 0 && (
        <instancedMesh
          ref={stoneInstancedMeshRef}
          args={[undefined, undefined, stoneBlocks.length]}
          castShadow={false}
          receiveShadow={false}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial map={getBlockTexture(BlockType.STONE)} />
        </instancedMesh>
      )}
    </group>
  );
}
