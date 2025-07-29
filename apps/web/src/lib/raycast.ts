import * as THREE from "three";
import { BLOCK_SIZE, CHUNK_SIZE, WORLD_HEIGHT } from "@/lib/blocks";
import type { TerrainGenerator } from "@/lib/terrain";

interface RaycastResult {
  hit: boolean;
  point: THREE.Vector3;
  normal: THREE.Vector3;
  blockPosition: THREE.Vector3;
  adjacentBlockPosition: THREE.Vector3;
}

export class RaycastHelper {
  private terrain: TerrainGenerator;

  constructor(terrain: TerrainGenerator) {
    this.terrain = terrain;
  }

  private worldToBlockCoords(worldPos: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(
      Math.floor(worldPos.x / BLOCK_SIZE),
      Math.floor(worldPos.y / BLOCK_SIZE),
      Math.floor(worldPos.z / BLOCK_SIZE),
    );
  }

  private getBlockAt(x: number, y: number, z: number): boolean {
    if (y < 0 || y >= WORLD_HEIGHT) return false;

    const modifiedBlock = this.terrain.getModifiedBlock(x, y, z);
    if (modifiedBlock !== null) {
      return modifiedBlock !== 0;
    }

    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkZ = Math.floor(z / CHUNK_SIZE);
    const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const localZ = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

    const chunk = this.terrain.generateChunk(chunkX, chunkZ);
    return chunk.blocks[localX][y][localZ].type !== 0;
  }

  cast(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    maxDistance = 6,
  ): RaycastResult | null {
    const step = 0.1;
    const ray = new THREE.Ray(origin, direction.normalize());

    for (let distance = 0; distance < maxDistance; distance += step) {
      const point = ray.at(distance, new THREE.Vector3());
      const blockPos = this.worldToBlockCoords(point);

      if (this.getBlockAt(blockPos.x, blockPos.y, blockPos.z)) {
        const prevPoint = ray.at(distance - step, new THREE.Vector3());
        const prevBlockPos = this.worldToBlockCoords(prevPoint);

        const normal = new THREE.Vector3();
        if (prevBlockPos.x !== blockPos.x)
          normal.x = prevBlockPos.x - blockPos.x;
        if (prevBlockPos.y !== blockPos.y)
          normal.y = prevBlockPos.y - blockPos.y;
        if (prevBlockPos.z !== blockPos.z)
          normal.z = prevBlockPos.z - blockPos.z;

        return {
          hit: true,
          point: point.clone(),
          normal: normal.normalize(),
          blockPosition: blockPos,
          adjacentBlockPosition: prevBlockPos,
        };
      }
    }

    return null;
  }
}
