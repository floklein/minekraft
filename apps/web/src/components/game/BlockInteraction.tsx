import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RaycastHelper } from "@/lib/raycast";
import { useGameStore } from "@/zustand/game";
import { useInventoryStore } from "@/zustand/inventory";

export default function BlockInteraction() {
  const { camera } = useThree();

  const terrain = useGameStore((state) => state.terrain);
  const selectedBlock = useInventoryStore((state) => state.selectedBlock);

  const raycastHelper = useRef(new RaycastHelper(terrain));

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      const result = raycastHelper.current.cast(camera.position, direction);
      if (result) {
        if (event.button === 0) {
          terrain.removeBlock(
            result.blockPosition.x,
            result.blockPosition.y,
            result.blockPosition.z,
          );
        } else if (event.button === 2) {
          terrain.setBlock(
            result.adjacentBlockPosition.x,
            result.adjacentBlockPosition.y,
            result.adjacentBlockPosition.z,
            selectedBlock,
          );
        }
      }
    };
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [camera, terrain, selectedBlock]);

  return null;
}
