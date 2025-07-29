import type { TerrainGenerator } from "./terrain";

// Axis-Aligned Bounding Box
export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

// Player collision box dimensions
export const PLAYER_WIDTH = 0.6; // Player width (X and Z)
export const PLAYER_HEIGHT = 1.8; // Player height (Y)
export const PLAYER_EYE_HEIGHT = 1.62; // Eye height from feet

export class CollisionSystem {
  private groundHeightCache = new Map<string, number>();
  private maxCacheSize = 200;

  constructor(private terrain: TerrainGenerator) {}

  private getPositionKey(x: number, z: number): string {
    // Round to nearest integer for caching
    return `${Math.floor(x)},${Math.floor(z)}`;
  }

  // Create player AABB at given position
  createPlayerAABB(x: number, y: number, z: number): AABB {
    const halfWidth = PLAYER_WIDTH / 2;
    return {
      minX: x - halfWidth,
      maxX: x + halfWidth,
      minY: y,
      maxY: y + PLAYER_HEIGHT,
      minZ: z - halfWidth,
      maxZ: z + halfWidth,
    };
  }

  // Create block AABB
  createBlockAABB(blockX: number, blockY: number, blockZ: number): AABB {
    return {
      minX: blockX,
      maxX: blockX + 1,
      minY: blockY,
      maxY: blockY + 1,
      minZ: blockZ,
      maxZ: blockZ + 1,
    };
  }

  // Check if two AABBs intersect
  aabbIntersects(a: AABB, b: AABB): boolean {
    return (
      a.minX < b.maxX &&
      a.maxX > b.minX &&
      a.minY < b.maxY &&
      a.maxY > b.minY &&
      a.minZ < b.maxZ &&
      a.maxZ > b.minZ
    );
  }

  // Get all blocks that could collide with the given AABB
  getCollidingBlocks(aabb: AABB): { x: number; y: number; z: number }[] {
    const blocks: { x: number; y: number; z: number }[] = [];

    const minBlockX = Math.floor(aabb.minX);
    const maxBlockX = Math.floor(aabb.maxX);
    const minBlockY = Math.floor(aabb.minY);
    const maxBlockY = Math.floor(aabb.maxY);
    const minBlockZ = Math.floor(aabb.minZ);
    const maxBlockZ = Math.floor(aabb.maxZ);

    for (let x = minBlockX; x <= maxBlockX; x++) {
      for (let y = minBlockY; y <= maxBlockY; y++) {
        for (let z = minBlockZ; z <= maxBlockZ; z++) {
          if (this.terrain.isBlockSolidAt(x, y, z)) {
            blocks.push({ x, y, z });
          }
        }
      }
    }

    return blocks;
  }

  // Check if position would collide with terrain
  wouldCollide(x: number, y: number, z: number): boolean {
    const playerAABB = this.createPlayerAABB(x, y, z);
    const collidingBlocks = this.getCollidingBlocks(playerAABB);

    for (const block of collidingBlocks) {
      const blockAABB = this.createBlockAABB(block.x, block.y, block.z);
      if (this.aabbIntersects(playerAABB, blockAABB)) {
        return true;
      }
    }

    return false;
  }

  // Move with collision detection - returns final position
  moveWithCollision(
    fromX: number,
    fromY: number,
    fromZ: number,
    deltaX: number,
    deltaY: number,
    deltaZ: number,
  ): {
    x: number;
    y: number;
    z: number;
    collided: { x: boolean; y: boolean; z: boolean };
  } {
    // Try movement on each axis separately for better collision handling
    const collided = { x: false, y: false, z: false };

    // Try X movement first
    let newX = fromX;
    if (deltaX !== 0) {
      const testX = fromX + deltaX;
      if (!this.wouldCollide(testX, fromY, fromZ)) {
        newX = testX;
      } else {
        collided.x = true;
      }
    }

    // Try Z movement
    let newZ = fromZ;
    if (deltaZ !== 0) {
      const testZ = fromZ + deltaZ;
      if (!this.wouldCollide(newX, fromY, testZ)) {
        newZ = testZ;
      } else {
        collided.z = true;
      }
    }

    // Try Y movement last (for proper ground/ceiling detection)
    let newY = fromY;
    if (deltaY !== 0) {
      const testY = fromY + deltaY;
      if (!this.wouldCollide(newX, testY, newZ)) {
        newY = testY;
      } else {
        collided.y = true;
      }
    }

    return {
      x: newX,
      y: newY,
      z: newZ,
      collided,
    };
  }

  // Check if player is on ground
  isOnGround(x: number, y: number, z: number): boolean {
    // Method 1: Check if we would collide when moving slightly down
    if (this.wouldCollide(x, y - 0.01, z)) {
      return true;
    }

    // Method 2: Check if there's a solid block directly below the player
    // We check multiple points around the player's feet for better detection
    const halfWidth = PLAYER_WIDTH / 2;
    const testPoints = [
      { x: x - halfWidth + 0.1, z: z - halfWidth + 0.1 },
      { x: x + halfWidth - 0.1, z: z - halfWidth + 0.1 },
      { x: x - halfWidth + 0.1, z: z + halfWidth - 0.1 },
      { x: x + halfWidth - 0.1, z: z + halfWidth - 0.1 },
      { x: x, z: z }, // Center point
    ];

    // Check if any of the test points have solid ground below
    for (const point of testPoints) {
      // Check both the current Y level and slightly below
      if (
        this.terrain.isBlockSolidAt(
          Math.floor(point.x),
          Math.floor(y - 0.5),
          Math.floor(point.z),
        ) ||
        this.terrain.isBlockSolidAt(
          Math.floor(point.x),
          Math.floor(y),
          Math.floor(point.z),
        )
      ) {
        return true;
      }
    }

    return false;
  }

  // Get ground height at position
  getGroundHeight(x: number, z: number): number {
    const key = this.getPositionKey(x, z);

    // Check cache first
    if (this.groundHeightCache.has(key)) {
      const cachedHeight = this.groundHeightCache.get(key);
      if (cachedHeight !== undefined) {
        return cachedHeight;
      }
    }

    // Start from terrain height and work up to find the highest solid block
    const terrainHeight = this.terrain.getTerrainHeight(
      Math.floor(x),
      Math.floor(z),
    );

    let groundHeight = terrainHeight + 1;
    for (let y = terrainHeight + 10; y >= 0; y--) {
      if (this.terrain.isBlockSolidAt(Math.floor(x), y, Math.floor(z))) {
        groundHeight = y + 1; // Return top of the block
        break;
      }
    }

    // Cache the result with LRU eviction
    if (this.groundHeightCache.size >= this.maxCacheSize) {
      const firstKey = this.groundHeightCache.keys().next().value;
      if (firstKey) {
        this.groundHeightCache.delete(firstKey);
      }
    }

    this.groundHeightCache.set(key, groundHeight);
    return groundHeight;
  }
}
