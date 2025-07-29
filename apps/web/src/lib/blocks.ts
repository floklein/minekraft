import * as THREE from "three";
import dirtTexture from "@/assets/default_dirt.png";
import grassTexture from "@/assets/default_grass.png";
import stoneTexture from "@/assets/default_stone.png";

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

const textureLoader = new THREE.TextureLoader();
const textures = new Map<BlockType, THREE.Texture>();

function loadTexture(blockType: BlockType, texturePath: string): THREE.Texture {
  if (!textures.has(blockType)) {
    const texture = textureLoader.load(texturePath);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    textures.set(blockType, texture);
  }
  const texture = textures.get(blockType);
  if (!texture) {
    throw new Error(`Texture not found for block type: ${blockType}`);
  }
  return texture;
}

export function getBlockTexture(blockType: BlockType): THREE.Texture {
  switch (blockType) {
    case BlockType.GRASS:
      return loadTexture(BlockType.GRASS, grassTexture);
    case BlockType.DIRT:
      return loadTexture(BlockType.DIRT, dirtTexture);
    case BlockType.STONE:
      return loadTexture(BlockType.STONE, stoneTexture);
    default:
      return loadTexture(BlockType.DIRT, dirtTexture);
  }
}

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
    map: getBlockTexture(blockType),
  });
}
