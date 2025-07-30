import { useFrame, useThree } from "@react-three/fiber";
import { PLAYER_EYE_HEIGHT } from "@/lib/collision";
import { useGameStore } from "@/zustand/game";

export default function PlayerCoordinates() {
  const x = useGameStore((state) => state.playerCoords.x);
  const y = useGameStore((state) => state.playerCoords.y);
  const z = useGameStore((state) => state.playerCoords.z);

  return (
    <div className="absolute top-4 right-4 border-4 border-gray-500 bg-gray-700/80 p-3 text-white backdrop-blur-sm">
      <div className="space-y-1 font-mono text-xs">
        <p>
          X: <span className="text-cyan-400">{x}</span>
        </p>
        <p>
          Y: <span className="text-cyan-400">{y}</span>
        </p>
        <p>
          Z: <span className="text-cyan-400">{z}</span>
        </p>
      </div>
    </div>
  );
}

export function GetPlayerCoordinates() {
  const { camera } = useThree();
  const setPlayerCoords = useGameStore((state) => state.setPlayerCoords);

  useFrame(() => {
    setPlayerCoords({
      x: camera.position.x.toFixed(1),
      y: (camera.position.y - PLAYER_EYE_HEIGHT).toFixed(1),
      z: camera.position.z.toFixed(1),
    });
  });

  return null;
}
