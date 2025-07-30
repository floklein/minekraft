import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import AOEffects from "./AOEffects";
import BlockInteraction from "./BlockInteraction";
import Crosshair from "./Crosshair";
import InventoryBar from "./InventoryBar";
import Player from "./Player";
import PlayerCoordinates, { GetPlayerCoordinates } from "./PlayerCoordinates";
import World from "./World";

export default function MinecraftGame() {
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
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-camera-near={1}
          shadow-camera-far={400}
          shadow-bias={-0.001}
        />

        <Player />
        <World />
        <BlockInteraction />
        <AOEffects />
        <GetPlayerCoordinates />

        <Stats className="!bottom-0 !top-auto !right-0 !left-auto" />
      </Canvas>

      <div className="absolute top-4 left-4 border-4 border-gray-500 bg-gray-700/80 p-3 text-white backdrop-blur-sm">
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

      <PlayerCoordinates />
      <Crosshair />
      <InventoryBar />
    </div>
  );
}
