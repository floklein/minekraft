import { Stats } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { PLAYER_EYE_HEIGHT } from "@/lib/collision";
import Player from "./Player";
import World from "./World";

function PlayerCoordinates({
  onCoordsUpdate,
}: {
  onCoordsUpdate: (coords: { x: number; y: number; z: number }) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    onCoordsUpdate({
      x: camera.position.x,
      y: camera.position.y - PLAYER_EYE_HEIGHT,
      z: camera.position.z,
    });
  });

  return null;
}

export default function MinecraftGame() {
  const [playerCoords, setPlayerCoords] = useState({ x: 0, y: 0, z: 0 });

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 25, 0],
        }}
        shadows
        scene={{ background: new THREE.Color(0x87ceeb) }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 50]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <Player />
        <World />
        <PlayerCoordinates onCoordsUpdate={setPlayerCoords} />

        <Stats className="!bottom-0 !top-auto !right-0 !left-auto" />
      </Canvas>

      <div className="absolute top-4 left-4 border-2 border-gray-800 bg-gray-900/90 p-3 text-white shadow-lg">
        <h3 className="mb-2 font-bold text-gray-300 text-sm">Controls</h3>
        <div className="space-y-1 text-xs">
          <p>
            <span className="text-yellow-400">WASD</span> - Move
          </p>
          <p>
            <span className="text-yellow-400">Mouse</span> - Look around
          </p>
          <p>
            <span className="text-yellow-400">Space</span> - Jump
          </p>
          <p className="mt-2 text-gray-400">Click to enable mouse</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 border-2 border-gray-800 bg-gray-900/90 p-3 text-white shadow-lg">
        <h3 className="mb-2 font-bold text-gray-300 text-sm">Position</h3>
        <div className="space-y-1 font-mono text-xs">
          <p>
            X:{" "}
            <span className="text-cyan-400">{playerCoords.x.toFixed(1)}</span>
          </p>
          <p>
            Y:{" "}
            <span className="text-cyan-400">{playerCoords.y.toFixed(1)}</span>
          </p>
          <p>
            Z:{" "}
            <span className="text-cyan-400">{playerCoords.z.toFixed(1)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
