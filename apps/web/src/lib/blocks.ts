import * as THREE from "three";

export enum BlockType {
  AIR = 0,
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
}

export interface Block {
  type: BlockType;
  x: number;
  y: number;
  z: number;
}

export const BLOCK_SIZE = 1;
export const CHUNK_SIZE = 16;
export const WORLD_HEIGHT = 64;

export function getBlockColor(blockType: BlockType): THREE.Color {
  switch (blockType) {
    case BlockType.GRASS:
      return new THREE.Color(0x4a7c34);
    case BlockType.DIRT:
      return new THREE.Color(0x8b4513);
    case BlockType.STONE:
      return new THREE.Color(0x696969);
    default:
      return new THREE.Color(0xffffff);
  }
}

export function createBlockGeometry(): THREE.BoxGeometry {
  return new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

export function createBlockMaterial(
  blockType: BlockType,
): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({
    color: getBlockColor(blockType),
  });
}
