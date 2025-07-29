import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Player from "./Player";
import { TerrainProvider } from "./TerrainContext";
import World from "./World";

export default function MinecraftGame() {
  return (
    <div className="relative h-full w-full">
      <TerrainProvider>
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

          <Stats />
        </Canvas>
      </TerrainProvider>

      <div className="absolute top-4 left-4 rounded bg-black/50 p-2 text-white">
        <p>WASD: Move</p>
        <p>Mouse: Look</p>
        <p>Space: Jump</p>
        <p>Click to enable mouse look</p>
      </div>
    </div>
  );
}
