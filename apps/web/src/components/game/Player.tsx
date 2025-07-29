import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { PointerLockControls as PointerLockControlsType } from "three-stdlib";
import { PLAYER_EYE_HEIGHT } from "@/lib/collision";
import { useCollision } from "./TerrainContext";

const MOVEMENT_SPEED = 5;
const JUMP_FORCE = 8;
const GRAVITY = -20;

export default function Player() {
  const { camera } = useThree();
  const collision = useCollision();
  const controlsRef = useRef<PointerLockControlsType | null>(null);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const playerPositionRef = useRef(new THREE.Vector3(0, 0, 0)); // Player feet position
  const initializedRef = useRef(false);
  const isGroundedRef = useRef(false);
  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          keysRef.current.w = true;
          break;
        case "KeyA":
          keysRef.current.a = true;
          break;
        case "KeyS":
          keysRef.current.s = true;
          break;
        case "KeyD":
          keysRef.current.d = true;
          break;
        case "Space":
          event.preventDefault();
          if (isGroundedRef.current) {
            keysRef.current.space = true;
          }
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          keysRef.current.w = false;
          break;
        case "KeyA":
          keysRef.current.a = false;
          break;
        case "KeyS":
          keysRef.current.s = false;
          break;
        case "KeyD":
          keysRef.current.d = false;
          break;
        case "Space":
          keysRef.current.space = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera;

    // Initialize player position on first frame
    if (!initializedRef.current) {
      const groundHeight = collision.getGroundHeight(0, 0);
      playerPositionRef.current.set(0, groundHeight, 0);
      camera.position.set(0, groundHeight + PLAYER_EYE_HEIGHT, 0);
      initializedRef.current = true;
    }

    if (!controlsRef.current?.isLocked) return;

    const velocity = velocityRef.current;
    const playerPosition = playerPositionRef.current;

    // Get camera direction for movement
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    // Movement input
    const moveVector = new THREE.Vector3();

    if (keysRef.current.w) moveVector.add(direction);
    if (keysRef.current.s) moveVector.sub(direction);
    if (keysRef.current.d) moveVector.add(right);
    if (keysRef.current.a) moveVector.sub(right);

    if (moveVector.length() > 0) {
      moveVector.normalize();
      velocity.x = moveVector.x * MOVEMENT_SPEED;
      velocity.z = moveVector.z * MOVEMENT_SPEED;
    } else {
      velocity.x *= 0.8; // Friction
      velocity.z *= 0.8;
    }

    // Check if on ground
    const wasGrounded = isGroundedRef.current;
    isGroundedRef.current = collision.isOnGround(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z,
    );

    // Debug logging for ground detection
    if (wasGrounded !== isGroundedRef.current) {
      console.log(
        `Ground state changed: ${wasGrounded} -> ${isGroundedRef.current} at position:`,
        playerPosition.x.toFixed(2),
        playerPosition.y.toFixed(2),
        playerPosition.z.toFixed(2),
      );
    }

    // Jump
    if (keysRef.current.space && isGroundedRef.current) {
      console.log("JUMPING! velocity.y =", JUMP_FORCE);
      velocity.y = JUMP_FORCE;
      keysRef.current.space = false;
    } else if (keysRef.current.space && !isGroundedRef.current) {
      console.log("Cannot jump - not grounded");
    }

    // Apply gravity (always apply, collision system will handle stopping at ground)
    velocity.y += GRAVITY * delta;

    // Calculate movement deltas
    const deltaX = velocity.x * delta;
    const deltaY = velocity.y * delta;
    const deltaZ = velocity.z * delta;

    // Move with collision detection
    const result = collision.moveWithCollision(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z,
      deltaX,
      deltaY,
      deltaZ,
    );

    // Update velocity if we hit something
    if (result.collided.x) {
      velocity.x = 0;
    }
    if (result.collided.y) {
      velocity.y = 0;
    }
    if (result.collided.z) {
      velocity.z = 0;
    }

    // Update player position (feet)
    playerPosition.set(result.x, result.y, result.z);

    // Update camera position (eyes)
    camera.position.set(result.x, result.y + PLAYER_EYE_HEIGHT, result.z);
  });

  return (
    <PointerLockControls ref={controlsRef} camera={camera} pointerSpeed={0.5} />
  );
}
