import { type Block, BlockType, CHUNK_SIZE, WORLD_HEIGHT } from "./blocks";
import { SimplexNoise } from "./noise";

export interface Chunk {
  x: number;
  z: number;
  blocks: Block[][][];
}

export class TerrainGenerator {
  private noise: SimplexNoise;
  private scale = 0.05;
  private amplitude = 8;
  private baseHeight = 20;
  private chunkCache = new Map<string, Chunk>();
  private maxCacheSize = 100; // Limit cache size to prevent memory issues

  constructor(seed = 42) {
    this.noise = new SimplexNoise(seed);
  }

  private getChunkKey(chunkX: number, chunkZ: number): string {
    return `${chunkX},${chunkZ}`;
  }

  generateChunk(chunkX: number, chunkZ: number): Chunk {
    const key = this.getChunkKey(chunkX, chunkZ);

    // Check cache first
    if (this.chunkCache.has(key)) {
      return this.chunkCache.get(key)!;
    }

    const blocks: Block[][][] = [];

    // Initialize 3D array
    for (let x = 0; x < CHUNK_SIZE; x++) {
      blocks[x] = [];
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        blocks[x][y] = [];
        for (let z = 0; z < CHUNK_SIZE; z++) {
          blocks[x][y][z] = {
            type: BlockType.AIR,
            x: chunkX * CHUNK_SIZE + x,
            y,
            z: chunkZ * CHUNK_SIZE + z,
          };
        }
      }
    }

    // Generate terrain
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = chunkX * CHUNK_SIZE + x;
        const worldZ = chunkZ * CHUNK_SIZE + z;

        // Generate height using noise
        const noiseValue = this.noise.noise2D(
          worldX * this.scale,
          worldZ * this.scale,
        );
        const height = Math.floor(
          this.baseHeight + noiseValue * this.amplitude,
        );

        // Ensure height is within bounds
        const clampedHeight = Math.max(1, Math.min(height, WORLD_HEIGHT - 1));

        // Fill blocks from bottom to height
        for (let y = 0; y <= clampedHeight; y++) {
          if (y === clampedHeight) {
            // Top layer is grass
            blocks[x][y][z].type = BlockType.GRASS;
          } else if (y >= clampedHeight - 3 && y < clampedHeight) {
            // Next 3 layers are dirt
            blocks[x][y][z].type = BlockType.DIRT;
          } else {
            // Everything else is stone
            blocks[x][y][z].type = BlockType.STONE;
          }
        }
      }
    }

    const chunk = {
      x: chunkX,
      z: chunkZ,
      blocks,
    };

    // Cache the chunk with LRU eviction
    if (this.chunkCache.size >= this.maxCacheSize) {
      // Remove oldest entry (first key)
      const firstKey = this.chunkCache.keys().next().value;
      if (firstKey) {
        this.chunkCache.delete(firstKey);
      }
    }

    this.chunkCache.set(key, chunk);
    return chunk;
  }

  getBlocksForRendering(chunk: Chunk): Block[] {
    const renderBlocks: Block[] = [];

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          const block = chunk.blocks[x][y][z];

          if (block.type !== BlockType.AIR) {
            // Only render blocks that have at least one exposed face
            if (this.shouldRenderBlock(chunk, x, y, z)) {
              renderBlocks.push(block);
            }
          }
        }
      }
    }

    return renderBlocks;
  }

  private shouldRenderBlock(
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
  ): boolean {
    // Check if any adjacent block is air (simplified check)
    const adjacentPositions = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ];

    for (const [ax, ay, az] of adjacentPositions) {
      if (
        ax < 0 ||
        ax >= CHUNK_SIZE ||
        ay < 0 ||
        ay >= WORLD_HEIGHT ||
        az < 0 ||
        az >= CHUNK_SIZE
      ) {
        // Block is at chunk boundary, render it
        return true;
      }

      if (chunk.blocks[ax][ay][az].type === BlockType.AIR) {
        // Adjacent block is air, render this block
        return true;
      }
    }

    return false;
  }

  // Get terrain height at world position
  getTerrainHeight(worldX: number, worldZ: number): number {
    const noiseValue = this.noise.noise2D(
      worldX * this.scale,
      worldZ * this.scale,
    );
    const height = Math.floor(this.baseHeight + noiseValue * this.amplitude);
    return Math.max(1, Math.min(height, WORLD_HEIGHT - 1));
  }

  // Check if there's a solid block at the given world position
  isBlockSolidAt(worldX: number, worldY: number, worldZ: number): boolean {
    // Convert to integers
    const blockX = Math.floor(worldX);
    const blockY = Math.floor(worldY);
    const blockZ = Math.floor(worldZ);

    // Get chunk coordinates
    const chunkX = Math.floor(blockX / CHUNK_SIZE);
    const chunkZ = Math.floor(blockZ / CHUNK_SIZE);

    // Get local coordinates within chunk
    let localX = blockX - chunkX * CHUNK_SIZE;
    let localZ = blockZ - chunkZ * CHUNK_SIZE;

    // Handle negative coordinates
    if (localX < 0) localX += CHUNK_SIZE;
    if (localZ < 0) localZ += CHUNK_SIZE;

    // Check bounds
    if (
      localX < 0 ||
      localX >= CHUNK_SIZE ||
      localZ < 0 ||
      localZ >= CHUNK_SIZE ||
      blockY < 0 ||
      blockY >= WORLD_HEIGHT
    ) {
      return false;
    }

    // Generate chunk if needed (simplified - in a real game you'd cache chunks)
    const chunk = this.generateChunk(chunkX, chunkZ);
    const block = chunk.blocks[localX][blockY][localZ];

    return block.type !== BlockType.AIR;
  }
}
