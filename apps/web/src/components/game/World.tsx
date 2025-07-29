import { useMemo } from "react";
import Terrain from "./Terrain";

export default function World() {
  // Generate a 3x3 grid of chunks centered around origin
  const chunks = useMemo(() => {
    const chunkList = [];
    const renderDistance = 1; // How many chunks in each direction

    for (let x = -renderDistance; x <= renderDistance; x++) {
      for (let z = -renderDistance; z <= renderDistance; z++) {
        chunkList.push({ x, z });
      }
    }

    return chunkList;
  }, []);

  return (
    <group>
      {/* Test cube to verify rendering works */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshLambertMaterial color="red" />
      </mesh>

      {chunks.map(({ x, z }) => (
        <Terrain key={`${x}-${z}`} chunkX={x} chunkZ={z} />
      ))}
    </group>
  );
}
