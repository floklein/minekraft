import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BlockType, getBlockTexture } from "@/lib/blocks";
import { useGameStore } from "@/lib/store";

interface TerrainProps {
  chunkX: number;
  chunkZ: number;
}

export default function Terrain({ chunkX, chunkZ }: TerrainProps) {
  const terrain = useGameStore((state) => state.terrain);
  const grassInstancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const dirtInstancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const stoneInstancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const unsubscribe = terrain.onBlockChange(() => {
      setUpdateTrigger((prev) => prev + 1);
    });
    return unsubscribe;
  }, [terrain]);

  const { grassBlocks, dirtBlocks, stoneBlocks } = useMemo(() => {
    const chunk = terrain.generateChunk(chunkX, chunkZ);
    const blocks = terrain.getBlocksForRendering(chunk);

    const grassBlocks = blocks.filter(
      (block) => block.type === BlockType.GRASS,
    );
    const dirtBlocks = blocks.filter((block) => block.type === BlockType.DIRT);
    const stoneBlocks = blocks.filter(
      (block) => block.type === BlockType.STONE,
    );

    return { grassBlocks, dirtBlocks, stoneBlocks };
  }, [chunkX, chunkZ, terrain, updateTrigger]);

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
