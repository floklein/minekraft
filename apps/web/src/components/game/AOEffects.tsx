import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  SSAO,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

export default function AOEffects() {
  return (
    <EffectComposer enableNormalPass>
      <SSAO
        samples={21}
        radius={0.15}
        intensity={20}
        luminanceInfluence={0.9}
        color={new THREE.Color("black")}
      />
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        radius={0.85}
      />
      <Vignette offset={0.3} darkness={0.4} />
      <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={2} />
      <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
    </EffectComposer>
  );
}
